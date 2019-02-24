import { Link } from 'react-router-dom'
import React from 'react'
import { Navbar, Nav } from 'react-bootstrap'

const Header = (props) => {
  let nav = null
  switch (props.isAuthenticated) {
    case true:
      nav =
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='mr-auto'>
            <Nav.Link href='#/'>Home</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      break
    default:
      break
  }

  return (
    <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
      <Navbar.Brand href='#/'>Stock Tracker</Navbar.Brand>
      <Navbar.Toggle aria-controls='responsive-navbar-nav' />
      {nav}
    </Navbar>
  )
}

export default Header
