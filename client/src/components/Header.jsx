import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, NavItem } from 'reactstrap';
import { NavLink } from 'react-router-dom';

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

  render() {
    return (
      <div style={{marginBottom: '5px'}}>
        <Navbar color="faded" className="navbar-inverse bg-inverse">
          <Nav pills>
            <NavbarBrand href="/">Tasks Master</NavbarBrand>
            <NavItem>
              <NavLink className="nav-link" to={'/app'} activeStyle={{ fontWeight: 'bold' }}>Tasks</NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to={'/taskslist'} activeStyle={{ fontWeight: 'bold' }}>My Tasks</NavLink>
            </NavItem>
            <NavItem>
              <NavLink className="nav-link" to={'/link'} activeStyle={{ fontWeight: 'bold' }}>Complete</NavLink>
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    )
  }
}

export default Header;
