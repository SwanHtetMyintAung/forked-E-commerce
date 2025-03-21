import React, { useState } from "react";
import { Container, Table, Button, Spinner, Pagination, Modal, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import { useFetchOrdersQuery, useUpdateOrderStatusMutation, useDeleteOrderByIdMutation } from "../../../redux/api/orderApiSlice.js";
import Model from "../../../components/Model.jsx";

const ManageOrders = () => {
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const { data, isLoading, error, refetch } = useFetchOrdersQuery({ page, pageSize });
    const [updateOrder, { isLoading: updating }] = useUpdateOrderStatusMutation();
    const [deleteOrder, { isLoading: deleting }] = useDeleteOrderByIdMutation();

    const orders = data?.data?.orders || [];
    const totalPages = data?.data?.pages || 1;
    const currentPage = data?.data?.page;

    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState("");
    const [currentOrder, setCurrentOrder] = useState(null);
    const [updatedStatus, setUpdatedStatus] = useState("");

    //logout modal
    const [show,setShow] = useState(false);
    const handleChangeShow = () => setShow(prev => !prev)
    const handleShowModal = (order, mode) => {
        setCurrentOrder(order);
        setModalMode(mode);
        setUpdatedStatus(order.status);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentOrder(null);
    };

    const handleUpdateOrder = async () => {
        try {
            await updateOrder({ id: currentOrder._id, status: updatedStatus }).unwrap();
            toast.success("Order updated successfully!");
            refetch();
        } catch (error) {
            toast.error("Failed to update order");
        }
        handleCloseModal();
    };

    const handleDeleteOrder = async () => {
        try {
            await deleteOrder(currentOrder._id).unwrap();
            toast.success("Order deleted successfully!");
            refetch();
        } catch (error) {
            toast.error("Failed to delete order");
        }
        handleCloseModal();
    };
    return (
        <Container className="mt-5">
            <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <h2 className="text-center mb-4">Manage Orders</h2>
                <Table striped bordered hover responsive>
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Customer</th>
                            <th>Total</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr>
                                <td colSpan="5" className="text-center">
                                    <Spinner animation="border" />
                                </td>
                            </tr>
                        ) : error ? (
                            <tr>
                                <td colSpan="5" className="text-center text-danger">
                                    {error.data.message}
                                </td>
                            </tr>
                        ) : orders.length > 0 ? (
                            orders.map((order, index) => (
                                <tr key={order._id}>
                                    <td>{index + 1 + (page - 1) * pageSize}</td>
                                    <td>{order.customerName}</td>
                                    <td>${order.totalAmount}</td>
                                    <td>{order.status}</td>
                                    <td>
                                        <Button variant="success" onClick={() => handleShowModal(order, "detail")}>
                                            <FontAwesomeIcon icon={faEye} />
                                        </Button>
                                        <Button variant="warning" className="mx-2" onClick={() => handleShowModal(order, "edit")}>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </Button>
                                        <Button variant="danger" onClick={() => handleShowModal(order, "delete")}>
                                            <FontAwesomeIcon icon={faTrash} />
                                        </Button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" className="text-center text-muted">No orders found</td>
                            </tr>
                        )}
                    </tbody>
                    </Table>

{orders.length > 0 && totalPages > 1 && (
    <Pagination className="justify-content-center">
        {[...Array(totalPages)].map((_, index) => (
            <Pagination.Item key={index} active={index + 1 === currentPage} onClick={() => setPage(index + 1)}>
                {index + 1}
            </Pagination.Item>
        ))}
    </Pagination>
)}  

            </motion.div>
            <Model show={show} handleClose={handleChangeShow}/>
            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{modalMode === "edit" ? "Update Order Status" : "Confirm Delete"}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalMode === "edit" ? (
                        <Form.Group>
                            <Form.Label>Status</Form.Label>
                            <Form.Select value={updatedStatus} onChange={(e) => setUpdatedStatus(e.target.value)}>
                                <option value="Pending">Pending</option>
                                <option value="Processing">Processing</option>
                                <option value="Shipped">Shipped</option>
                                <option value="Delivered">Delivered</option>
                                <option value="Cancelled">Cancelled</option>
                            </Form.Select>
                            <Button onClick={handleUpdateOrder} variant="success" className="mt-3" disabled={updating}>
                                {updating ? "Updating..." : "Update Order"}
                            </Button>
                        </Form.Group>
                    ) : (
                        <>
                            <p>Are you sure you want to delete this order?</p>
                            <Button onClick={handleDeleteOrder} variant="danger" disabled={deleting}>
                                {deleting ? "Deleting..." : "Delete Order"}
                            </Button>
                        </>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default ManageOrders;
