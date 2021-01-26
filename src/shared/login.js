import React from 'react'
import {
    Container,
    Col,
    Button,
    Form,
    FormGroup,
    Input,
    Alert
} from 'reactstrap'
import axios from 'axios'
import LocalStorageService from '../services/local-storage';
import { Redirect } from 'react-router-dom'

const ERROR_MESSAGE_DEFAULT = "Error al iniciar sesion";
const ERROR_EMPTY = "Faltan campos";

class Login extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            username:"",
            password:"",
            error: false,
            errorMessage: ERROR_MESSAGE_DEFAULT
        }
        this.onDismissError = this.onDismissError.bind(this);
    }

    onSubmit() {
        if(this.validaciones()){
            return;
        }
        axios.post('https://fisicapp.herokuapp.com/api/app-user/login',{
            username : this.state.username,
            password: this.state.password
        })
        .then(data => {
            LocalStorageService.setValue('token',data.data.id)
            this.loadUserInfo(data.data.userId)
        },() => this.showErrorAlert(ERROR_MESSAGE_DEFAULT))
    }

    loadUserInfo(userid){
        axios.get(`https://fisicapp.herokuapp.com/api/app-user/${userid}`).then(data => {
            LocalStorageService.setValue('userInfo',JSON.stringify(data.data))
        }).then(()=>  window.location = '/')
    }

    onChange(e){
        e.preventDefault();
        this.setState({[e.target.name]: e.target.value});
    }

    validaciones(){
        if(this.state.username === "" || this.state.password === ""){
            this.showErrorAlert(ERROR_EMPTY)
            return true;
        }
        return false;
    }

    onDismissError() {
        this.setState({ error: false })
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

    renderRedirect = () => {
        if (this.state.signin) {
          return <Redirect to='/SignIn' />
        }
    }

    goToSignIn(){
        this.setState({signin:true})
    }

    render() {
        const state = this.state
        return (
            <Container>
                {this.renderRedirect()}
                <h2 className="my-3">Iniciar Sesion</h2>
                <Alert color="warning" isOpen={state.error} toggle={this.onDismissError}>
                    {this.state.errorMessage}
                </Alert>
                <Form>
                    <FormGroup row>
                        <Col sm={12}>
                            <Input type="text" name="username" id="username" placeholder="Username / Email" value={state.username} onChange={e => this.onChange(e)}>
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm={12}>
                            <Input type="password" name="password" id="password" placeholder="Password" value={state.password} onChange={e => this.onChange(e)}>
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm={6}>
                            <Button
                                color="secondary"
                                size="lg"
                                block
                                className="Login-posts-btn"
                                onClick={() => this.goToSignIn()}>Ir a Registrarse
                            </Button>
                        </Col>
                        <Col sm={6}>
                            <Button
                                color="primary"
                                size="lg"
                                block
                                className="Login-posts-btn"
                                onClick={() => this.onSubmit()}>Iniciar Sesion
                            </Button>
                        </Col>
                    </FormGroup>
                </Form>
            </Container>
        )
    }
}

export default Login