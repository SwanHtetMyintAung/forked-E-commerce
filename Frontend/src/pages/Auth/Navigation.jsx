import React from 'react';
import { useState } from 'react';
import { Container, Navbar, Nav, NavDropdown, Form, Button, Badge } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import {  useSelector } from 'react-redux';
import '../../../public/css/Nav.css';
import Model from '../../components/Model.jsx';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartPlus } from '@fortawesome/free-solid-svg-icons';
import {
  useGetCartQuery
} from "../../redux/api/cartApiSlice.js";

function Navigation() {
  const [show, setShow] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
  const isAdmin = userInfo?.data?.isAdmin;
  const { data: cart, isLoading, error, refetch } = useGetCartQuery();

 
  const location = useLocation();
  
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

 

  // Helper function to determine if the tab is active
  const isActive = (path) => location.pathname === path;

  return (
      <React.Fragment>

<Navbar expand="lg" className="nav-bar">
      <Container fluid>
        {/* Logo */}
        <Link to="/" className="px-5">
          <img
            src="/images/mega_mart_logo.png"
            alt="Mega Mart Logo"
            style={{ width: '50px', height: 'auto' }}
          />
        </Link>

        {/* Navbar Toggle for Mobile View */}
        <Navbar.Toggle aria-controls="navbarScroll" />

        {/* Collapsible Navbar Section */}
        <Navbar.Collapse id="navbarScroll">
          <Nav className="me-auto my-2 my-lg-0" navbarScroll>
            {/* Navigation Links */}
            {!userInfo ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/"
                  className={`nav-tab mx-4 ${isActive('/') ? 'active-tab' : ''}`}
                >
                  Home
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/about"
                  className={`nav-tab mx-4 ${isActive('/about') ? 'active-tab' : ''}`}
                >
                  About
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/products"
                  className={`nav-tab mx-4 ${isActive('/product') ? 'active-tab' : ''}`}
                >
                  Products
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/contact"
                  className={`nav-tab mx-4 ${isActive('/contact') ? 'active-tab' : ''}`}
                >
                  Contact
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/register"
                  className={`nav-tab mx-4 ${isActive('/register') ? 'active-tab' : ''}`}
                >
                  Register
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/login"
                  className={`nav-tab mx-4 ${isActive('/login') ? 'active-tab' : ''}`}
                >
                  Login
                </Nav.Link>
              </>
            ) : !isAdmin ? (
              <>
                <Nav.Link
                  as={Link}
                  to="/"
                  className={`nav-tab mx-4 ${isActive('/') ? 'active-tab' : ''}`}
                >
                  Home
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/about"
                  className={`nav-tab mx-4 ${isActive('/about') ? 'active-tab' : ''}`}
                >
                  About
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/products"
                  className={`nav-tab mx-4 ${isActive('/product') ? 'active-tab' : ''}`}
                >
                  Products
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/contact"
                  className={`nav-tab mx-4 ${isActive('/contact') ? 'active-tab' : ''}`}
                >
                  Contact
                </Nav.Link>
                <NavDropdown
                  title="User"
                  className="nav-dropdown mx-4"
                  id="navbarScrollingDropdown"
                >
                  <NavDropdown.Item
                    as={Link}
                    to="/user/profile"
                    className="nav-dropdown-item"
                  >
                    Profile
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    onClick={handleShow}
                    className="nav-dropdown-item"
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
                <Nav.Link
                  as={Link}
                  to="/user/cart"
                  className={`nav-tab mx-4 ${isActive('/cart') ? 'active-tab' : ''}`}
                >
                 <FontAwesomeIcon icon={faCartPlus} className='me-2' />Your Cart 
                 <Badge className='ms-1'>{cart?.cartItems.length}</Badge>
                </Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link
                  as={Link}
                  to="/"
                  className={`nav-tab mx-4 ${isActive('/') ? 'active-tab' : ''}`}
                >
                  Home
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/about"
                  className={`nav-tab mx-4 ${isActive('/about') ? 'active-tab' : ''}`}
                >
                  About
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/products"
                  className={`nav-tab mx-4 ${isActive('/product') ? 'active-tab' : ''}`}
                >
                  Product
                </Nav.Link>
                <Nav.Link
                  as={Link}
                  to="/contact"
                  className={`nav-tab mx-4 ${isActive('/contact') ? 'active-tab' : ''}`}
                >
                  Contact
                </Nav.Link>
                <NavDropdown
                  title="Admin"
                  className="nav-dropdown mx-4"
                  id="navbarScrollingDropdown"
                >
                  <NavDropdown.Item
                    as={Link}
                    to="/admin/dashboard"
                    className="nav-dropdown-item"
                  >
                    Dashboard
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item
                    onClick={handleShow}
                    className="nav-dropdown-item"
                  >
                    Logout
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            )}
          </Nav>

          {/* Search Form */}
          <Form className="d-flex">
            <Form.Control
              type="search"
              placeholder="Type your email..."
              className="me-2"
              aria-label="Search"
            />
            <Button variant="outline-primary" type="submit">
              Subscribe
            </Button>
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>

    <Model  handleClose={handleClose} show={show}/>

      </React.Fragment>
     
  );
}

export default Navigation;
