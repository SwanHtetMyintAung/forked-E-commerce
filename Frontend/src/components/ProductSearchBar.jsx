import React, { useState, useEffect } from "react";
import { Form, Button, InputGroup } from "react-bootstrap";
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
  );
};

export default ProductSearchBar;

