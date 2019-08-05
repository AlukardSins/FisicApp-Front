import React from 'react';
import { Button, Modal, ModalHeader, ModalBody, ModalFooter, Input } from 'reactstrap';
import axios from 'axios';

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

  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  addQualification(){
    if(this.props.idQuestion){
        axios.post('/question_qualification',{
            description : this.state.description,
            qualification : this.state.qualification,
            id_question: this.props.idQuestion
        }).then(() => {
            this.props.updateQualifications();
            this.toggle()
        })
    }
  }

  onChange(e){
    e.preventDefault();
    this.setState({[e.target.name]: e.target.value});
}

  render() {
    const state = this.state;
    return (
      <div>
        <Button onClick={this.toggle}>Calificar pregunta</Button>
        <Modal isOpen={state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Calificar pregunta</ModalHeader>
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
            <Button color="primary" onClick={this.addQualification}>Calificar</Button>
          </ModalFooter>
        </Modal>
      </div>
    );
  }
}

export default ModalQualification;