import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import ProductDetailModal from './ProductDetailModal.jsx';
import OrderModal from './OrderModal.jsx';
import { useSelector } from 'react-redux';
import { BASE_URL } from '../redux/constants.js';
const ProductCard = ({ _id, name, image, brand, category, description, price, quantity }) => {
  const imageUrl = `${BASE_URL}${image}`;
  const [showModal, setShowModal] = useState(false);
  const [showOrderModal, setShowOrderModal] = useState(false);
  const { userInfo } = useSelector((state) => state.auth);
   const isAdmin = userInfo?.data?.isAdmin;

  return (
    <>
      {/* Product Card */}
      <Card className="shadow-sm border-0 rounded-3 overflow-hidden h-100 product-card">
        <Card.Img
          variant="top"
          src={imageUrl}
          onError={(e) => (e.target.src = "/default-image.jpg")}
          className="img-fluid product-image"
        />
        <Card.Body className="d-flex flex-column">
          <Card.Title className="text-truncate">{name}</Card.Title>
          <Card.Subtitle className="mb-2 text-muted">
            {brand}
          </Card.Subtitle>
          <Card.Text className="text-muted flex-grow-1">
            {description.length > 60 ? description.substring(0, 60) + "..." : description}
          </Card.Text>
          <div className="d-flex justify-content-between align-items-center mt-auto">
            <h5 className="text-dark fw-bold">${price}</h5>
            <div className="d-flex gap-2">
              {/* View Details Button */}
              <Button variant="success" size="sm" onClick={() => setShowModal(true)}>
                View Details
              </Button>
              {userInfo && !isAdmin &&  
              <Button variant="info" size="sm" onClick={() => setShowOrderModal(true)}>
                Order
              </Button>}
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Modal for Product Details */}
      <ProductDetailModal name={name}
                          image={imageUrl} 
                          brand={brand}
                          quantity={quantity}
                          category={category?.name} 
                          description={description} 
                          price={price}
                          show={showModal}
                          setShowModal={setShowModal} />

        {/* Modal for Ordering */}
        <OrderModal name={name}
                    price={price}
                    image={imageUrl}
                    show={showOrderModal}
                    productId={_id}
                    quantity={quantity}
                    setShowModal={setShowOrderModal}/>
                    

    </>
  );
};

export default ProductCard;
