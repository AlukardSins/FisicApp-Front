import React from 'react'
import {
    Container,
    Col,
    FormGroup
} from 'reactstrap'
import axios from 'axios'
import ModalQualification from '../shared/modal-qualification'
import Answer from './Answer';

class Post extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            question: [],
            qualifications : "sin calificacion"
        }
        this.loadQualifications = this.loadQualifications.bind(this);
    }

    async componentDidMount() {
        try {
            const question = await axios.get(`/question/${this.props.match.params.postId}`)
            this.setState({ question: question.data})
        } catch (e) {
            console.log(e)
        }
        await this.loadQualifications();
    }

    handleClick(e, index) {
        e.preventDefault()
        this.setState({ currentPage: index })
    }

    averageQualifications(qualifications){
        if(qualifications.length !== 0){
            const sum = qualifications
                            .map(qualification => qualification.qualification)
                            .reduce((previous, current) => current += previous);
            this.setState({qualifications : sum / qualifications.length})
        }
    }

    loadQualifications(){
        axios.get(`/question_qualification?filter=%7B%22where%22%3A%7B%22id_question%22%3A%22${this.props.match.params.postId}%22%7D%7D`)
            .then(data => this.averageQualifications(data.data))
    }

    render() {
        return(
            <Container className="post-card">
                <FormGroup row>
                    <Col sm={10}>
                        <h1>{this.state.question.statement}</h1>
                        <h4>Calificacion: {this.state.qualifications}</h4>
                    </Col>
                    <Col sm={2}>
                        <ModalQualification idQuestion={this.state.question.id} updateQualifications={this.loadQualifications}></ModalQualification>
                    </Col>
                </FormGroup>
                <img src={this.state.question.url} alt="Problem img" />
                <Answer idQuestion={this.props.match.params.postId}></Answer>
            </Container>
        )
    }
}

export default Post