import React from 'react'
import {
    Container,
    Col,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Alert,
    FormText
} from 'reactstrap'
import axios from 'axios'
import LocalStorageService from '../../services/local-storage';
import firebase from "../../services/firebase";
import FileUploader from "react-firebase-file-uploader";
import { Redirect } from 'react-router-dom'
import cargando from '../../images/cargando.svg';

const ERROR_MESSAGE_DEFAULT = "Error al crear la pregunta";
const ERROR_THEME = "Debe seleccionar un tema";
const ERROR_IMAGE_ONLY = "Solo se pueden cargar imagenes";
const ERROR_UPLOAD_IMAGE = "Error al cargar la imagen";
const ERROR_POST = "La pregunta no puede estar vacia";
const SUCCESS_MESSAGE = "Pregunta creada correctamente";
const ERROR_LOGIN = "Debe estar logeado para crear un post";

class Create extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            courses: [],
            modules: [],
            themes: [],
            post:"",
            error: false,
            success: false,
            file: null,
            fileUrl: null,
            loading: false,
            errorMessage: ERROR_MESSAGE_DEFAULT
        }
        this.onDismissError = this.onDismissError.bind(this);
        this.onDismissSuccess = this.onDismissSuccess.bind(this);
    }

    async componentDidMount() {
        try {
            const courses = await axios.get('https://fisicapp.herokuapp.com/api/course')
            this.setState({ courses: courses.data })
        } catch (e) {
            console.log(e)
        }
        const token = LocalStorageService.getValue('token');
        this.setState({token});
    }
    
    onSubmit() {
        if(this.validaciones()){
            return;
        }
        this.setState({loading:true})
        if(this.state.file && !this.state.fileUrl){
            this.startUploadImage()
        }else{
            this.guardarPost()
        }
    }

    guardarPost(){
        axios.post('https://fisicapp.herokuapp.com/api/question',{
            statement : this.state.post,
            creation_date : new Date(),
            id_theme: this.state.theme,
            url: this.state.fileUrl
        }).then(() => this.setState({redirect:true,loading:false}))
    }

    async getModules(e) {
        e.preventDefault()
        this.setState({
            modules: [],
            themes: []
        });
        const modules = await axios.get('https://fisicapp.herokuapp.com/api/course/' + e.target.value + '/modules')
        this.setState({ modules: modules.data })
    }

    async getThemes(e) {
        e.preventDefault()
        const themes = await axios.get('https://fisicapp.herokuapp.com/api/module/' + e.target.value + '/Themes')
        this.setState({ themes: themes.data })
    }

    cleanData(){
        this.setState({
            modules: [],
            themes: [],
            post:"",
        });
    }

    disabledIfEmpty(array){
       return (array.length === 0)? "disabled" : "";
    }

    onChange(e){
        e.preventDefault();
        this.setState({[e.target.name]: e.target.value});
    }

    validaciones(){
        if(this.state.file && !this.state.file.type.startsWith('image')){
            this.showErrorAlert(ERROR_IMAGE_ONLY)
            return true;
        }
        if(!this.state.theme){
            this.showErrorAlert(ERROR_THEME)
            return true;
        }
        if(this.state.post === ""){
            this.showErrorAlert(ERROR_POST)
            return true;
        }
        if(!this.state.token){
            this.showErrorAlert(ERROR_LOGIN)
            return true;   
        }
        return false;
    }

    onDismissError() {
        this.setState({ error: false })
    }

    onDismissSuccess() {
        this.setState({ success: false })
    }

    showErrorAlert(errorMessage){
        this.setState({
            error:true,
            errorMessage
        });

        window.setTimeout(()=>{
            this.setState({error:false})
        },5000)
    }

    showSuccessAlert(){
        this.cleanData()
        this.setState({success:true})
        window.setTimeout(()=>{
            this.setState({success:false})
          },5000)
    }

    customOnChangeHandler = (event) => {
        const files = event.target.files;
        this.setState({ file: files[0] });
    }

    startUploadImage(){
        this.fileUploader.startUpload(this.state.file)
    }

    handleUploadError = (error) => {
        this.showErrorAlert(ERROR_UPLOAD_IMAGE)
        this.setState({loading:false})
    }

    handleUploadSuccess = filename => {
        firebase
            .storage()
            .ref("images")
            .child(filename)
            .getDownloadURL()
            .then(url => {
                this.setState({ fileUrl: url })
                this.guardarPost()
            });
    }

    renderRedirect = () => {
        if (this.state.redirect) {
          return <Redirect to='/' />
        }
    }

    render() {
        const state = this.state
        return (
            <Container>
                {this.renderRedirect()}
                <Alert color="success" isOpen={state.success} toggle={this.onDismissSuccess}>
                    {SUCCESS_MESSAGE}
                </Alert>
                <Alert color="warning" isOpen={state.error} toggle={this.onDismissError}>
                    {this.state.errorMessage}
                </Alert>
                <h2 className="mt-3">Crear Post</h2>
                <br/>
                <Form>
                    <FormGroup row>
                        <Label for="Course" sm={2}>Curso: </Label>
                        <Col sm={10}>
                            <Input type="select" name="selectCourse" id="selCourse" placeholder="Selecciona el Curso" defaultValue="Selecciona el Curso" onChange={e => this.getModules(e)}
                                disabled = {this.disabledIfEmpty(state.courses)}>
                                <option value="Selecciona el Curso" disabled>Selecciona el Curso</option>
                                {
                                    state.courses.map((item) => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))
                                }
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="Module" sm={2}>Modulo: </Label>
                        <Col sm={10}>
                            <Input type="select" name="selectModule" id="selModule" placeholder="Selecciona el Modulo" defaultValue="Selecciona el Modulo" onChange={e => this.getThemes(e)}
                                disabled = {this.disabledIfEmpty(state.modules)}>
                                <option value="Selecciona el Modulo" disabled>Selecciona el Modulo</option>
                                {
                                    state.modules.map((item) => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))
                                }
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="Theme" sm={2}>Tema: </Label>
                        <Col sm={10}>
                            <Input type="select" name="theme" id="selTheme" placeholder="Selecciona el Tema" defaultValue="Selecciona el Tema" onChange={e => this.onChange(e)}
                                disabled = {this.disabledIfEmpty(state.themes)}>
                                <option value="Selecciona el Tema" disabled>Selecciona el Tema</option>
                                {
                                    state.themes.map((item) => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))
                                }
                            </Input>
                        </Col>
                    </FormGroup>
                    <br/>
                    <FormGroup row>
                        <Col sm={12}>
                            <Label for="file">Escriba la pregunta</Label>
                            <Input type="text" name="post" id="post" placeholder="pregunta" value={state.post} onChange={e => this.onChange(e)}>
                            </Input>
                        </Col>
                    </FormGroup>
                    <br/>
                    <FormGroup>
                        <Label for="file">Cargar Imagen</Label>
                        <br/>
                        <FileUploader
                        accept="image/*"
                        randomizeFilename
                        onChange={this.customOnChangeHandler}
                        storageRef={firebase.storage().ref("images")} 
                        onUploadError={this.handleUploadError}
                        onUploadSuccess={this.handleUploadSuccess}
                        ref={instance => { this.fileUploader = instance; } } 
                        />
                        <FormText color="muted">
                        solo se puede cargar archivos con formato de imagen y de un tamaño menor a 5mb.
                        </FormText>
                    </FormGroup>
                    <br/>
                    <Button
                        color="primary"
                        size="lg"
                        block
                        className="create-posts-btn"
                        onClick={() => this.onSubmit()}>Crear Post
                    </Button>
                    {this.state.loading ? <img src={cargando} alt="cargando..."></img>: null}
                </Form>
            </Container>
        )
    }
}

export default Create