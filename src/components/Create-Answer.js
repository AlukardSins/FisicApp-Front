import React from 'react'
import {
    Col,
    Button,
    Form,
    FormGroup,
    Input,
    Alert
} from 'reactstrap'
import axios from 'axios'

const ERROR_MESSAGE_DEFAULT = "Error al crear la respuesta";
const ERROR_ANSWER = "La respuesta no puede estar vacia";
const SUCCESS_MESSAGE = "Respuesta creada correctamente";

class CreateAnswer extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            answer:"",
            error: false,
            success: false,
            errorMessage: ERROR_MESSAGE_DEFAULT
        }
        this.onDismissError = this.onDismissError.bind(this);
        this.onDismissSuccess = this.onDismissSuccess.bind(this);
    }
    
    onSubmit() {
        if(this.validaciones()){
            return;
        }
        axios.post('/answer',{
            response : this.state.answer,
            creation_date : new Date(),
            id_question: this.props.idQuestion
        }).then(() => {
            this.showSuccessAlert()
            this.props.loadAnswers()
        })
    }

    cleanData(){
        this.setState({
            answer:"",
        });
    }

    onChange(e){
        e.preventDefault();
        this.setState({[e.target.name]: e.target.value});
    }

    validaciones(){
        if(this.state.answer === ""){
            this.showErrorAlert(ERROR_ANSWER)
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

    render() {
        const state = this.state
        return (
            <div className="mt-5">
                <Alert color="success" isOpen={state.success} toggle={this.onDismissSuccess}>
                    {SUCCESS_MESSAGE}
                </Alert>
                <Alert color="warning" isOpen={state.error} toggle={this.onDismissError}>
                    {this.state.errorMessage}
                </Alert>
                <Form>
                    <FormGroup row>
                        <Col sm={12}>
                            <Input type="text" name="answer" id="answer" placeholder="Escriba la respuesta" value={state.answer} onChange={e => this.onChange(e)}>
                            </Input>
                        </Col>
                    </FormGroup>
                    <Button
                        color="primary"
                        size="lg"
                        block
                        className="create-posts-btn"
                        onClick={() => this.onSubmit()}>Crear Respuesta
                    </Button>
                </Form>
            </div>
        )
    }
}

export default CreateAnswer