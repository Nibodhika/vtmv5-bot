import React from 'react';
import {Navbar, Alert, Button, Modal, Form, Dropdown, DropdownButton } from 'react-bootstrap';


class MainBar extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            user: null
        };

        this.handleLogout = this.handleLogout.bind(this);
        this.onLogin = this.onLogin.bind(this);
    }

    componentDidMount() {
        var self = this;
        fetch('/api/login')
            .then(function (response) {
                if(response.status === 200){
                    var user = response.json()
                        .then((user) => 
                              self.setState({
                                  user: user
                              })
                             );
                }
                else{
                    self.setState({user:null});
                }
            });
    }

    handleLogout(){
        var self = this;
        fetch('/api/logout')
            .then(function (response) {
                self.setState({user:null});
            });
    }

    onLogin(user){
        this.setState({user:user});
    }
    
    render(){
        let login_or_logout;
        if(this.state.user){
            login_or_logout = 
                <DropdownButton
                  alignRight
                  variant='secondary'
                  size='sm'
                  id="user-dropdown"
                  title={this.state.user.name}
                >

                  <Dropdown.Item disabled>
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item disabled>
                    Settings
                  </Dropdown.Item>

                  <Dropdown.Divider />

                  <Dropdown.Item
                    variant="danger"
                    onClick={this.handleLogout} >
                    Logout</Dropdown.Item>

                </DropdownButton>
            // <Button
            //                 className="pull-right"
            //                 variant="danger"
            //                 onClick={this.handleLogout}
            //               >
            //                 Logout
            //               </Button>;
        }
        else {
            login_or_logout = <LoginModal onLogin={this.onLogin}/>;
        }
        
        return (
            <Navbar bg="dark"
                    variant="dark"
                    sticky="top"
                    className="justify-content-between"

            >
              <Navbar.Brand href="#home">
                <img
                  alt=""
                  src="/logo.svg"
                  width="30"
                  height="30"
                  className="d-inline-block align-top"
                />
                {' VtmV5'}
              </Navbar.Brand>
              
              {login_or_logout}
            </Navbar>
        );
    }
}

class LoginModal extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            visible: false,
            error: null
        };

        this.handleClose = this.handleClose.bind(this);
        this.handleShow = this.handleShow.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleClose(){
        this.setState({visible: false});
    }
    handleShow(){
        this.setState({visible: true});
    }

    handleSubmit(event) {
        var self = this;

        const data = JSON.stringify({
            username: event.target.username.value,
            password: event.target.password.value
        });
        
        fetch(
            '/api/login',
            {
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: data
            })
            .then(function (response) {
                let err;
                if(response.status === 200){
                    response.json()
                        .then(user =>
                              self.props.onLogin(user));
                }
                else if(response.status === 403){
                    err = "Wrong Username or Password";
                }
                else{
                    err = "Unknown error";
                }
                self.setState({error:err});
            });
    }

    render(){
        let error_alert;
        if(this.state.error){
            error_alert = <Alert key="err_msg" variant="danger">
                <span className="glyphicon glyphicon-exclamation-sign" aria-hidden="true"></span>
                {this.state.error}
              </Alert>;
        }
        return (
            <>
              <Button
                variant="primary"
                onClick={this.handleShow}
              >
                Login
              </Button>
              
              <Modal
                show={this.state.visible}
                onHide={this.handleClose}>
                <Modal.Header closeButton>
                  <Modal.Title>Login</Modal.Title>
                </Modal.Header>
                <Form onSubmit={this.handleSubmit}>
                  <Modal.Body>
                    
                    <Form.Group>
                      <Form.Label>Username</Form.Label>
                      <Form.Control type="text"
                                    placeholder="Username"
                                    name="username"
                      />
                    </Form.Group>
                    
                    <Form.Group>
                      <Form.Label>Password</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Password"
                        name="password"
                      />
                    </Form.Group>

                    <br />
                    {error_alert}

                  </Modal.Body>
                  
                  <Modal.Footer>
                    <Button
                      variant="primary"
                      type="submit"
                    >
                      Login
                    </Button>

                  </Modal.Footer>
                </Form>
              </Modal>
            </>
        );
    }
}

export default MainBar;
