import React, { Component } from 'react';
import { Navbar, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';

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
        <Navbar color="faded" className="navbar-dark bg-dark">
          <NavbarBrand href="/">Tasks Master</NavbarBrand>
          <Nav pills>
            <NavItem>
              <NavLink href="#" active>Tasks</NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#"><Link to={'/taskslist'}>My Tasks</Link></NavLink>

            </NavItem>
            <NavItem>
              <NavLink href="#">Complete</NavLink>
            </NavItem>
          </Nav>
        </Navbar>
      </div>
    )
  }
}

export default Header;
