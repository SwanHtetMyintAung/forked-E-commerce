import react from "react";
import { Button, Modal,Table } from "react-bootstrap";
import { useCheckHistoryQuery, useClearHistoryMutation } from "../redux/api/userApiSlice";
import { toast } from "react-toastify";

function CheckPurchaseHistoryModal({show,onHide,userId}){
    const { data, isLoading, error, refetch } = useCheckHistoryQuery(userId);
    const [clearHistory] = useClearHistoryMutation();
    const handleClearHistory = async () =>{
        try{
            await clearHistory(userId).unwrap();
            refetch();
            toast.success("Cleared History");
        }catch(err){
            toast.error(err || err?.message || "operation failed.")
        }
    }
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
                        {data?.map((result,index) => {
                            let {_id, name:productName, price} = result.product;
                            
                            return(
                                <react.Fragment key={result.id}>
                                <tr key={index}>
                                    <td>{index+1}</td>
                                    <td>{productName}</td>
                                    <td>{result.quantity}</td>
                                    <td>{price}$</td>
                                    <td>{(price * result.quantity).toFixed(2)}$</td>
                                </tr>
                                </react.Fragment>
                        )})}


                        
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="warning" onClick={handleClearHistory}>Clear</Button>
                <Button variant="danger" onClick={onHide}>Close</Button>
            </Modal.Footer>
        </Modal>
    )
}





export default CheckPurchaseHistoryModal;