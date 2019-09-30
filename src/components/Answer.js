import React from 'react'
import {
    Container,
    ListGroup,
    ListGroupItem,
    Pagination, 
    PaginationItem, 
    PaginationLink
} from 'reactstrap'
import axios from 'axios'
import CreateAnswer from '../components/Create-Answer'

const NO_ANSWERS = "No exiten Respuestas...";

class Answer extends React.Component {
    constructor(props) {
        super(props)
        
        this.pageSize = 10

        this.state = {
            pagesCount: 1,
            currentPage: 0,
            answers: []
        }
        this.loadAnswers = this.loadAnswers.bind(this)
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
        }
        const pagesCount =  Math.ceil(answersTemp.length / this.pageSize)
        for(let i = 0; i<pagesCount; i++) {
            answers[i] = answersTemp.splice(0,this.pageSize)
        }
        this.setState({
            answers,
            pagesCount
        })
    }

    handleClick(e, index) {
        e.preventDefault()
        this.setState({currentPage: index})
    }

    render() {
        const { currentPage, answers, pagesCount } = this.state
        let answersToShow = answers[currentPage] || answers;
        return(
            <Container className="front-posts">
                <h2 className="mt-3">Respuestas</h2>
                <h4 className="mt-3">{this.state.message}</h4>
                <ListGroup className="mt-3">
                    {answersToShow.map((item) => (
                        <ListGroupItem className="mt-2 text-left" key={item.id} tag="button">
                                {item.response}
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