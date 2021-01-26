import React from 'react'
import {
    Collapse,
    Navbar,
    NavbarToggler,
    NavbarBrand,
    Nav,
    NavItem,
    NavLink,
    Container
} from 'reactstrap'
import { Redirect } from 'react-router-dom'
import LocalStorageService from '../services/local-storage';

class AppNavBar extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            token: LocalStorageService.getValue('token')
        }
    }

    componentDidMount(){
        const token = LocalStorageService.getValue('token');
        let userInfo = LocalStorageService.getValue('userInfo');
        userInfo = userInfo != null ? JSON.parse(userInfo): null; 
        this.setState({token,userInfo});
    }

    toggle = () => {
        this.setState({
            isOpen: !this.state.isOpen
        })
    }

    renderRedirect = () => {
        if (this.state.redirect) {
          return <Redirect to='/Login' />
        }
    }

    goToSignIn(){
        this.setState({redirect:true})
    }

    cerrarSesion(){
        LocalStorageService.clear()
        window.location = '/';
    }

    render() {
        return(
            <div>
                {this.renderRedirect()}
                <Navbar style={{backgroundColor: '#0A351C'}} dark expand="sm">
                    <Container>
                        <NavbarBrand href="/">FisicApp</NavbarBrand>
                        <NavbarToggler onClick={this.toggle} />
                        <Collapse isOpen={this.state.isOpen} navbar>
                                {this.state.token && this.state.userInfo ? 
                                    (<Nav className="ml-auto" navbar><NavItem>
                                        <NavLink className="text-light" disabled  href="#">
                                        {this.state.userInfo.nickname}
                                        </NavLink>
                                    </NavItem>
                                    <NavItem>
                                        <NavLink onClick={() => this.cerrarSesion()} href="#">
                                        Cerrar Sesión
                                        </NavLink>
                                    </NavItem>
                                    </Nav>
                                    ):
                                    (<Nav className="ml-auto" navbar><NavItem></NavItem><NavItem>
                                        <NavLink onClick={() => this.goToSignIn()} href="#">
                                        Iniciar Sesión
                                        </NavLink>
                                    </NavItem>
                                    </Nav>
                                    )}
                        </Collapse>
                    </Container>
                </Navbar>
            </div>
        )
    }
}

export default AppNavBar