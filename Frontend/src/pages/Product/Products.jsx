//react
import React, { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
//bootstrap
import { Col, Container, Row } from "react-bootstrap";
//redux
import { useFetchProductsQuery } from "../../redux/api/productApiSlice";
//components
import Pagination from "../../components/product/Pagination.jsx";
import ProductCard from "../../components/product/ProductCard.jsx"


export default function Products(){
  const [currentPage,setCurrentPage] = useState(1)
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  }

  const { data:response, isLoading, error } = useFetchProductsQuery({page:currentPage});//change the data to response for the clarification
  if(isLoading){
    return <div className="text-center text-light">Loading products...</div>
  }
  if(error){
    return <div className="text-center text-danger">Error: {JSON.stringify(error)}</div>
  }
  //the reponse has two fields : success and data
  const {products,page,pages,hasMore} = response || {};//extract every field of the data 
  return (
    <>
    <Container fluid className="mt-4 d-flex w-100 h-100 gap-4">
      {products.length === 0 && !isLoading && !error && (
        <div className="text-center">No products found.</div>
      )}
      {products.length > 0 && (
        <Row className="card-deck d-flex align-items-stretch justify-content-center" xs={1} sm={2} md={3} lg={4}>
          {products.map((item, index) => (
            <Col key={index} className="mb-3">
              {ProductCard(item)}
            </Col>
          ))}
        </Row>
      )}

    </Container>
      <Pagination totalPages={pages || 0} currentPage={Number(page  || 0)} onPageChange={handlePageChange}/>
    </>
  );
};

