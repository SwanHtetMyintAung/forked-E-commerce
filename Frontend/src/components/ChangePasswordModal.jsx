import react,{useState} from 'react'
import { Modal, Button, Form } from 'react-bootstrap';

function ChangePasswordModal({ show, onHide, onConfirm }) {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    
    const handleOnChange = () =>{
        setError("");
    }
    const handleClearAll = () =>{
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
    }

    const handleConfirm = () => {
        if(!currentPassword || !newPassword || !confirmPassword){
            setError("Fields can't be empty!");
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('New passwords do not match.');
            return;
        }

        onConfirm({ currentPassword, newPassword });
        handleClearAll();
    };
    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Change Password</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <p className="text-danger">{error}</p>}
                <Form style={{color:"black"}}>
                    <Form.Group controlId="currentPassword">
                        <Form.Label className='mt-3' style={{color:"inherit"}}>Current Password:</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter current password"
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value) | handleOnChange() }
                        />
                    </Form.Group>

                    <Form.Group controlId="newPassword">
                        <Form.Label className='mt-3' style={{color:"inherit"}}>New Password:</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value) | handleOnChange() }
                        />
                    </Form.Group>

                    <Form.Group controlId="confirmPassword">
                        <Form.Label className='mt-3' style={{color:"inherit"}}>Confirm New Password:</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value) | handleOnChange() }
                        />
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                 <Button variant="danger" onClick={handleClearAll}>
                    Clear All
                </Button>
                <Button variant="secondary" onClick={onHide}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={handleConfirm}>
                    Confirm
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

export default ChangePasswordModal;
