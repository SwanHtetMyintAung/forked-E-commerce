import React, { useState } from "react";
import { Form, Button, Container, Row, Col, Alert, Spinner } from "react-bootstrap";
import {
    useFetchAllCategoriesQuery,
} from "../../../redux/api/categorySlice.js";
import {
  useUploadImageFileMutation,
  useCreateProductMutation,
} from "../../../redux/api/productApiSlice.js";
import { toast } from "react-toastify";

const CreateProductPage = () => {
  const { data: categories, isLoading: categoriesLoading } = useFetchAllCategoriesQuery();
  const [uploadProductImage] = useUploadImageFileMutation();
  const [createProduct] = useCreateProductMutation();

  const [newProduct, setNewProduct] = useState({
    name: "",
    image: "",
    brand: "",
    quantity: "",
    category: "",
    description: "",
    price: "",
  });

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const handleFileUpload = async () => {
    if (!file) {
        toast.error("Please select an image file.")
      return;
    }
    setUploading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("image", file);

      const response = await uploadProductImage(formData).unwrap();
      setNewProduct({ ...newProduct, image: response.image });
      setError("");
    } catch (error) {
        toast.error("File upload failed.");
    } finally {
      setUploading(false);
    }
  };

  const handleCreateProduct = async () => {
    console.log("Current Product Data:", newProduct); // 🔥 Check if fields exist before sending

    if (!newProduct.image) {
        toast.error("Please upload an image before creating the product.");
        return;
    }

    setError("");
    try {
        const response = await createProduct(newProduct).unwrap();
        console.log("Product Created Response:", response); // 🔥 Debug API response

        setNewProduct({ name: "", image: "", brand: "", quantity: "", category: "", description: "", price: "" });
        toast.success("Product added successfully!");
    } catch (error) {
        console.error("Error creating product:", error.data.message);
        toast.error(`${error.data.message}`);
    }
};


  return (
    <Container>
      <Row className="justify-content-md-center">
        <Col md={8}>
          <h2 className="text-center my-4">Create Product</h2>

          {error && <Alert variant="danger">{error}</Alert>}

          {/* File Upload */}
          <Form.Group className="mb-3">
            <Form.Label>Product Image</Form.Label>
            <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} />
            <Button
              onClick={handleFileUpload}
              disabled={uploading}
              className="mt-2 w-100"
              variant="primary"
            >
              {uploading ? <Spinner animation="border" size="sm" /> : "Upload Image"}
            </Button>
          </Form.Group>

          {/* Product Name */}
          <Form.Group className="mb-3">
            <Form.Label>Product Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter product name"
              value={newProduct.name}
              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
            />
          </Form.Group>

          {/* Brand */}
          <Form.Group className="mb-3">
            <Form.Label>Brand</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter brand name"
              value={newProduct.brand}
              onChange={(e) => setNewProduct({ ...newProduct, brand: e.target.value })}
            />
          </Form.Group>

          {/* Quantity */}
          <Form.Group className="mb-3">
            <Form.Label>Quantity</Form.Label>
            <Form.Control
              type="number"
              placeholder="Enter quantity"
              value={newProduct.quantity}
              onChange={(e) => setNewProduct({ ...newProduct, quantity: e.target.value })}
            />
          </Form.Group>

          {/* Category Dropdown */}
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Select
              value={newProduct.category}
              onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
            >
              <option value="">Select Category</option>
              {categoriesLoading ? (
                <option>Loading...</option>
              ) : (
                categories?.data?.map((category) => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))
              )}
            </Form.Select>
          </Form.Group>

          {/* Description */}
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Enter product description"
              value={newProduct.description}
              onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
            />
          </Form.Group>

          {/* Price */}
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter price"
              value={newProduct.price}
              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
            />
          </Form.Group>

          {/* Create Product Button */}
          <Button onClick={handleCreateProduct} variant="success" className="w-100">
            Create Product
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default CreateProductPage;
