import React, { useEffect, useState } from "react";
import { Card, Col, Container, Row, Spinner, Button } from "react-bootstrap";
import { useFetchProductsQuery } from "../redux/api/productApiSlice.js";
import ProductSearchBar from "../components/ProductSearchBar.jsx";
import ProductCard from "../components/ProductCard.jsx";
import Pagination from "../components/Pagination.jsx";

export default function Products() {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const pageSize = 4;
  const handlePageChange = (targetPage) =>{
    setCurrentPage(targetPage)
  }
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
        <Pagination currentPage={currentPage} totalPages={pages} onPageChange={handlePageChange}/>
      )}
    </>
  );
}

