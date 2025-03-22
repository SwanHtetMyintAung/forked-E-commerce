import React, { useState } from 'react';
import { useGetUsersQuery, useUpdateUserRoleMutation } from '../../../redux/api/userApiSlice'; // Assuming you have a updateUserRole mutation
import { Container, Table, Button, Spinner, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUserCog } from '@fortawesome/free-solid-svg-icons'; // Or another suitable icon
import Pagination from '../../../components/Pagination';

export default function ManageRoles() {
    const [page, setPage] = useState(1);
    const pageSize = 9;
    const [showModal, setShowModal] = useState(false);
    const [userToUpdateRole, setUserToUpdateRole] = useState(null);
    const [newRole, setNewRole] = useState('normal user'); // Default role
    const [updateUserRole, { isLoading: isUpdatingRole }] = useUpdateUserRoleMutation();
    const { data, refetch, isLoading, isError, error } = useGetUsersQuery({ page, pageSize });

    function handlePageChange(pageToChange) {
        setPage(pageToChange);
    }

    const handleRoleClick = (user) => {
        setUserToUpdateRole(user);
        setNewRole(user.isAdmin ? 'admin' : 'normal user'); // Set initial role in modal
        setShowModal(true);
    };


    const handleConfirmRoleUpdate = async () => {
        const userData = {
            ...userToUpdateRole,
            isAdmin : newRole === "admin"
        }
        try {
            await updateUserRole(userData).unwrap();
            refetch();
            toast.success(`Role updated to ${newRole}`);
        } catch (updateError) {
            console.log(userData)
            console.error('Error updating role:', updateError);
            toast.error('Failed to update role');
        }
        setShowModal(false);
        setUserToUpdateRole(null);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setUserToUpdateRole(null);
    };

    if (isLoading) {
        return <h1>Loading...</h1>;
    }

    if (isError) {
        return <h1>Error: {error.message}</h1>;
    }

    const users = data.data;
    if (!users || users.length === 0) {
        return <h1 className="text-danger">NO contents available</h1>;
    }

    return (
        <Container className='mt-5'>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h2 className="text-center mb-4">Manage User Roles</h2>
                <Table striped bordered hover responsive className="shadow-sm mt-3 text-center" style={{ padding: '10px' }}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Current Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='overflow-hidden'>
                        {
                            users.length > 0 ? (
                                users.map((user, index) => (
                                    <motion.tr key={user._id}>
                                        <td>{index + 1 + (page - 1) * pageSize}</td>
                                        <td>{user.name}</td>
                                        <td>{user.isAdmin ? "admin" : "normal user"}</td>
                                        <td>
                                            <Button variant="primary" className='me-2' onClick={() => handleRoleClick(user)}>
                                                <FontAwesomeIcon icon={faUserCog} />
                                            </Button>
                                        </td>
                                    </motion.tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="3" className="text-center text-muted">No users found</td>
                                </tr>
                            )
                        }
                    </tbody>
                </Table>

                {/* pagination */}
                <Pagination currentPage={page} totalPages={data?.pages} onPageChange={handlePageChange} />
            </motion.div>

            {/* Modal for role update */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Update User Role</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className='text-dark text-center'>Update role for <strong>{userToUpdateRole ? userToUpdateRole.name : "John Doe"}</strong>?</p>
                    <Form.Select value={newRole} onChange={(e) => setNewRole(e.target.value)}>
                        <option value="normal user">Normal User</option>
                        <option value="admin">Admin</option>
                    </Form.Select>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button variant="primary" onClick={handleConfirmRoleUpdate}>
                        Confirm Update
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}