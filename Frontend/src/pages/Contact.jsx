import React from 'react';
import '../../public/css/Contact.css';

const Contact = () => {
  return (
    <div className="text-light contact-container">
      <h1>Contact Us</h1>

      <div className="contact-form">
        <form action="mailto:goldfutureinfinity@gmail.com" method="post" encType="text/plain"> {/* Or use a form library */}
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" required />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input type="email" id="email" name="email" required />
          </div>

          <div className="form-group">
            <label htmlFor="message">Message:</label>
            <textarea id="message" name="message" rows="5" required></textarea>
          </div>

          <button type="submit" className="submit-button">Send Message</button>
        </form>

        {/* Alternative contact methods */}
        <div className="other-contacts">
          <h2>Or reach us through:</h2>
          <div className="contact-info">
            <p><strong>Email:</strong> info@yourstore.com</p>
            <p><strong>Phone:</strong> +1-555-123-4567</p>  {/* Replace with your number */}
            <p><strong>Address:</strong> 123 Main Street, Anytown, CA 91234</p> {/* Replace with your address */}
          </div>
          {/* Social media links (optional) */}
          <div className="social-media">
            <a href="#" target="_blank" rel="noopener noreferrer"><img src="/images/facebook-icon.png" alt="Facebook" /></a> {/* Replace with your image paths and links */}
            <a href="#" target="_blank" rel="noopener noreferrer"><img src="/images/twitter-icon.png" alt="Twitter" /></a>
            <a href="#" target="_blank" rel="noopener noreferrer"><img src="/images/instagram-icon.png" alt="Instagram" /></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;