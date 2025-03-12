import { useState } from "react";
import { Button, Modal,Table } from "react-bootstrap";
import { useCheckHistoryQuery } from "../redux/api/userApiSlice";

function CheckPurchaseHistoryModal({show,onHide,userId}){
    const { data, isLoading, error } = useCheckHistoryQuery(userId);

    return(
        <Modal show={show} onHide={onHide}>
            <Modal.Header>
                <Modal.Title>Purchase History</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered hover responsive className="shadow-sm mt-3">
                    <thead>
                        <tr>
                            <td>#</td>
                            <td>Name</td>
                            <td>quantity</td>
                            <td>Price</td>
                            <td>Total</td>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading &&
                            <tr>
                                <td colSpan="5" className="text-center">Loading the data...</td>
                            </tr>
                        }
                        {error &&
                            <tr>
                                <td colSpan="5" className="text-danger text-center">{error?.data?.message || "Something went wrong"}</td>
                            </tr>
                        }
                        {data && data.length == 0 &&
                            <tr>
                                <td colSpan="5" className="text-center">You haven't purchased anything yet.</td>
                            </tr>
                        }
                        {data?.map((item,index) =>(
                            <tr key={index}>
                                <td>{index}</td>
                                <td>{item.name}</td>
                                <td>{item.quantity}</td>
                                <td>{item.price}$</td>
                                <td>{item.price * item.quantity}$</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="danger" onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}





export default CheckPurchaseHistoryModal;