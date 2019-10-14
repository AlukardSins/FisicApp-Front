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

const ERROR_MESSAGE_DEFAULT = "Error al iniciar sesion";
const ERROR_EMPTY = "Faltan campos";

class SignIn extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            username:"",
            password:"",
            role:"",
            error: false,
            errorMessage: ERROR_MESSAGE_DEFAULT
        }
        this.onDismissError = this.onDismissError.bind(this);
    }

    onSubmit() {
        if(this.validaciones()){
            return;
        }
        axios.post('/app-user',{
            username : this.state.username,
            password: this.state.password,
            email : this.state.email,
            nickname: this.state.nickname,
            role: this.state.role
        })
        .then(() => window.location = '/Login')
        .then(() => this.showErrorAlert(ERROR_MESSAGE_DEFAULT))
    }

    onChange(e){
        e.preventDefault();
        this.setState({[e.target.name]: e.target.value});
    }

    validaciones(){
        if(this.state.username === "" || this.state.password === "" || this.state.email === "" || this.state.username === ""){
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
                <h2 className="my-3">Registrarse</h2>
                <Alert color="warning" isOpen={state.error} toggle={this.onDismissError}>
                    {this.state.errorMessage}
                </Alert>
                <Form>
                    <FormGroup row>
                        <Col sm={12}>
                            <Input type="text" name="nickname" id="nickname" placeholder="Nickname" value={state.nickname} onChange={e => this.onChange(e)}>
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm={12}>
                            <Input type="email" name="email" id="email" placeholder="Email" value={state.email} onChange={e => this.onChange(e)}>
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Col sm={12}>
                            <Input type="text" name="username" id="username" placeholder="Username" value={state.username} onChange={e => this.onChange(e)}>
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
                        <Col sm={12}>
                            <Input type="text" name="role" id="role" placeholder="Rol" value={state.role} onChange={e => this.onChange(e)}>
                            </Input>
                        </Col>
                    </FormGroup>
                    <Button
                        color="primary"
                        size="lg"
                        block
                        className="Login-posts-btn"
                        onClick={() => this.onSubmit()}>Registrarse
                    </Button>
                </Form>
            </Container>
        )
    }
}

export default SignIn