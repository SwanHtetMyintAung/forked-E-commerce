import React, { useState } from "react";
import { Container, Table, Button, Spinner, Pagination, Modal, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit } from "@fortawesome/free-solid-svg-icons";
import {
  useFetchCategoriesQuery,
  useDeleteCategoryMutation,
  useUpdateCategoryMutation,
} from "../../../redux/api/categoryApiSlice.js";
import { toast } from "react-toastify";

function ManageCategory() {
  const [page, setPage] = useState(1);
  const pageSize = 5; // Categories per page

  // Fetch categories from API
  const { data, refetch, isLoading } = useFetchCategoriesQuery({ page, pageSize });
  const [deleteCategory] = useDeleteCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();

  const categories = data?.categories || [];
  const totalPages = data?.pages || 1;

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState(""); // "edit" or "delete"
  const [currentCategory, setCurrentCategory] = useState(null);
  const [newCategoryName, setNewCategoryName] = useState("");

  // Open Modal (Edit or Delete)
  const handleShowModal = (category, mode) => {
    setCurrentCategory(category);
    setModalMode(mode);
    if (mode === "edit") setNewCategoryName(category.name);
    setShowModal(true);
  };

  // Close Modal
  const handleCloseModal = () => {
    setShowModal(false);
    setCurrentCategory(null);
  };

  // Handle Delete Category
  const handleDeleteCategory = async () => {
    try {
      await deleteCategory(currentCategory._id).unwrap();
      toast.success("Category deleted successfully!");
      refetch();
    } catch (error) {
      toast.error("Failed to delete category");
    }
    handleCloseModal();
  };

  // Handle Update Category
  const handleUpdateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name cannot be empty!");
      return;
    }
    try {
      await updateCategory({ id: currentCategory._id, categoryName: newCategoryName }).unwrap();
      toast.success("Category updated successfully!");
      refetch();
    } catch (error) {
      toast.error(`Failed to update category: ${error?.data?.message || "Unknown error"}`);
    }
    handleCloseModal();
  };

  return (
    <Container className="mt-5">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-center mb-4">Manage Categories</h2>
        {isLoading ? (
          <div className="text-center">
            <Spinner animation="border" />
          </div>
        ) : (
          <>
            <Table striped bordered hover responsive className="shadow-sm mt-3">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Category Name</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categories.length > 0 ? (
                  categories.map((category, index) => (
                    <motion.tr key={category._id} whileHover={{ scale: 1.02 }}>
                      <td>{index + 1 + (page - 1) * pageSize}</td>
                      <td>{category.name}</td>
                      <td>
                        <Button
                          variant="warning"
                          className="me-2"
                          onClick={() => handleShowModal(category, "edit")}
                        >
                          <FontAwesomeIcon icon={faEdit} /> Edit
                        </Button>
                        <Button variant="danger" onClick={() => handleShowModal(category, "delete")}>
                          <FontAwesomeIcon icon={faTrash} /> Delete
                        </Button>
                      </td>
                    </motion.tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="text-center text-muted">No categories found</td>
                  </tr>
                )}
              </tbody>
            </Table>

            {/* Pagination */}
            <Pagination className="justify-content-center">
              {[...Array(totalPages)].map((_, index) => (
                <Pagination.Item
                  key={index}
                  active={index + 1 === page}
                  onClick={() => setPage(index + 1)}
                >
                  {index + 1}
                </Pagination.Item>
              ))}
            </Pagination>
          </>
        )}
      </motion.div>

      {/* Modal for Edit & Delete */}
      <Modal show={showModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalMode === "edit" ? "Edit Category" : "Confirm Delete"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalMode === "edit" ? (
            <>
              <Form.Group className="mb-3">
                <Form.Label>Category Name</Form.Label>
                <Form.Control
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                />
              </Form.Group>
            </>
          ) : (
            <p>Are you sure you want to delete this category?</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          {modalMode === "edit" ? (
            <Button variant="success" onClick={handleUpdateCategory}>
              Save Changes
            </Button>
          ) : (
            <Button variant="danger" onClick={handleDeleteCategory}>
              Confirm Delete
            </Button>
          )}
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
}

export default ManageCategory;
