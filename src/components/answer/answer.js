import React from 'react'
import {
    Container,
    ListGroup,
    ListGroupItem,
    Pagination, 
    PaginationItem, 
    PaginationLink,
    FormGroup,
    Col
} from 'reactstrap'
import axios from 'axios'
import CreateAnswer from './create-Answer'
import ModalQualification from '../../shared/modal-qualification'

const NO_ANSWERS = "No exiten Respuestas...";

class Answer extends React.Component {
    constructor(props) {
        super(props)
        this.pageSize = 10

        this.state = {
            pagesCount: 1,
            currentPage: 0,
            answers: [],
            qualification: []
        }
        this.loadAnswers = this.loadAnswers.bind(this)
        this.loadQualifications = this.loadQualifications.bind(this);
    }

    async componentDidMount() {
        try {
            if(this.props.idQuestion){
                await this.loadAnswers()
            }  
        } catch (e) {
            console.log(e)            
        }
    }

    loadAnswers(){
        axios.get(`/question/${this.props.idQuestion}/answers`).then(data => this.paginateData(data));
    }

    paginateData(data){
        const answers = []
        const answersTemp = data.data
        if(answersTemp.length === 0){
            this.setState({message:NO_ANSWERS})
            return;
        }else{
            this.setState({message:""})
        }
        const pagesCount =  Math.ceil(answersTemp.length / this.pageSize)
        for(let i = 0; i<pagesCount; i++) {
            answers[i] = answersTemp.splice(0,this.pageSize)
        }
        this.setState({
            answers,
            pagesCount
        })
        this.loadQualifications();
    }

    handleClick(e, index) {
        e.preventDefault()
        this.setState({currentPage: index})
    }

    averageQualifications(qualifications, answerId){
        const { qualification } = this.state
        if(qualifications.length !== 0){
            const sum = qualifications
                            .map(qualification => qualification.qualification)
                            .reduce((previous, current) => current += previous);
            qualification[answerId] = sum / qualifications.length;
        }
        this.setState({qualification})
    }

    loadQualifications(){
        const { currentPage, answers } = this.state
        let answersToShow = answers[currentPage] || answers;
        answersToShow.forEach(answer => {
            axios.get(`/answer_qualification?filter=%7B%22where%22%3A%7B%22id_answer%22%3A%22${answer.id}%22%7D%7D`)
            .then(data => this.averageQualifications(data.data, answer.id))
        });
    }

    render() {
        const { currentPage, answers, pagesCount, qualification } = this.state
        let answersToShow = answers[currentPage] || answers;
        return(
            <Container className="front-posts">
                <h2 className="mt-3">Respuestas</h2>
                <h4 className="mt-3">{this.state.message}</h4>
                <ListGroup className="mt-3">
                    {answersToShow.map((answer) => (
                        <ListGroupItem className="mt-2 text-left" key={answer.id} >
                        <FormGroup row>
                            <Col sm={10}>
                                {answer.response}
                            </Col>
                            <Col sm={2}>
                            {qualification[answer.id] ? (<p className = "float-right">Calificacion: {qualification[answer.id]}</p>): (<p>Sin calificacion</p>)}
                            </Col>
                        </FormGroup>
                        <FormGroup row>
                            <Col sm={12}>
                                <ModalQualification tipo="respuesta" id={answer.id} updateQualifications={this.loadQualifications}></ModalQualification>
                            </Col>
                        </FormGroup>
                        </ListGroupItem>
                    ))}
                </ListGroup>
                {!this.state.message && this.state.pagesCount > 1 ? 
                <Pagination aria-label="Page navigation for front posts." className="mt-5 text-center">
                    <PaginationItem disabled={currentPage <= 0}>
                        <PaginationLink
                            onClick={e => this.handleClick(e, currentPage - 1)}
                            previous
                            href="#"
                        />
                    </PaginationItem>
                    {[...Array(pagesCount)].map((page, i) =>
                        <PaginationItem active={i === currentPage} key={i}>
                            <PaginationLink onClick={e => this.handleClick(e, i)} href="#">
                                {i + 1}
                            </PaginationLink>
                        </PaginationItem>
                    )}
                    <PaginationItem disabled={currentPage >= pagesCount - 1}>
                        <PaginationLink
                            onClick={e => this.handleClick(e, currentPage + 1)}
                            next
                            href="#"
                        />
                    </PaginationItem>
                </Pagination>: null
                }
                <CreateAnswer idQuestion={this.props.idQuestion} loadAnswers={this.loadAnswers}></CreateAnswer>
            </Container>
        )
    }
}

export default Answer