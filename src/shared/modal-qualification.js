import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import axios from 'axios';
import LocalStorageService from '../services/local-storage';

const CALIFICACIONES = [1,2,3,4,5,6,7,8,9,10]

class ModalQualification extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false,
      qualification: 0,
      description: ""
    };

    this.toggle = this.toggle.bind(this);
    this.addQualification = this.addQualification.bind(this);
  }

  componentDidMount(){
    const token = LocalStorageService.getValue('token');
    let userInfo = LocalStorageService.getValue('userInfo');
    userInfo = userInfo != null ? JSON.parse(userInfo): null; 
    this.setState({token,userInfo});
}

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  addQualification(){
    if(this.props.tipo === "pregunta" && this.props.id){
        axios.post('https://fisicapp.herokuapp.com/api/question_qualification',{
            description : this.state.description,
            qualification : this.state.qualification,
            id_question: this.props.id
        }).then(() => {
            this.props.updateQualifications();
            this.toggle()
        },() => this.setState({error:true}))
    }
    if(this.props.tipo === "respuesta" && this.props.id){
      axios.post('https://fisicapp.herokuapp.com/api/answer_qualification',{
          description : this.state.description,
          qualification : this.state.qualification,
          id_answer: this.props.id
      }).then(() => {
          this.props.updateQualifications();
          this.toggle()
        },() => this.setState({error:true}))
  }
  }

  onChange(e){
    e.preventDefault();
    this.setState({[e.target.name]: e.target.value});
}

  render() {
    const state = this.state;
    if(!this.state.token){
      return null;
    }
    return (
      <div>
        {this.props.tipo === "pregunta" ? (<Button onClick={this.toggle}>Calificar {this.props.tipo}</Button>) : (<button className = "float-right text-dark btn btn-link" onClick={this.toggle}>Calificar {this.props.tipo}</button>) }
        <Modal isOpen={state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Calificar {this.props.tipo}</ModalHeader>
          <ModalBody>
            <label>Agregar Calificacion</label>
            <Input type="text" name="description" id="post" placeholder="Descripcion" value={state.description} onChange={e => this.onChange(e)}>
                            </Input>
                            <br></br>
            <Input type="select" name="qualification" id="exampleSelect" value={state.qualification} onChange={e => this.onChange(e)}>
                {
                    CALIFICACIONES.map((calificacion) => (
                        <option key={calificacion} value={calificacion}>{calificacion}</option>
                    ))
                }
            </Input>
          </ModalBody>
          <ModalFooter>
            {this.state.error ? (<p>Error al calificar</p>): null}
            <Button color="primary" onClick={this.addQualification}>Calificar</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ModalQualification;