import React from 'react'
import {
    Container,
    ListGroup,
    ListGroupItem,
    Badge,
    Pagination, 
    PaginationItem, 
    PaginationLink
} from 'reactstrap'
import { Link } from 'react-router-dom'
import axios from 'axios'

class Theme extends React.Component {
    constructor() {
        super()
        
        this.pageSize = 10

        this.state = {
            pagesCount: 1,
            currentPage: 0,
            posts: []
        }
    }

    async componentDidMount() {
        try {
            if(this.props.match && this.props.match.params.themeId){
                await axios.get(`/theme/${this.props.match.params.themeId}/Questions`).then(data => this.paginateData(data));
            }else{
                await axios.get(`/question`).then(data => this.paginateData(data));
            }
            
        } catch (e) {
            console.log(e)            
        }
    }

    paginateData(data){
        const posts = []
        const questions = data.data.sort((question1, question2) => {
            const dateA = new Date(question1.creation_date)
            const dateB = new Date(question2.creation_date);
            return dateB - dateA;
        })
        const pagesCount =  Math.ceil(questions.length / this.pageSize)
        for(let i = 0; i<pagesCount; i++) {
            posts[i] = questions.splice(0,this.pageSize)
        }
        this.setState({
            posts,
            pagesCount
        })
    }

    handleClick(e, index) {
        e.preventDefault()
        this.setState({currentPage: index})
    }

    render() {
        const { currentPage, posts, pagesCount } = this.state
        let postsToShow = posts[currentPage] || posts;
        return(
            <Container className="front-posts">
                <h2 className="mt-3">Preguntas</h2>
                <ListGroup className="mt-3">
                    {postsToShow.map((item) => (
                        <ListGroupItem key={item.id} tag="button">
                            <Link to={`/post/${item.id}`}>
                                {item.statement}  <Badge pill>3</Badge>
                            </Link>
                        </ListGroupItem>
                    ))}
                </ListGroup>

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
                </Pagination>
            </Container>
        )
    }
}

export default Theme