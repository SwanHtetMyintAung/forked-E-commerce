import React from "react";
import { motion } from "framer-motion";
import "./About.css"; // CSS for responsiveness and styling

function About() {
  return (
    <div className="about-page">
      <div className="about-content">
        {/* Text Section 1 - Left */}
        <motion.div
          className="about-text-container left"
          initial={{ opacity: 0, x: -50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <h2 className="heading">About Mega Mart (Myanmar)</h2>
          <p>
            At Mega Mart (Myanmar), we strive to provide exceptional value,
            quality products, and unparalleled service. Our commitment to
            innovation and customer satisfaction sets us apart as a leader in
            the retail industry.
          </p>
        </motion.div>

        {/* Text Section 2 - Center */}
        <motion.div
          className="about-text-container left"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <h2 className="heading">Our Vision</h2>
          <p>
            Mega Mart (Myanmar) envisions becoming a leading retail brand that
            empowers communities and improves lifestyles. We aim to provide
            high-quality products, great value, and exceptional service to all
            our customers.
          </p>
        </motion.div>

        {/* Text Section 3 - Right */}
        <motion.div
          className="about-text-container left"
          initial={{ opacity: 0, x: 50 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h2 className="heading">Our Commitment</h2>
          <p>
            We are committed to delivering excellence in every aspect of our
            business. From sustainable practices to community involvement, Mega
            Mart (Myanmar) focuses on building trust and delivering a seamless
            shopping experience.
          </p>
        </motion.div>
      </div>
    </div>
  );
}

export default About;
