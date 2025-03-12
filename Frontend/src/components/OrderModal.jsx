import { faCartPlus } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import { Modal, Button } from "react-bootstrap";
import { toast } from "react-toastify";
import { useAddToCartMutation } from "../redux/api/cartApiSlice.js";

const OrderModal = ({ name, price, image, productId, show, quantity ,setShowModal }) => {
    const [demand, setDemand] = useState(quantity > 0 ? 1 : 0);
    const [addToCart, { isLoading }] = useAddToCartMutation();

    // Increase quantity
    const increaseQuantity = () => setDemand((prev) => prev + 1);

    // Decrease quantity (Minimum is 1)
    const decreaseQuantity = () => setDemand((prev) => (prev > 1 ? prev - 1 : prev));

    // Calculate total price
    const totalPrice = (price * demand).toFixed(2);

    // Handle Add to Cart
    const handleAddToCart = async () => {
        try {
            console.log("📢 Sending Add to Cart request:", { productId, demand });
    
            const response = await addToCart({ productId, quantity:demand }).unwrap();
            console.log("✅ Add to Cart Success:", response);
    
            toast.success(`${name} added to cart! 🛒`);
            setShowModal(false);
        } catch (error) {
            console.error("❌ Add to Cart Error:", error);
            toast.error(error?.data?.message || "Failed to add product to cart.");
        }
    };
    
    const handleIncreaseDemand = () =>{
        if(demand < quantity){//make sure the demand is not higher than the stock
            increaseQuantity();
        }else{
            return;
        }
    }
    return (
        <Modal show={show} onHide={() => setShowModal(false)} centered>
            <Modal.Header closeButton>
                <Modal.Title>Order Product</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div className="text-center">
                    <img src={image} alt={name} style={{ width: "120px", height: "120px", objectFit: "cover" }} />
                    <h5 className="mt-3">{name}</h5>
                    <p className="text-muted">Price: <strong>${price}</strong></p>
                </div>

                {/* Quantity Control */}
                <div className="d-flex justify-content-center align-items-center mt-3">
                    <Button variant="secondary" onClick={decreaseQuantity} disabled={demand <= 1}>-</Button>
                    <span style={{userSelect:"none"}} className="mx-3">{demand}</span>
                    <Button variant="secondary" onClick={handleIncreaseDemand} disabled={demand == quantity}>+</Button>
                </div>

                {/* Total Price */}
                <h5 className="text-center mt-3">Total: <strong>${totalPrice}</strong></h5>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowModal(false)}>Cancel</Button>
                <Button variant="warning" onClick={handleAddToCart} disabled={isLoading}>
                    {isLoading ? "Adding..." : <>
                        <FontAwesomeIcon className="me-2" icon={faCartPlus} /> Add To Cart
                    </>}
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default OrderModal;
