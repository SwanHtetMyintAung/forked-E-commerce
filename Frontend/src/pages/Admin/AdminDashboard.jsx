import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import AdminSidebar from "./AdminSidebar";
import AnalyticsChart from "../../components/AnalyticsChart.jsx";
import "../../../public/css/AdminDashboard.css";

function AdminDashboard() {
  // Sidebar state for mobile responsiveness
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dark Mode State (Saves User Preference)
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("darkMode") === "true";
  });

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  return (
    <div className={`dashboard-container ${darkMode ? "dark-mode" : "light-mode"}`}>
      <AdminSidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} darkMode={darkMode} setDarkMode={setDarkMode} />

      <div className={`dashboard-content ${sidebarOpen ? "blur-content" : ""}`} onClick={() => setSidebarOpen(false)}>
        <Container fluid>
          <Row className="mb-4">
            <Col>
              <h2 className="text-center">Admin Dashboard</h2>
            </Col>
          </Row>

          {/* Dashboard Cards */}
          <Row>
            {[
              { title: "Users", value: "1,245", color: "primary" },
              { title: "Revenue", value: "$50,230", color: "success" },
              { title: "Orders", value: "843", color: "danger" },
              { title: "Messages", value: "234", color: "warning" },
            ].map((stat, index) => (
              <Col xs={12} sm={6} md={4} lg={3} key={index}>
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.2 }}>
                  <Card className={`dashboard-card border-${stat.color} shadow-lg`}>
                    <Card.Body>
                      <h5 className={`text-${stat.color}`}>{stat.title}</h5>
                      <h3 className="fw-bold">{stat.value}</h3>
                      <Button variant={stat.color} className="mt-2">View Details</Button>
                    </Card.Body>
                  </Card>
                </motion.div>
              </Col>
            ))}
          </Row>

          {/* Analytics Chart */}
          <Row className="mt-4">
            <Col xs={12}>
              <AnalyticsChart />
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
}

export default AdminDashboard;
