import "./Footer.css";
import {
  MdLocationOn,
  MdEmail,
  MdPhone
} from "react-icons/md";
import {
  FaFacebookF,
  FaInstagram
} from "react-icons/fa";

import { FaXTwitter } from "react-icons/fa6";

function Footer() {
  return (
    <footer className="footer">

      <div className="footer-logo">
        <img src="/img28.png" alt="Bakery Logo" />
      </div>

      <div className="footer-grid">

        <div>
          <h3>Quick Links</h3>
          <p>About Us</p>
          <p>Bakery Menu</p>
          <p>Visit Us</p>
        </div>

        <div>
          <h3>Help</h3>
          <p>FAQs</p>
          <p>Allergens</p>
          <p>Contact</p>
        </div>

        <div>
          <h3>Get In Touch</h3>
          <p> <MdLocationOn className="footer-icon" /> New York</p>
          <p><MdEmail className="footer-icon" /> hi@bakery.com</p>
          <p><MdPhone className="footer-icon" />+1 (234) 567-8910</p>
        </div>

        <div>
          <h3>Subscribe</h3>

          <input
            type="email"
            placeholder="Enter a valid email address"
          />

          <button className="button">SEND A MESSAGE</button>
        </div>

      </div>
      <div className="social-icons">

  <a
    href="https://facebook.com"
    target="_blank"
    rel="noreferrer"
  >
    <FaFacebookF />
  </a>

  <a
    href="https://x.com"
    target="_blank"
    rel="noreferrer"
  >
    <FaXTwitter />
  </a>

  <a
    href="https://instagram.com"
    target="_blank"
    rel="noreferrer"
  >
    <FaInstagram />
  </a>

</div>
    </footer>
  );
}

export default Footer;