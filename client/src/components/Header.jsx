import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap';
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

  signOut() {
    firebaseApp.auth().signOut();
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <div>
        <Navbar color="faded" className="navbar-inverse bg-inverse">
          <Nav pills>
            <NavbarBrand href="/">Tasks Master</NavbarBrand>
            <NavItem className="block-task">
              <NavLink className="nav-link task" to={'/app'} activeStyle={{ fontWeight: 'bold' }}>Задания</NavLink>
            </NavItem>
            <NavItem className="block-my-task">
              <NavLink className="nav-link my-task" to={'/mytaskslist'} activeStyle={{ fontWeight: 'bold' }}>Мои задания</NavLink>
            </NavItem>
            <NavItem className="block-task-complete">
              <NavLink className="nav-link task-complete" to={'/completedtasks'} activeStyle={{ fontWeight: 'bold' }}>Выполненые</NavLink>
            </NavItem>
          </Nav>
        </Navbar>
        <button
          className="btn btn-danger btn-exit"
          onClick={() => this.signOut()}
        >
          Выход
        </button>
      </div>
    )
  }
}

export default Header;
