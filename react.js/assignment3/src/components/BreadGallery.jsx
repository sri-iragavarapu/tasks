import "./BreadGallery.css";

function BreadGallery() {
  return (
    <section className="gallery">
      <h2>Our Bread</h2>
      <p>A values-driven bakery</p>

      <div className="gallery-grid">
        <img src="/img8.jpg" alt="" />
        <img src="/img9.jpg" alt="" />
        <img src="/img10.jpg" alt="" />
        <img src="/img11.jpg" alt="" />
      </div>
    </section>
  );
}

export default BreadGallery;