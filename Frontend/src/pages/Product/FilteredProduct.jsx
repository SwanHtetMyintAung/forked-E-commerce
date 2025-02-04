//react
import React,{useState} from "react";
import { useLocation, useNavigate } from "react-router-dom";
//redux api
import { useFilterProductsQuery } from "../../redux/api/productApiSlice.js";
//component
import Pagination from "../../components/product/Pagination.jsx";
import ProductCard from "../../components/product/ProductCard.jsx"
//bootstrap
import { Col, Container, Row } from "react-bootstrap";


const FilteredProducts = () => {
  // Get search parameters from the URL
  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const category = searchParams.get("category") || "all";
  const searchTerm = searchParams.get("searchTerm") || "";

  //page change state 
  const [currentPage,setCurrentPage] = useState(searchParams.get("page") || 1) 
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    navigate(`/products/filter?${new URLSearchParams({category,searchTerm,page:pageNumber}).toString()}`);
  }


  // Fetch filtered products using the custom hook
  const { data:response, error, isLoading } = useFilterProductsQuery({ category, searchTerm, page:currentPage });
  const {products,page,pages,hasMore} = response || {};//extract every field of the data
  if(isLoading){
    return (
      <div className="text-light">still Loading</div>
    )
  }
  return (
    <>
    <Container fluid className="mt-4 d-flex w-100 h-100 gap-4">
      {!products && (
          <div className="text-danger">Error While Fetching Products</div>
      )}
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
      <Pagination totalPages={pages || 0} currentPage={Number(page  || 1)} onPageChange={handlePageChange}/>
    </>
  );
};

export default FilteredProducts;
