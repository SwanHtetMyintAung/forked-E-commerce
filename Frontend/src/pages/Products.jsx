//react
import React, { useEffect, useState } from "react";
import { Link } from "react-router";
//bootstrap
import { Card, Col, Container, Row } from "react-bootstrap";
//redux
import { useSelector, useDispatch } from "react-redux";
//components
import ProductSearchBar from "../components/ProductSearchBar";
import { useFetchProductsQuery } from "../redux/api/productApiSlice";


const ProductCard = (data)=>{
  //destructure every field
  const {name,image,brand,category,description,price} = data;
  return(
        <Card className="shadow" style={{maxWidth:"400px"} }>
          {/* the image is coming from the server as base64 */}
          <Card.Img variant="top" src={`data:image/png;base64,${image}`}/>
          <Card.Body className="rounded-bottom" style={{backgroundColor:"rgb(143,143,143)"}}>
              <Card.Title className=" text-truncate">{name}</Card.Title>
              <Card.Subtitle >
                  <Link className="text-light" to={`/products?q=${category.name.toLowerCase()}`}>{category.name}</Link>
                  {/* to add white space */}
                  {" "}by{" "}
                  <Link className="text-light" to={`/products?q=${brand.toLowerCase()}`}>{brand}</Link>

              </Card.Subtitle>
              <Card.Text className="text-truncate" style={{color:"#000"}}>
                  {description}
              </Card.Text>
                  <small className="text-muted">
                      {price}
                  </small>
          </Card.Body>
      </Card>  
  )
}

export default function Products(){
  const [currentPage,setCurrentPage] = useState(1)
  function handlePrev(){
    setCurrentPage(prev => prev == 1 ? 1 : prev-1)
  }
  function handleNext(){
    setCurrentPage(prev => prev+1)
  }

  const { data:response, isLoading, error } = useFetchProductsQuery({page:currentPage});//change the data to response for the clarification
  if(isLoading){
    return <div className="text-center">Loading products...</div>
  }
  if(error){
    return <div className="text-center text-danger">Error: {error}</div>
  }
  //the reponse has two fields : success and data
  const {products,page,pages,hasMore} = response || {};//extract every field of the data 
  console.log(hasMore)
  return (
    <>
    <ProductSearchBar/>
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
      <div className="d-flex flex-align-center justify-content-center gap-2">

      <button className="btn btn-light" 
      disabled={page==1}
      onClick={handlePrev}>Prev</button>
      <button className="btn btn-light" 
      disabled={!hasMore} 
      onClick={handleNext}>Next</button>
      </div>
    </>
  );
};

