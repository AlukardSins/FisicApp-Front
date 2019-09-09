import React from 'react'
import {
    BrowserRouter as Router,
    Route 
} from "react-router-dom";
import { Container } from 'reactstrap'

import 'bootstrap/dist/css/bootstrap.min.css'

import AppNavBar from '../shared/AppNavBar'

import Feed from '../components/Feed'
import Post from '../components/Post'
import Create from '../components/Create'
import Course from '../components/Course';
import Theme from '../components/Theme';
import Module from '../components/Module';

class FrontPage extends React.Component {
    render() {
        return (
            <Router>
                <Container className="front-page mb-5">
                    <AppNavBar />
                    <Route exact path="/" component={Feed} />
                    <Route path="/post/:postId" component={Post} />
                    <Route path="/create" component={Create} />
                    <Route path="/course/:courseId" component={Course} />
                    <Route path="/module/:moduleId" component={Module} />
                    <Route path="/theme/:themeId" component={Theme} />
                </Container>
            </Router>
        )
    }
}

export default FrontPage