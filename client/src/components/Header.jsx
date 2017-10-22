import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, NavbarToggler, Collapse } from 'reactstrap';
import { NavLink } from 'react-router-dom';
import { firebaseApp } from '../firebase';

class Header extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  signOut() {
    firebaseApp.auth().signOut();
  }

  render() {
    return (
      <div>
        <Navbar color="faded" inverse className="navbar-toggleable-md header-block">
          {/* <a href="/" className="header-logo"></a> */}
          <NavbarBrand href="/" className="header-title" style={{color: '#FFFFFF'}}>
            Tasks Master
            <span className="header-logo"></span>
          </NavbarBrand>
          <NavbarToggler right onClick={this.toggle} className="menu-btn" />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto header-menu" navbar>
              <NavItem className="block-task header-button-block">
                <NavLink className="nav-link header-button task" to={'/app'} activeStyle={{ fontWeight: 'bold' }}>Задания</NavLink>
              </NavItem>
              <NavItem className="block-my-task header-button-block">
                <NavLink className="nav-link header-button my-task" to={'/mytaskslist'} activeStyle={{ fontWeight: 'bold' }}>Мои задания</NavLink>
              </NavItem>
              <NavItem className="block-task-complete header-button-block">
                <NavLink className="nav-link header-button task-complete" to={'/completedtasks'} activeStyle={{ fontWeight: 'bold' }}>Завершенные</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
            <div className="header-right">
              <div className="block-cabinet">
                <NavLink className="nav-link cabinet-link" to={'/cabinet'} style={{color: '#fff'}} activeStyle={{ fontWeight: 'bold' }}><i className="fa fa-user-o"></i></NavLink>
              </div>

              <button
                className="btn btn-danger btn-exit"
                onClick={() => this.signOut()}
              >
                <i className="fa fa-sign-out" aria-hidden="true"></i> <span>Выход</span>
              </button>
            </div>
        </Navbar>

      </div>
    )
  }
}

export default Header;
