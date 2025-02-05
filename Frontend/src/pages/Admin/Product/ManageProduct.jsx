import React, { useState } from "react";
import { Container, Table, Button, Spinner, Pagination, Modal, Form } from "react-bootstrap";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faEdit, faEye } from "@fortawesome/free-solid-svg-icons";
import { toast } from "react-toastify";
import {
    useFetchProductsQuery,
    useUpdateProductMutation,
    useDeleteProductByIdMutation,
    useUploadImageFileMutation,
} from "../../../redux/api/productApiSlice.js";
import {
    useFetchAllCategoriesQuery,
} from "../../../redux/api/categoryApiSlice.js";

const ManageProductsPage = () => {
    const [page, setPage] = useState(1);
    const pageSize = 5; // Number of products per page

    const { data, isLoading, error, refetch } = useFetchProductsQuery({ page, pageSize });
    const { data: categoriesData, isLoading: categoriesLoading } = useFetchAllCategoriesQuery();
    const [updateProduct, { isLoading: updating }] = useUpdateProductMutation();
    const [deleteProduct, { isLoading: deleting }] = useDeleteProductByIdMutation();
    const [uploadImage] = useUploadImageFileMutation();

    const products = data?.data?.products || [];
    const totalPages = data?.data?.pages || 1;
    const currentPage = data?.data?.page;

    console.log(data?.data);


    // Modal states
    const [showModal, setShowModal] = useState(false);
    const [modalMode, setModalMode] = useState(""); // "edit" or "delete"
    const [currentProduct, setCurrentProduct] = useState(null);
    const [updatedProduct, setUpdatedProduct] = useState({
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

    // Open Modal (Edit or Delete)
    const handleShowModal = (product, mode) => {
        setCurrentProduct(product);
        setModalMode(mode);
        if (mode === "edit" || mode === "detail") {
            setUpdatedProduct({ ...product });
        }
        setShowModal(true);
    };

    // Close Modal
    const handleCloseModal = () => {
        setShowModal(false);
        setCurrentProduct(null);
        setUpdatedProduct({
            name: "",
            image: "",
            brand: "",
            quantity: "",
            category: "",
            description: "",
            price: "",
        });
        setFile(null);
    };

    // Handle File Upload
    const handleFileUpload = async () => {
        if (!file) {
            toast.error("Please select an image file.");
            return;
        }
        setUploading(true);

        try {
            const formData = new FormData();
            formData.append("image", file);
            const response = await uploadImage(formData).unwrap();
            setUpdatedProduct((prev) => ({ ...prev, image: response.image }));
            toast.success("Image uploaded successfully!");
        } catch (error) {
            toast.error("File upload failed.");
        } finally {
            setUploading(false);
        }
    };

    // Handle Update Product
    const handleUpdateProduct = async () => {
        if (!updatedProduct.image) {
            toast.error("Please upload an image before updating the product.");
            return;
        }

        if (!currentProduct || !currentProduct._id) {
            toast.error("Invalid product ID. Cannot update.");
            return;
        }

        try {
            console.log("🚀 Sending Update Request:", {
                id: currentProduct._id,
                ...updatedProduct
            });

            const response = await updateProduct({
                id: currentProduct._id,
                name: updatedProduct.name,
                image: updatedProduct.image,
                brand: updatedProduct.brand,
                quantity: Number(updatedProduct.quantity),
                category: updatedProduct.category,
                description: updatedProduct.description,
                price: Number(updatedProduct.price)
            }).unwrap();

            console.log("✅ Update Success:", response);
            toast.success("Product updated successfully!");
            refetch();
        } catch (error) {
            console.error("❌ Update Failed:", error);
            toast.error(`Failed to update product: ${error?.data?.message || "Unknown error"}`);
        }
        handleCloseModal();
    };





    // Handle Delete Product
    const handleDeleteProduct = async () => {
        try {
            await deleteProduct(currentProduct._id).unwrap();
            toast.success("Product deleted successfully!");
            refetch();
        } catch (error) {
            toast.error("Failed to delete product");
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
                <h2 className="text-center mb-4">Manage Products</h2>

                {isLoading ? (
                    <div className="text-center">
                        <Spinner animation="border" />
                    </div>
                ) : error ? (
                    <div className="text-center text-danger">{error.message}</div>
                ) : (
                    <>
                        <Table striped bordered hover responsive className="shadow-sm mt-3">
                            <thead>
                                <tr>
                                    <th>#</th>
                                    <th>Image</th>
                                    <th>Name</th>
                                    <th>Price</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.length > 0 ? (
                                    products.map((product, index) => (
                                        <motion.tr key={product._id} whileHover={{ scale: 1.02 }}>
                                            <td>{index + 1 + (page - 1) * pageSize}</td>
                                            <td>
                                                <img
                                                    src={product.image?.startsWith("http") ? product.image : `http://localhost:5000${product.image}`}
                                                    alt={product.name}
                                                    className="img-thumbnail"
                                                    style={{ width: "60px", height: "60px", objectFit: "cover" }}
                                                    onError={(e) => e.target.src = "/default-image.jpg"} // Fallback image
                                                />
                                            </td>
                                            <td>{product.name}</td>
                                            <td>${product.price}</td>
                                            <td>
                                                <Button variant="success"
                                                    title="Detail"
                                                    onClick={() => handleShowModal(product, "detail")}>
                                                    <FontAwesomeIcon icon={faEye} />
                                                </Button>
                                                <Button
                                                    variant="warning"
                                                    className="m-2"
                                                    onClick={() => handleShowModal(product, "edit")}
                                                    title="Edit"
                                                >
                                                    <FontAwesomeIcon icon={faEdit} />
                                                </Button>
                                                <Button variant="danger" title="Delete" onClick={() => handleShowModal(product, "delete")}>
                                                    <FontAwesomeIcon icon={faTrash} />
                                                </Button>
                                            </td>
                                        </motion.tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="5" className="text-center text-muted">No products found</td>
                                    </tr>
                                )}
                            </tbody>
                        </Table>

                        {/* Pagination */}
                        {products.length > 0 && totalPages > 1 && (
                            <Pagination className="justify-content-center">
                                {[...Array(totalPages)].map((_, index) => (
                                    <Pagination.Item
                                        key={index}
                                        active={index + 1 === currentPage}
                                        onClick={() => setPage(index + 1)}
                                    >
                                        {index + 1}
                                    </Pagination.Item>
                                ))}
                            </Pagination>
                        )}
                    </>
                )}
            </motion.div>

            {/* Modal for Edit & Delete */}
         





            <Modal show={showModal} onHide={handleCloseModal} centered>
                <Modal.Header closeButton>
                    <Modal.Title>
                        {modalMode === "detail" ? "Product Details" : modalMode === "edit" ? "Edit Product" : "Confirm Delete"}
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    {modalMode === "detail" ? (
                        <>
                            <img
                                src={updatedProduct.image?.startsWith("http") ? image : `http://localhost:5000${updatedProduct.image}`}
                                alt={name}
                                className="img-fluid mb-3"
                                style={{ maxHeight: "300px", objectFit: "cover" }}
                            />
                            <h4 className="fs-5 text-dark">Name: <strong>{updatedProduct.name}</strong></h4>
                            <p className="fs-5 text-dark">Price: <strong>${updatedProduct.price}</strong></p>
                            <p className="fs-5 text-dark">Category: <strong>{updatedProduct.category?.name}</strong></p>
                            <p className="fs-5 text-dark">Brand: <strong>{updatedProduct.brand}</strong></p>
                            <p className='fs-5 text-dark me-4'>
                                In Stock
                                <Button variant="warning ms-2">{updatedProduct.quantity}</Button>
                            </p>
                            <p className="text-muted">{updatedProduct.description}</p>
                        </>
                    ) : modalMode === "edit" ? (
                        <>
                            {/* Image Upload */}
                            <Form.Group className="mb-3">
                                <Form.Label className="text-dark">Upload New Image</Form.Label>
                                <Form.Control type="file" onChange={(e) => setFile(e.target.files[0])} />
                                <Button className="mt-2" onClick={handleFileUpload} disabled={uploading}>
                                    {uploading ? "Uploading..." : "Upload Image"}
                                </Button>
                            </Form.Group>

                            {/* Product Name */}
                            <Form.Group className="mb-3">
                                <Form.Label className="text-dark">Product Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter product name"
                                    value={updatedProduct.name}
                                    onChange={(e) => setUpdatedProduct({ ...updatedProduct, name: e.target.value })}
                                />
                            </Form.Group>

                            {/* Brand */}
                            <Form.Group className="mb-3">
                                <Form.Label className="text-dark">Product Brand</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter brand name"
                                    value={updatedProduct.brand}
                                    onChange={(e) => setUpdatedProduct({ ...updatedProduct, brand: e.target.value })}
                                />
                            </Form.Group>

                            {/* Quantity */}
                            <Form.Group className="mb-3">
                                <Form.Label className="text-dark">Product Quantity</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter quantity"
                                    value={updatedProduct.quantity}
                                    onChange={(e) => setUpdatedProduct({ ...updatedProduct, quantity: e.target.value })}
                                />
                            </Form.Group>

                            {/* Category Dropdown */}
                            <Form.Group className="mb-3">
                                <Form.Label className="text-dark">Product Category</Form.Label>
                                <Form.Select
                                    value={updatedProduct.category}
                                    onChange={(e) => setUpdatedProduct({ ...updatedProduct, category: e.target.value })}
                                >
                                    <option value="">Select Category</option>
                                    {categoriesLoading ? (
                                        <option>Loading...</option>
                                    ) : (
                                        categoriesData?.data?.map((category) => (
                                            <option key={category._id} value={category._id}>
                                                {category.name}
                                            </option>
                                        ))
                                    )}
                                </Form.Select>
                            </Form.Group>

                            {/* Description */}
                            <Form.Group className="mb-3">
                                <Form.Label className="text-dark"> Product Description</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    rows={3}
                                    placeholder="Enter product description"
                                    value={updatedProduct.description}
                                    onChange={(e) => setUpdatedProduct({ ...updatedProduct, description: e.target.value })}
                                />
                            </Form.Group>

                            {/* Price */}
                            <Form.Group className="mb-3">
                                <Form.Label className="text-dark">Product Price</Form.Label>
                                <Form.Control
                                    type="number"
                                    placeholder="Enter price"
                                    value={updatedProduct.price}
                                    onChange={(e) => setUpdatedProduct({ ...updatedProduct, price: e.target.value })}
                                />
                            </Form.Group>

                            {/* Create Product Button */}
                            <Button onClick={handleUpdateProduct} variant="success" disabled={updating}>
                                {updating ? "Updating..." : "Update Product"}
                            </Button>

                        </>
                    ) : (
                        <>
                        <p className="text-dark">Are you sure you want to delete this product?</p>

                        <Button onClick={handleDeleteProduct} variant="danger" disabled={deleting}>
                            {deleting ? "Deleting..." : "Delete Product"}
                        </Button>
                    </>
                    )}
                </Modal.Body>
            </Modal>
        </Container>
    );
};

export default ManageProductsPage;
