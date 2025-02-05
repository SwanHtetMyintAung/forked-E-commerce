import React, { useState } from "react";
import { Container, Form, Button, Spinner } from "react-bootstrap";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { useCreateCategoriesMutation } from "../../../redux/api/categoryApiSlice.js";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

function CreateCategory() {
  const [categoryName, setCategoryName] = useState("");
  const { userInfo } = useSelector((state) => state.auth); // Get token from Redux
  const [createCategory, { isLoading }] = useCreateCategoriesMutation();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userInfo) {
      toast.error("You must be logged in to create a category!");
      return;
    }

    try {
      await createCategory({ categoryName }).unwrap();
      setCategoryName("");
      toast.success("Category added successfully!");
    } catch (error) {
      toast.error(error?.data?.message || "Failed to add category");
    }
  };

  return (
    <Container className="mt-5">
      <motion.div initial={{ opacity: 0, y: -50 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <h2 className="text-center mb-4">Create New Category</h2>
        <motion.div className="p-4 shadow-lg rounded bg-light" whileHover={{ scale: 1.02 }}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="categoryName">
              <Form.Label>Category Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter category name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
                required
                maxLength={32}
              />
            </Form.Group>
            <Button variant="primary" type="submit" className="mt-3" disabled={isLoading}>
              {isLoading ? <Spinner animation="border" size="sm" /> : <FontAwesomeIcon icon={faPlus} />} Add Category
            </Button>
          </Form>
        </motion.div>
      </motion.div>
    </Container>
  );
}

export default CreateCategory;
