import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';

function ProductDetailModel({setShowModal, show, description, name, image, price, brand, quantity}) {
 
  return (
    <>
      {/* Modal for Product Details */}
      <Modal show={show} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{name}</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center">
          <img
            src={image}
            alt={name}
            className="img-fluid mb-3"
            style={{ maxHeight: "300px", objectFit: "cover" }}
          />
          <p className="fs-5 text-dark">Price: <strong>${price}</strong></p>
          <p className="fs-5 text-dark">Brand: <strong>{brand}</strong></p>
          <p className='fs-5 text-dark me-4'>
            In Stock
          <Button variant="warning ms-2">{quantity}</Button>
            </p>
          <p className="text-muted">{description}</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Close</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default ProductDetailModel;