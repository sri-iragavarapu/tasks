import React from "react";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero">

      <div className="hero-content">

        <p className="subtitle">
          FRESH BREAD & BAKED GOODS
        </p>

        <h1>Baked fresh daily</h1>

        <div className="info">
          <p>📍 254 W 27ST ST, NEW YORK, NY 10011</p>
          <p>📱 (212) 123-4567</p>
        </div>

        <div className="timing">
          <p>Monday - Wednesday 9am - 7pm</p>
          <p>Thursday - Saturday 9am - 8pm</p>
          <p>Sunday 9am - 6pm</p>
        </div>

        <button>VIEW PRODUCTS</button>

      </div>

      <div className="hero-image">
        <img src="/img2.png" alt="baker" />
      </div>

    </section>
  );
}

export default Hero;