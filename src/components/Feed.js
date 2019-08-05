import React from 'react'
import {
    Container,
    ListGroup,
    ListGroupItem,
    Button,
    Badge,
    Pagination, 
    PaginationItem, 
    PaginationLink
} from 'reactstrap'
import { Link } from 'react-router-dom'
import axios from 'axios'

class Feed extends React.Component {
    constructor() {
        super()
        
        this.pageSize = 50
        this.pagesCount = 1

        this.state = {
            currentPage: 0,
            posts: []
        }
    }

    async componentDidMount() {
        try {
            const res = await axios.get('/question')
            this.setState({posts: res.data})
            this.pagesCount = Math.ceil(res.data.length / this.pageSize)
        } catch (e) {
            console.log(e)            
        }
    }

    handleClick(e, index) {
        e.preventDefault()
        this.setState({currentPage: index})
    }

    render() {
        const posts = this.state.posts
        const { currentPage } = this.state

        return(
            <Container className="front-posts">
                <Button
                    color="primary" 
                    size="lg" 
                    block
                    href="/create"
                    className="create-posts-btn"
                >Crear Post
                </Button>
                <ListGroup className="front-posts-list">
                    {posts.map((item) => (
                        <ListGroupItem key={item.id} tag="button">
                            <Link to={`/post/${item.id}`}>
                                {item.statement}  <Badge pill>3</Badge>
                            </Link>
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

export default Feed