import React from 'react'
import {
    Container,
    Button
} from 'reactstrap'
import Post from './post/post';
import Course from './post/course';

class Feed extends React.Component {
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

    render() {
        return(
            <Container className="front-posts">
                <Button
                color="primary" 
                size="lg" 
                block
                href="/create"
                className="create-posts-btn">Crear Post
                </Button>
                <Course></Course>
                <Post></Post>
            </Container>
        )
    }
}

export default Feed