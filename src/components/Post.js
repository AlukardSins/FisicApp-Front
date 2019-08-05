import React from 'react'
import {
    Container,
    ListGroup,
    ListGroupItem,
    Button,
    Badge,
    Pagination,
    PaginationItem,
    PaginationLink,
    Col,
    FormGroup
} from 'reactstrap'
import axios from 'axios'
import ModalQualification from '../shared/modal-qualification'

class Post extends React.Component {
    constructor(props) {
        super(props)

        this.pageSize = 50
        this.pagesCount = 1

        this.state = {
            currentPage: 0,
            question: [],
            answers: [],
            qualifications : "sin calificacion"
        }
        this.loadQualifications = this.loadQualifications.bind(this);
    }

    async componentDidMount() {
        try {
            const question = await axios.get(`/question/${this.props.match.params.postId}`)
            const answer = await axios.get(`/question/${this.props.match.params.postId}/answers`)
            this.pagesCount = Math.ceil(answer.data.length / this.pageSize)
            this.setState({ question: question.data, answers:answer.data })
            console.log(question,answer)
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
        console.log(qualifications)
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
        const answers = this.state.answers
        const { currentPage } = this.state
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
                <Button
                    color="primary"
                    size="lg"
                    block
                    href="/create"
                    className="create-posts-btn"
                >Responder
                </Button>
                <ListGroup className="front-posts-list">
                    {answers.map((item) => (
                        <ListGroupItem key={item.id} tag="button">                           
                            {item.response}  <Badge pill>3</Badge>
                        </ListGroupItem>
                    ))}
                </ListGroup>
                <Pagination aria-label="Page navigation for front posts." className="front-posts-list-pager">

                    <PaginationItem disabled={currentPage <= 0}>

                        <PaginationLink
                            onClick={e => this.handleClick(e, currentPage - 1)}
                            previous
                            href="#"
                        />

                    </PaginationItem>

                    {[...Array(this.pagesCount)].map((page, i) =>
                        <PaginationItem active={i === currentPage} key={i}>
                            <PaginationLink onClick={e => this.handleClick(e, i)} href="#">
                                {i + 1}
                            </PaginationLink>
                        </PaginationItem>
                    )}

                    <PaginationItem disabled={currentPage >= this.pagesCount - 1}>

                        <PaginationLink
                            onClick={e => this.handleClick(e, currentPage + 1)}
                            next
                            href="#"
                        />

                    </PaginationItem>
                </Pagination>
            </Container>
        )
    }
}

export default Post