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
import axios from 'axios'

class Post extends React.Component {
    constructor(props) {
        super(props)

        this.pageSize = 50
        this.pagesCount = 1

        this.state = {
            currentPage: 0,
            Q: [],
            A: []
        }
    }

    async componentDidMount() {
        try {
            const question = await axios.get(`/question/${this.props.match.params.postId}`)
            const answer = await axios.get(`/question/${this.props.match.params.postId}/answers`)
            this.pagesCount = Math.ceil(answer.data.length / this.pageSize)
            this.setState({ Q: question.data, A:answer.data })
            console.log(question,answer)
        } catch (e) {
            console.log(e)
        }
    }

    handleClick(e, index) {
        e.preventDefault()
        this.setState({ currentPage: index })
    }

    render() {
        const answers = this.state.A
        const { currentPage } = this.state
        console.log(this.state)
        return(
            <Container className="post-card">
                <h1>{this.state.Q.statement}</h1>
                <img src={this.state.Q.url} alt="Problem img" />
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