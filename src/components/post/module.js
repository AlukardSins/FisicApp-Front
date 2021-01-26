import React from 'react'
import {
    Container,
    ListGroup,
    ListGroupItem,
    Pagination, 
    PaginationItem, 
    PaginationLink
} from 'reactstrap'
import { Link } from 'react-router-dom'
import axios from 'axios'

class Module extends React.Component {
    constructor() {
        super()
        
        this.pageSize = 10

        this.state = {
            pagesCount: 1,
            currentPage: 0,
            modules: []
        }
    }

    async componentDidMount() {
        try {
            await axios.get(`https://fisicapp.herokuapp.com/api/course/${this.props.match.params.courseId}/modules`).then(data => this.paginateData(data));
        } catch (e) {
            console.log(e)            
        }
    }

    paginateData(data){
        const modules = []
        const modulesTemp = data.data
        const pagesCount =  Math.ceil(modulesTemp.length / this.pageSize)
        for(let i = 0; i<pagesCount; i++) {
            modules[i] = modulesTemp.splice(0,this.pageSize)
        }
        this.setState({
            modules,
            pagesCount
        })
    }

    handleClick(e, index) {
        e.preventDefault()
        this.setState({currentPage: index})
    }

    render() {
        const { currentPage, modules, pagesCount } = this.state
        let modulesToShow = modules[currentPage] || modules;
        return(
            <Container className="front-posts">
                <h2 className="mt-3">Modulos</h2>
                <ListGroup className="mt-3">
                    {modulesToShow.map((item) => (
                        <ListGroupItem key={item.id} tag="button">
                            <Link to={`/module/${item.id}/theme`}>
                                {item.name}
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

export default Module