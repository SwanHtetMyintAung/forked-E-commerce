import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ProductDetailModel from './ProductDetailModel.jsx';

function ProductCard({ image, name, price, brand, quantity, description}) {

    const [show, setShow] = useState(false);

    // Open and Close Modal
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
 return (
      <>
       <Card style={{ width: '18rem' }}>
      {/* ✅ Corrected Image Source */}
      <Card.Img variant="top" src={image} alt={name} />
      <Card.Body>
        <Card.Text>
          <strong className='text-dark'>{name}</strong>
        </Card.Text>
        <Card.Text>
          <span className='text-dark'>${price}</span>
        </Card.Text>
        <Button variant="primary me-2">Buy Now</Button>
        <Button variant="success" onClick={handleShow}>Detail</Button>
      </Card.Body>
    </Card>

    <ProductDetailModel 
    handleClose={handleClose}
     show={show}
     name={name}
     image={image}
     price={price}
      brand={brand}
      quantity={quantity}
      description={description}/>
      </>
    
  );
}

export default ProductCard;
