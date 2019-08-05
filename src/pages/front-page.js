import React from 'react'
import {
    BrowserRouter as Router,
    Route 
} from "react-router-dom";
import { Container } from 'reactstrap'

import 'bootstrap/dist/css/bootstrap.min.css'

import AppNavBar from '../components/AppNavBar'

import Feed from '../components/Feed'
import Post from '../components/Post'
import Create from '../components/Create'

class FrontPage extends React.Component {
    render() {
        return (
            <Router>
                <Container className="front-page">
                    <AppNavBar />
                    <Route exact path="/" component={Feed} />
                    <Route path="/post/:postId" component={Post} />
                    <Route path="/create" component={Create} />
                </Container>
            </Router>
        )
    }
}

export default FrontPage