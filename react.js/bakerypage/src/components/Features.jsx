import "./Features.css";

function Features() {
  const features = [
    {
      title: "Baked Fresh Daily",
      image: "/img3.png",
      description:
        "Our bread is baked fresh daily, contains no preservatives and is very high in quality. It is also especially nice and soft",
    },
    {
      title: "Great Value",
      image: "/img4.png",
      description:
        "With the most competitive prices on the market we are able to deliver great value without compromising on taste",
    },
    {
      title: "Institutions",
      image: "/img5.png",
      description:
        "We serve a wide range of institutions including universities, airlines, hotels and schools. Order daily for tomorrow",
    },
    {
      title: "Delivery To Your Door",
      image: "/img6.png",
      description:
        "Fresh bakery items delivered directly to your doorstep.",
    },
    {
      title: "No Order Too Large",
      image: "/img7.png",
      description:
        "We can handle both small and large bakery orders.",
    },
  ];

  return (
    <section className="features">
      <h2>
        We bake fresh, handmade bread, pastries and cakes every day
      </h2>

      <div className="feature-grid">
        {features.map((item, index) => (
          <div className="feature-card" key={index}>
            <img src={item.image} alt={item.title} />

            <h3>{item.title}</h3>

            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Features;