import React, { useState } from "react";
import { Navbar, Nav, NavDropdown, Button } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,       
  faUserEdit,      
  faSignOutAlt, 
  faKey 
} from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaChartLine,
  FaCog,
  FaBars,
  FaMoon,
  FaSun,
  FaChevronDown,
  FaChevronRight,
  FaPlus,
  FaList,
  FaKey,
  FaListAlt,
  FaBoxOpen,
  FaAddressCard,
  FaShoppingBasket
} from "react-icons/fa";
import "../../../public/css/AdminDashboard.css";

function AdminSidebar({ sidebarOpen, setSidebarOpen, darkMode, setDarkMode }) {
  // State for dropdown toggle
  const [dropdownOpen, setDropdownOpen] = useState({
    dashboard: false,
    users: false,
    categories: false,
    products: false,
    contacts: false,
    orders: false,
    settings: false,
  });

  // Toggle dropdown open/close
  const toggleDropdown = (section) => {
    setDropdownOpen((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  return (
    <>
      {/* Sidebar Toggle Button (for mobile) */}
      <Button variant="dark" className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
        <FaBars />
      </Button>

      {/* Sidebar with Animation & Correct z-index */}
      <motion.div
        initial={{ x: -250 }}
        animate={{ x: sidebarOpen ? 0 : -250 }}
        transition={{ type: "spring", stiffness: 100 }}
        className={`sidebar ${sidebarOpen ? "open" : ""}`}
        style={{ zIndex: 1050 }} // Ensures it's above the navbar
      >
        <Navbar expand="lg" className="flex-column align-items-start p-3">
          <Navbar.Brand className="fw-bold text-primary">Admin Panel</Navbar.Brand>
          <Nav className="flex-column w-100">
         
            
            {/* Dashboard Dropdown */}
            <Nav.Item>
            <Nav.Link as={Link} to="/admin/dashboard" onClick={() => setSidebarOpen(false)}>
              <FaHome className="me-2" /> Dashboard
            </Nav.Link>
            </Nav.Item>

            {/* Users Dropdown */}
            <Nav.Item>
              <Nav.Link onClick={() => toggleDropdown("users")} className="sidebar-link">
                <FaUsers className="me-2" /> Users 
                {dropdownOpen.users ? <FaChevronDown /> : <FaChevronRight />}
              </Nav.Link>
              {dropdownOpen.users && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dropdown-content">
                  <Nav.Link as={Link} to="/admin/users/list"> <FaCog className="me-2" />Manage Users </Nav.Link>
                  <Nav.Link as={Link} to="/admin/users/roles"><FaKey className="me-2" />Roles & Permissions</Nav.Link>
                </motion.div>
              )}
            </Nav.Item>

            {/* Category Dropdown */}
            <Nav.Item>
              <Nav.Link onClick={() => toggleDropdown("categories")} className="sidebar-link">
                <FaListAlt className="me-2" /> Category
                {dropdownOpen.categories ? <FaChevronDown /> : <FaChevronRight />}
              </Nav.Link>
              {dropdownOpen.categories && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dropdown-content">
                  <Nav.Link as={Link} to="/admin/category/add"><FaPlus className="me-2" />Add Category</Nav.Link>
                  <Nav.Link as={Link} to="/admin/categories/manage"><FaCog className="me-2" />Manage Categories</Nav.Link>
                </motion.div>
              )}
            </Nav.Item>

             {/* Product Dropdown */}
             <Nav.Item>
              <Nav.Link onClick={() => toggleDropdown("products")} className="sidebar-link">
                <FaBoxOpen className="me-2" /> Product
                {dropdownOpen.products ? <FaChevronDown /> : <FaChevronRight />}
              </Nav.Link>
              {dropdownOpen.products && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dropdown-content">
                  <Nav.Link as={Link} to="/admin/product/add"><FaPlus className="me-2" />Add Product</Nav.Link>
                  <Nav.Link as={Link} to="/admin/products/manage"><FaCog className="me-2" />Manage Products</Nav.Link>
                </motion.div>
              )}
            </Nav.Item>

            {/* Order Dropdown */}
            <Nav.Item>
              <Nav.Link onClick={() => toggleDropdown("orders")} className="sidebar-link">
                <FaShoppingBasket className="me-2" /> Order
                {dropdownOpen.orders ? <FaChevronDown /> : <FaChevronRight />}
              </Nav.Link>
              {dropdownOpen.orders && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dropdown-content">
                  <Nav.Link as={Link} to="/admin/analytics/revenue"><FaCog className="me-2" />Manage Orders</Nav.Link>
                </motion.div>
              )}
            </Nav.Item>

             {/* Contact Dropdown */}
             <Nav.Item>
              <Nav.Link onClick={() => toggleDropdown("contacts")} className="sidebar-link">
                <FaAddressCard className="me-2" /> Contact
                {dropdownOpen.contacts ? <FaChevronDown /> : <FaChevronRight />}
              </Nav.Link>
              {dropdownOpen.contacts && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dropdown-content">
                  <Nav.Link as={Link} to="/admin/analytics/revenue"><FaCog className="me-2" />Manage Contacts</Nav.Link>
                </motion.div>
              )}
            </Nav.Item>

            {/* Settings Dropdown */}
            <Nav.Item>
              <Nav.Link onClick={() => toggleDropdown("settings")} className="sidebar-link">
                <FaCog className="me-2" /> Settings 
                {dropdownOpen.settings ? <FaChevronDown /> : <FaChevronRight />}
              </Nav.Link>
              {dropdownOpen.settings && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="dropdown-content">
                  <Nav.Link as={Link} to="/admin/settings/general">  <FontAwesomeIcon icon={faUser} className="me-2" /> My Profile</Nav.Link>
                  <Nav.Link as={Link} to="/admin/settings/security">  <FontAwesomeIcon icon={faUserEdit} className="me-2" /> Update Profile</Nav.Link>
                  <Nav.Link as={Link} to="/admin/settings/general">   <FontAwesomeIcon icon={faKey} className="me-2" /> Change Password</Nav.Link>
                  <Nav.Link as={Link} to="/admin/settings/general">   <FontAwesomeIcon icon={faSignOutAlt} className="me-2" /> Logout</Nav.Link>
                </motion.div>
              )}
            </Nav.Item>

          </Nav>

          {/* Dark Mode Toggle */}
          <Button variant={darkMode ? "light" : "dark"} className="mt-3" onClick={() => setDarkMode(!darkMode)}>
            {darkMode ? <FaSun /> : <FaMoon />} {darkMode ? "Light Mode" : "Dark Mode"}
          </Button>
        </Navbar>
      </motion.div>
    </>
  );
}

export default AdminSidebar;
