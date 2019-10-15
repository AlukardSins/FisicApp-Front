import React from 'react'
import {
    Container,
    ListGroup,
    ListGroupItem,
    Pagination, 
    PaginationItem, 
    PaginationLink,
} from 'reactstrap'
import { Link } from 'react-router-dom'
import axios from 'axios'

class Course extends React.Component {
    constructor() {
        super()
        
        this.pageSize = 10

        this.state = {
            pagesCount: 1,
            currentPage: 0,
            courses: [],
            questions: []
        }
    }

    async componentDidMount() {
        try {
            await axios.get('https://fisicapp.herokuapp.com/api/course').then(data => this.paginateCourses(data));
        } catch (e) {
            console.log(e)            
        }
    }

    paginateCourses(data){
        const courses = []
        const coursesTemp = data.data
        const pagesCount = Math.ceil(coursesTemp.length / this.pageSize)
        for(let i = 0; i<pagesCount; i++) {
            courses[i] = coursesTemp.splice(0,this.pageSize)
        }
        this.setState({
            courses,
            pagesCount
        })
    }

    handleClick(e, index) {
        e.preventDefault()
        this.setState({currentPage: index})
    }

    render() {
        const { currentPage, courses, pagesCount } = this.state
        let coursesToShow = courses[currentPage] || courses;
        return(
            <Container className="front-posts">
                <h2 className="mt-3">Cursos</h2>
                <ListGroup className="mt-3">
                    {coursesToShow.map((item) => (
                        <ListGroupItem key={item.id} tag="button">
                            <Link to={`/course/${item.id}/module`}>
                                {item.name}
                            </Link>
                        </ListGroupItem>
                    ))}
                </ListGroup>

                <Pagination aria-label="Page navigation for front posts." className="my-5 text-center">

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

export default Course