import React, { useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

function UpdateAddressModal({ show, onHide, onConfirm, existingAddress }) {
    const [address, setAddress] = useState(existingAddress || {
        fullName: '',
        phone: '',
        street: '',
        city: '',
        state: '',
        zipCode: '',
        country: '',
    });

    const [error, setError] = useState('');

    const handleOnChange = (e) => {
        setError('');
        setAddress({ ...address, [e.target.name]: e.target.value });
    };

    const handleClearAll = () => {
        setAddress({
            fullName: '',
            phone: '',
            street: '',
            city: '',
            state: '',
            zipCode: '',
            country: '',
        });
        setError('');
    };

    const handleConfirm = () => {
        const { fullName, phone, street, city, state, zipCode, country } = address;

        if (!fullName || !phone || !street || !city || !state || !zipCode || !country) {
            setError("All fields are required!");
            return;
        }

        const phoneRegex = /^\+?[0-9]{10,15}$/;
        if (!phoneRegex.test(phone)) {
            setError("Invalid phone number format.");
            return;
        }

        const zipRegex = /^[A-Za-z0-9]{5,10}$/;
        if (!zipRegex.test(zipCode)) {
            setError("Invalid zip code format.");
            return;
        }
        // Check if at least one field is different from existingAddress
        if (existingAddress && Object.keys(address).every(key => address[key] === existingAddress[key])) {
            setError("No changes detected. Please update at least one field.");
            return;
        }

        onConfirm(address);
        handleClearAll();
    };

    return (
        <Modal show={show} onHide={onHide}>
            <Modal.Header closeButton>
                <Modal.Title>Update Address</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {error && <p className="text-danger">{error}</p>}
                <Form style={{ color: "black" }}>
                    {Object.keys(address).map((key) => (
                        <Form.Group controlId={key} key={key}>
                            <Form.Label className='mt-3' style={{ color: "inherit" }}>
                                {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Form.Label>
                            <Form.Control
                                type="text"
                                name={key}
                                placeholder={`Enter ${key}`}
                                value={address[key]}
                                onChange={handleOnChange}
                            />
                        </Form.Group>
                    ))}
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

export default UpdateAddressModal;
