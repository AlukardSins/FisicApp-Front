import React from 'react'
import {
    BrowserRouter as Router,
    Route 
} from "react-router-dom";
import { Container } from 'reactstrap'

import 'bootstrap/dist/css/bootstrap.min.css'

import AppNavBar from '../shared/AppNavBar'

import Feed from '../components/Feed'
import PostDetail from '../components/post/postDetail'
import Create from '../components/post/create'
import Course from '../components/post/course';
import Theme from '../components/post/theme';
import Post from '../components/post/post';
import Module from '../components/post/module';
import SignIn from '../shared/signIn';
import Login from '../shared/login';


class FrontPage extends React.Component {

    constructor(){
        super()
        this.state = {
            token: null
        }
    }

    render() {
        return (
            <Router>
                <Container className="front-page mb-5">
                    <AppNavBar />
                    <Route exact path="/" component={Feed} />
                    <Route path="/post/:postId" component={PostDetail} />
                    <Route path="/create" component={Create} />
                    <Route path="/courses" component={Course} />
                    <Route path="/course/:courseId/module" component={Module} />
                    <Route path="/module/:moduleId/theme" component={Theme} />
                    <Route path="/theme/:themeId/post" component={Post} />
                    <Route path="/SignIn" component={SignIn} />
                    <Route path="/Login" component={Login} />
                </Container>
            </Router>
        )
    }
}

export default FrontPage