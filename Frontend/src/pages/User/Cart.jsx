import { useState, useEffect } from "react";
import { Container, Table, Button, Image, Row, Col, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faPlus, faMinus, faShoppingCart } from "@fortawesome/free-solid-svg-icons";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveCartItemMutation,
  useClearCartMutation,
  useOrderCartMutation
} from "../../redux/api/cartApiSlice.js";
import { useNavigate } from "react-router-dom";

const Cart = () => {
  const { data: cart, isLoading, error, refetch } = useGetCartQuery();
  const [orderCart,{orderIsLoading,orderError}] = useOrderCartMutation();
  const [updateCartItem] = useUpdateCartItemMutation();
  const [removeCartItem] = useRemoveCartItemMutation();
  const [clearCart] = useClearCartMutation();

  const navigate = useNavigate();

  useEffect(() => {
    refetch();
  }, []);

  // Increase Quantity
  const handleIncreaseQuantity = async (itemId, quantity) => {
    await updateCartItem({ itemId, quantity: quantity + 1 });
    refetch();
  };

  // Decrease Quantity
  const handleDecreaseQuantity = async (itemId, quantity) => {
    if (quantity > 1) {
      await updateCartItem({ itemId, quantity: quantity - 1 });
      refetch();
    }
  };

  // Remove Item
  const handleRemoveItem = async (itemId) => {
    await removeCartItem(itemId);
    toast.success("Item removed from cart!");
    refetch();
  };

  // Clear Cart
  const handleClearCart = async () => {
    await clearCart();
    toast.success("Cart cleared!");
    refetch();
    window.location.reload();
  };

  // Checkout (Simulated)
  const handleCheckout = async() => {
    try{
      await orderCart().unwrap();
      toast.success("Your cart has been processed!")
      refetch();
      window.location.reload();

    }catch(err){
      toast.error(err?.message || err?.data?.message)
    }
  };

  return (
    <Container className="mt-5">
      <motion.h2 initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center mb-4">
        <FontAwesomeIcon icon={faShoppingCart} className="me-2" />
        Shopping Cart
      </motion.h2>

      {isLoading ? (
        <p className="text-center">Loading cart...</p>
      ) : error ? (
        <p className="text-center text-danger">{error.message}</p>
      ) : cart?.cartItems.length > 0 ? (
        <>
          <Table striped bordered hover responsive className="shadow-sm mt-3">
            <thead className="bg-light">
              <tr>
                <th>Product</th>
                <th>Price</th>
                <th>Quantity</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {cart.cartItems.map((item) => (
                <motion.tr key={item._id || item.product} whileHover={{ scale: 1.02 }}>
                  <td>
                    <Row className="align-items-center">
                      <Col xs={3}>
                        <Image src={item.image?.startsWith("http") ? item.image : `http://localhost:5000${item.image}`} alt={item.name} fluid rounded style={{ width: "70px", height: "70px", objectFit: "cover" }} />
                      </Col>
                      <Col>
                        <strong>{item.name}</strong>
                      </Col>
                    </Row>
                  </td>
                  <td>${item.price.toFixed(2)}</td>
                  <td className="text-center">
                    <Button variant="outline-secondary" size="sm" onClick={() => handleDecreaseQuantity(item._id, item.quantity)}>
                      <FontAwesomeIcon icon={faMinus} />
                    </Button>
                    <span className="mx-2">{item.quantity}</span>
                    <Button variant="outline-secondary" size="sm" onClick={() => handleIncreaseQuantity(item._id, item.quantity)}>
                      <FontAwesomeIcon icon={faPlus} />
                    </Button>
                  </td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <Button variant="danger" size="sm" onClick={() => handleRemoveItem(item._id)}>
                      <FontAwesomeIcon icon={faTrash} />
                    </Button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </Table>

          <Card className="mt-4 p-3 shadow-sm">
            <h4 className="text-center">Order Summary</h4>
            <hr />
            <h5 className="text-center">
              Total: <span className="text-success">${cart.totalPrice.toFixed(2)}</span>
            </h5>
            <div className="d-flex justify-content-center gap-3 mt-3">
              <Button variant="outline-danger" onClick={handleClearCart}>
                Clear Cart
              </Button>
              <Button variant="success" onClick={handleCheckout} disabled={orderIsLoading}>
                {orderIsLoading ? "Processing..." : "Order Now"}
              </Button>
            </div>
          </Card>
        </>
      ) : (
        <p className="text-center text-light text-muted fs-5">Your cart is empty.</p>
      )}
    </Container>
  );
};

export default Cart;
