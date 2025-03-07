import React, { useState } from 'react';
import { useGetUsersQuery, useBanUserMutation } from '../../../redux/api/userApiSlice';
import { Container, Table, Button, Spinner, Modal, Form } from "react-bootstrap";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBan } from '@fortawesome/free-solid-svg-icons';
import Pagination from '../../../components/Pagination';

export default function ManageUser() {
    const [page, setPage] = useState(1);
    const pageSize = 9;
    const [showModal, setShowModal] = useState(false);
    const [userToBan, setUserToBan] = useState(null);
    const [banUser, { isLoading:isBanning }] = useBanUserMutation();
    const { data,refetch, isLoading, isError, error } = useGetUsersQuery({ page, pageSize });


    function handlePageChange(pageToChange){
        setPage(pageToChange)
    }
    const handleBanClick = (user) => {
        setUserToBan(user);
        setShowModal(true);
    };
    const handleConfirmBan = async() => {
        try{
            if(userToBan.isAdmin){
                toast.error("you can't ban an admin!")
            }
            await banUser(userToBan._id);
            refetch()
        }catch(error){
            // Handle errors
            console.error('Error banning user:', error);
        }
        setShowModal(false);
        setUserToBan(null);
    };
    const handleCloseModal = () => {
        setShowModal(false);
        setUserToBan(null);
    };

    if (isLoading) {
        return <h1>Loading...</h1>;
    }
    
    if (isError) {
        return <h1>Error: {error.message}</h1>;
    }
    const users = data.data;
    if (!users || users.length === 0) { // Check if data, data.users exist and if the array is empty
        return <h1 className="text-danger">NO contents available</h1>;
    }

    return (
        <Container className='mt-5'>
            <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}

            >
                <h2 className="text-center mb-4">Manage Users</h2>
                <Table striped bordered hover responsive className="shadow-sm mt-3 text-center"  style={{padding: '10px'}}>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>User</th>
                            <th>Role</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody className='overflow-hidden'>
                        {   
                            users.length > 0 ? (
                                users.map((user,index) => (
                                    <motion.tr key={user._id}>
                                        <td>{index + 1 + (page - 1) * pageSize}</td>
                                        <td>{user.name}</td>
                                        <td>{user.isAdmin ?  "admin" : "normal user"}</td>
                                        <td>
                                            <Button variant="danger" className='me-2' onClick={() => handleBanClick(user)}>
                                                <FontAwesomeIcon icon={faBan}/>
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
            {/* Modal for banning */}
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Confirm Ban User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p className='text-dark text-center'>Are you sure you want to ban <strong>{userToBan ? userToBan.name : "John Doe"}</strong>?</p>
                    <FontAwesomeIcon icon={faBan} size="3x" className="text-danger d-block mx-auto mb-3" />
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseModal}>
                        Cancel
                    </Button>
                    <Button variant="danger" onClick={handleConfirmBan}>
                        Confirm Ban
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
}