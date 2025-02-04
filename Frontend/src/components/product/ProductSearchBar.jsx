import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, InputGroup } from "react-bootstrap";
<<<<<<< HEAD:Frontend/src/components/ProductSearchBar.jsx
import ProductCard from '../components/ProductCard.jsx';
import { useFilterProductsQuery } from "../redux/api/productApiSlice";
import { BASE_URL, CATEGORY_URL } from "../redux/constants.js";

const ProductSearchBar = ({ setSelectedCategory, setSearchTerm }) => {
  const [category, setCategory] = useState("All");
  const [localSearchTerm, setLocalSearchTerm] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setSelectedCategory(category);
    setSearchTerm(localSearchTerm.trim()); // Pass search term
  };

     // Fetch Categories
     const [categoryData, setCategoryData] = useState([]);
     const [categoryIsLoading, setCategoryIsLoading] = useState(true);
     const [categoryError, setCategoryError] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(`${BASE_URL}${CATEGORY_URL}/categories`);
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

        const jsonData = await response.json();
        console.log("Fetched Category Data:", jsonData);

        if (jsonData?.data && Array.isArray(jsonData.data)) {
          setCategoryData(jsonData.data.map((item) => item.name));
        } else {
          throw new Error("Invalid API response format");
        }
      } catch (err) {
        setCategoryError(err.message);
        console.error("Error fetching categories:", err);
      } finally {
        setCategoryIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="product-search-container mt-5">
      <Form onSubmit={handleSubmit} className="d-flex mx-auto justify-content-center align-items-center" style={{ maxWidth: "500px" }}>
        <InputGroup>
          {/* Category Dropdown */}
          <Form.Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-auto text-truncate"
            style={{ flex: "0 0 auto", maxWidth: "8rem" }}
          >
            <option value="All">All</option>
            {categoryData.map((categoryName, index) => (
              <option key={index} value={categoryName}>
                {categoryName}
              </option>
            ))}
          </Form.Select>

          {/* Search Input */}
          <Form.Control
            type="text"
            placeholder="Search for products..."
            value={localSearchTerm}
            onChange={(e) => setLocalSearchTerm(e.target.value)}
          />

          {/* Submit Button */}
          <Button type="submit" variant="warning">Search</Button>
        </InputGroup>
      </Form>
    </div>
=======

const ProductSearchBar = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const params = { category, searchTerm, page:1 }; // Ensure correct values
    navigate(`/products/filter?${new URLSearchParams(params).toString()}`);
  };

  //need to change this bit with an actual api call
    const [categoryData, setCategoryData] = useState([]);
    const [categoryIsLoading, setCategoryIsLoading] = useState(true); // Track loading state
    const [categoryError, setCategoryError] = useState(null); // Store any errors

    useEffect(() => {
        const fetchData = async () => {
        try {
            const response = await fetch('/data/data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const jsonData = await response.json();
            const categories = [...new Set(jsonData.map(item => item.category))];
            setCategoryData(categories)
        } catch (err) {
            setCategoryError(err.message);
            console.error('Error fetching data:', err);
        } finally {
          setCategoryIsLoading(false); // Set loading to false regardless of success or failure
        }
        };

        fetchData();
    }, []);
  return (
    <Form onSubmit={handleSubmit} style={{ maxWidth: "500px" }} className="d-flex mx-auto justify-content-center align-items-center">
      {/* Input Group for Select + Text + Button */}
      <InputGroup>
        {/* Select Dropdown */}
        <Form.Select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-auto text-truncate" // Adjust width
          style={{ flex: "0 0 auto", maxWidth: "8rem" }}
        >
          <option value="all">All</option>
          {categoryIsLoading && (
            <option>Loading.....</option>
          )}
          {categoryError && (
            <option>Error</option>
          )}
          { categoryData.length > 0 && (
            categoryData.map((item,index)=>{
              return <option key={index} value={item}>{item}</option>
            })
          )}
        </Form.Select>

        {/* Text Input */}
        <Form.Control
          type="text"
          style={{ flex: "1 1 auto" }}
          placeholder="Search for products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Submit Button */}
        <Button type="submit" variant="warning">
          Search
        </Button>
      </InputGroup>

      {/* Loading / Error / Data Display
      {isLoading && <div>Loading products...</div>}
      {error && <div style={{ color: 'red' }}>Error: {error.message}</div>}
      {data && data.length > 0 && (
        <div>
          <h4>Search Results:</h4>
          <ul>
            {data.map((product) => (
              <li key={product._id}>{product.name} - ${product.price}</li>
            ))}
          </ul>
        </div>
      )}
      {data && data.length === 0 && <div>No products found</div>} */}
    </Form>
>>>>>>> 851a4f9b61dafb34f318485fb3f4c2c835247443:Frontend/src/components/product/ProductSearchBar.jsx
  );
};

export default ProductSearchBar;

