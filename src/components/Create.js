import React from 'react'
import {
    Container,
    Col,
    Button,
    Form,
    FormGroup,
    Label,
    Input,
    Alert
} from 'reactstrap'
import axios from 'axios'

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
            errorMessage: "Error al crear la pregunta"
        }
        this.onDismissError = this.onDismissError.bind(this);
        this.onDismissSuccess = this.onDismissSuccess.bind(this);
    }

    async componentDidMount() {
        try {
            const courses = await axios.get('/course')
            this.setState({ courses: courses.data })
        } catch (e) {
            console.log(e)
        }
    }
    
    onSubmit() {
        if(this.validaciones()){
            return;
        }
        axios.post('/question',{
            statement : this.state.post,
            creation_date : new Date().getDate(),
            id_theme: this.state.theme
        }).then(() => this.setState({success:true}))
    }

    async getModules(e) {
        e.preventDefault()
        this.cleanData();
        const modules = await axios.get('/course/' + e.target.value + '/modules')
        this.setState({ modules: modules.data })
    }

    async getThemes(e) {
        e.preventDefault()
        const themes = await axios.get('/module/' + e.target.value + '/Themes')
        this.setState({ themes: themes.data })
    }

    cleanData(){
        this.setState({
            modules: [],
            themes: []
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
        if(!this.state.theme){
            console.log(this.state.theme)
            this.setState({error:true})
            return true;
        }
        if(this.state.post === ""){
            console.log(this.state.post)
            this.setState({error:true})
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

    render() {
        const state = this.state
        return (
            <Container>
                <Alert color="success" isOpen={state.success} toggle={this.onDismissSuccess}>
                    Pregunta creada correctamente
                </Alert>
                <Alert color="warning" isOpen={state.error} toggle={this.onDismissError}>
                    {this.state.errorMessage}
                </Alert>
                <Form>
                    <FormGroup row>
                        <Label for="Course" sm={2}>Curso</Label>
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
                        <Label for="Module" sm={2}>Modulo</Label>
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
                        <Label for="Theme" sm={2}>Tema</Label>
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
                    <FormGroup row>
                        <Col sm={12}>
                            <Input type="text" name="post" id="post" placeholder="Escriba la pregunta" value={state.post} onChange={e => this.onChange(e)}>
                            </Input>
                        </Col>
                    </FormGroup>
                    <Button
                        color="primary"
                        size="lg"
                        block
                        className="create-posts-btn"
                        onClick={() => this.onSubmit()}>Crear Post
                    </Button>
                </Form>
            </Container>
        )
    }
}

export default Create