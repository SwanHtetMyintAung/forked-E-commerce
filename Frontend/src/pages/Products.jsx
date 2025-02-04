import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Card, Col, Container, Row, Spinner, Pagination, Button, Modal } from "react-bootstrap";
import { useFetchProductsQuery } from "../redux/api/productApiSlice.js";
import ProductSearchBar from "../components/product/ProductSearchBar.jsx";

const ProductCard = ({ name, image, brand, category, description, price, quantity }) => {
  const imageUrl = image?.startsWith("http") ? image : `http://localhost:5000${image}`;
  const [showModal, setShowModal] = useState(false);

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
              {/* Order Button */}
              <Button variant="info" size="sm">
                Order
              </Button>
            </div>
          </div>
        </Card.Body>
      </Card>

      {/* Modal for Product Details */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>{name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <img src={imageUrl} alt={name} className="img-fluid mb-3" style={{ borderRadius: "10px" }} />
          <p className="text-dark"><strong>Brand:</strong> {brand}</p>
          <p className="text-dark"><strong>Category:</strong> {category?.name}</p>
          <p className="text-dark">{description}</p>
          <h4 className="text-primary">${price}</h4>
           <h5 className="text-dark">
            Stock In 
            <Button variant="warning ms-2">{quantity}</Button>
           </h5>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button variant="success">
            Order Now
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};



export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const pageSize = 6;

  const { data: response, isLoading, error, refetch } = useFetchProductsQuery({
    page: searchTerm ? 1 : currentPage, // Reset to first page on search
    pageSize,
    category: selectedCategory !== "All" ? selectedCategory : null,
    searchTerm: searchTerm || null,
  });

  useEffect(() => {
    setCurrentPage(1); // Reset page when category or search term changes
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    refetch();
  }, [currentPage, selectedCategory, searchTerm, refetch]);

  console.log("🟢 API Response:", response);

  if (isLoading) {
    return <div className="text-center"><Spinner animation="border" /></div>;
  }

  if (error) {
    return <div className="text-center text-danger">Error: {error.message || "Something went wrong"}</div>;
  }

  const products = response?.products || response?.data?.products || [];
  const pages = response?.pages || response?.data?.pages || 1;

  return (
    <>
      {/* Search Bar */}
      <ProductSearchBar setSelectedCategory={setSelectedCategory} setSearchTerm={setSearchTerm} />

      <Container fluid className="mt-4">
        {products.length === 0 && !isLoading && !error && (
          <div className="text-center text-light fs-4">Product Not Found ...</div>
        )}
        {products.length > 0 && (
          <Row className="row-cols-1 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 px-5">
            {products.map((item, index) => (
              <Col key={index}>
                <ProductCard {...item} />
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Pagination (Only if not searching) */}
      {/* Hide pagination when no products are found */}
      {products.length > 0 && pages > 1 && !searchTerm && (
        <Pagination className="justify-content-center">
          {[...Array(pages)].map((_, index) => (
            <Pagination.Item
              key={index}
              active={index + 1 === currentPage}
              onClick={() => setCurrentPage(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination>
      )}
    </>
  );
}

