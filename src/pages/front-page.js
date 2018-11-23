import axios from 'axios'
import React from 'react'
import { Container } from 'reactstrap'

import 'bootstrap/dist/css/bootstrap.min.css'

import AppNavBar from '../components/AppNavBar'
import FrontPosts from '../components/frontPosts'

class FrontPage extends React.Component {
    getInitialProps(from, to) {
        axios.get('/question')
            .then()
            .catch()
    }

    componentDidMount() {

    }

    render() {
        return (
            <Container className="page-body">
                <AppNavBar />
                <FrontPosts />
            </Container>
        )
    }
}

export default FrontPage