import "./AboutBakery.css";

function AboutBakery() {
  return (
    <section className="about">
      <div className="about-text">
        <h2>About Bakery</h2>

        <p>
  We are passionate about baking fresh bread, cakes, and pastries
  using quality ingredients and traditional methods. Every product
  is carefully prepared by our skilled bakers to bring delicious
  flavors and memorable experiences to our customers every day.
</p>

        <div className="about-links">
          <span>Our People</span>
          <span>Our Values</span>
          <span>Our History</span>
          <span>Our Culture</span>
          <span>Ingredients</span>
          <span>Our Bakery</span>
        </div>
      </div>

      <div className="about-image">
        <img src="/img12.png" alt="" />
      </div>
    </section>
  );
}

export default AboutBakery;