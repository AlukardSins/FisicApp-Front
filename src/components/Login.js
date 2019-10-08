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
import SessionStorageService from '../services/local-storage';

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
        axios.post('/app-user/login',{
            username : this.state.username,
            password: this.state.password
        })
        .then(data => {
            SessionStorageService.setValue('token',data.data.id)
            window.location.reload()
        })
        .then(() => this.showErrorAlert(ERROR_MESSAGE_DEFAULT))
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

    render() {
        const state = this.state
        return (
            <Container>
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
                    <Button
                        color="primary"
                        size="lg"
                        block
                        className="Login-posts-btn"
                        onClick={() => this.onSubmit()}>Login
                    </Button>
                </Form>
            </Container>
        )
    }
}

export default Login