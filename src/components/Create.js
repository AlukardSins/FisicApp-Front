import React from 'react'
import {
    Container,
    Col,
    Button,
    Form,
    FormGroup,
    Label,
    Input
} from 'reactstrap'
import axios from 'axios'

class Create extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            courses: [],
            modules: [],
            themes: []
        }
    }

    async componentDidMount() {
        try {
            const courses = await axios.get('/course')
            this.setState({ courses: courses.data })
        } catch (e) {
            console.log(e)
        }
    }
    
    onSubmit() {

    }

    async getModules(e) {
        e.preventDefault()
        const modules = await axios.get('/course/' + e.target.value + '/modules')
        this.setState({ modules: modules.data })
    }

    async getThemes(e) {
        e.preventDefault()
        const themes = await axios.get('/module/' + e.target.value + '/Themes')
        this.setState({ themes: themes.data })
    }

    handleTheme(e) {
        e.preventDefault()
        this.setState({ theme: e.target.value })
    }

    render() {
        const state = this.state
        
        return (
            <Container>
                <Form>
                    <FormGroup row>
                        <Label for="Course" sm={2}>Curso</Label>
                        <Col sm={10}>
                            <Input type="select" name="selectCourse" id="selCourse" placeholder="Selecciona el Curso" defaultValue="" onChange={e => this.getModules(e)}>
                                {
                                    state.courses.map((item) => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))
                                }
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="Module" sm={2}>Modulo</Label>
                        <Col sm={10}>
                            <Input type="select" name="selectModule" id="selModule" placeholder="Selecciona el Modulo" defaultValue="" onChange={e => this.getThemes(e)}>
                                {
                                    state.modules.map((item) => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))
                                }
                            </Input>
                        </Col>
                    </FormGroup>
                    <FormGroup row>
                        <Label for="Theme" sm={2}>Tema</Label>
                        <Col sm={10}>
                            <Input type="select" name="selectTheme" id="selTheme" placeholder="Selecciona el Tema" defaultValue="" onChange={e => this.handleTheme(e)}>
                                {
                                    state.themes.map((item) => (
                                        <option key={item.id} value={item.id}>{item.name}</option>
                                    ))
                                }
                            </Input>
                        </Col>
                    </FormGroup>
                    <Button
                        color="primary"
                        size="lg"
                        block
                        className="create-posts-btn"
                    >Crear Post
                    </Button>
                </Form>
            </Container>
        )
    }
}

export default Create