import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, InputGroup } from "react-bootstrap";

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
  );
};

export default ProductSearchBar;
