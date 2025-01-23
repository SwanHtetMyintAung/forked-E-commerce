import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { useLogoutMutation } from '../redux/api/userApiSlice.js';
import { logout } from '../redux/features/auth/authSlice.js';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';

function Model({ show, handleClose }) {
    const [logoutApiCall] = useLogoutMutation();
    const dispatch = useDispatch();
    const navigate = useNavigate();
  
    const handleLogout = async () => {
      try {
        await logoutApiCall().unwrap();
        dispatch(logout()); // Dispatch logout action
        handleClose(); // Close the modal
        navigate('/login'); // Navigate to login
      } catch (error) {
        console.error("Logout error:", error);
      }
    };
  
    return (
      <Modal show={show} onHide={handleClose} animation={false} className="bg-dark">
        <Modal.Header closeButton>
          <Modal.Title>Logout</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to logout?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleLogout}>
            Logout
          </Button>
        </Modal.Footer>
      </Modal>
    );
  }

  

export default Model;