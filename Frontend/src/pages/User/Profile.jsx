import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Row, Col, Image, Button } from 'react-bootstrap';
import UserIconPlaceholder from '../../components/UserIconPlaceholder';
import { useChangePasswordMutation, useUpdateAddressMutation } from '../../redux/api/userApiSlice.js';
import { setCredentials } from "../../redux/features/auth/authSlice";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { toast } from "react-toastify";

// Modals
import ChangePasswordModal from '../../components/ChangePasswordModal';
import ChangeAddressModal from '../../components/ChangeAddressModal.jsx';
import CheckPurchaseHistoryModal from '../../components/CheckPurchaseHistoryModal.jsx';

const btnStyle = {
    width:"80%",
    maxWidth:"200px",
    margin: "10px auto",
    border:"none",
    height:"2rem",
}

function Profile() {
    const dispatch = useDispatch();
    const [changePassword, { passwordError }] = useChangePasswordMutation();
    const [updateAddress, { addressError }] = useUpdateAddressMutation();
    const { userInfo } = useSelector((state) => state.auth);
    const { _id: id, name, email, address } = userInfo?.data || {};

    // Password Modal
    const [showPasswordChangeModal, setShowPasswordChangeModal] = useState(false);
    function togglePasswordModal() {
        setShowPasswordChangeModal((prev) => !prev);
    }

    const handleChangePassword = async ({ currentPassword, newPassword }) => {
        const userData = {
            ...userInfo.data,
            password: currentPassword,
            newPassword,
        };
        try {
            const response = await changePassword(userData).unwrap();
            if (response) {
                dispatch(setCredentials(response));
                toast.success("Password Changed Successfully!");
            }
        } catch (err) {
            toast.error(err.data.message || "Unexpected Error Occurred!");
        }
    };

    // Address Modal
    const [showAddressChangeModal, setShowAddressChangeModal] = useState(false);
    function toggleAddressModal() {
        setShowAddressChangeModal((prev) => !prev);
    }

    async function handleChangeAddress(address) {
        try {
            const result = await updateAddress({
                ...userInfo.data,
                address,
            }).unwrap();
            if (result) {
                dispatch(setCredentials(result));
                toast.success(result.message);
            }
        } catch (error) {
            toast.error(error.message);
        }
    }

    // Purchase History
    const [showHistoryModal, setShowHistoryModal] = useState(false);
    function toggleShowHistoryModal() {
        setShowHistoryModal((prev) => !prev);
    }

    return (
        <Container className="mx-auto text-light mt-5">
            <Row className="justify-content-center">
                {/* User Info */}
                <Col xs={12} md={6} lg={4} className="text-center mb-3 mb-md-0">
                    <div className="d-flex justify-content-center">
                        {userInfo?.data?.imageUrl ? (
                            <Image
                                src={userInfo?.data?.imageUrl}
                                roundedCircle
                                fluid
                                style={{
                                    width: '150px',
                                    height: '150px',
                                    objectFit: 'cover',
                                }}
                            />
                        ) : (
                            <UserIconPlaceholder width="150px" height="150px" />
                        )}
                    </div>
                    <h3 className="mt-3">{name ? name : "John Doe"}</h3>
                    <p className="text-light">{email}</p>
                </Col>

                {/* Settings & Buttons */}
                <Col xs={12} md={6} lg={4} className="text-center">
                    <div
                        className="d-flex flex-column align-items-center"
                        style={{
                            border: '1px solid #ddd',
                            borderRadius: '10px',
                            padding: '20px',
                            backgroundColor: '#222',
                        }}
                    >
                        <h4 className="text-light mb-4">
                            <FontAwesomeIcon className="mx-2" icon={faCog} />
                            Settings
                        </h4>
                        <button className='rounded' style={btnStyle} onClick={togglePasswordModal}>Change Password</button>
                        <button className='rounded' style={btnStyle} onClick={toggleShowHistoryModal}>Check History</button>
                        <button className='rounded' style={btnStyle} onClick={toggleAddressModal}>Change Address</button>
                    </div>
                </Col>
            </Row>

            {/* Modals */}
            <ChangePasswordModal
                show={showPasswordChangeModal}
                onHide={togglePasswordModal}
                onConfirm={handleChangePassword}
            />
            <ChangeAddressModal
                show={showAddressChangeModal}
                onHide={toggleAddressModal}
                onConfirm={handleChangeAddress}
                existingAddress={address}
            />
            <CheckPurchaseHistoryModal
                show={showHistoryModal}
                onHide={toggleShowHistoryModal}
                userId={id}
            />
        </Container>
    );
}

export default Profile;
