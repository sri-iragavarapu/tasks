import "./Products.css";

function Products() {
  const products = [
    {
      image: "/img16.jpg",
      title: "Croissant",
      description:
        "Freshly baked buttery croissants with a light and flaky texture."
    },
    {
      image: "/img17.jpg",
      title: "Brownies",
      description:
        "Rich chocolate brownies made with premium cocoa and chocolate chips."
    },
    {
      image: "/img18.png",
      title: "Cinnamon Bun",
      description:
        "Soft and sweet cinnamon buns topped with delicious icing."
    },
    {
      image: "/img19.png",
      title: "Turkish Bagels",
      description:
        "Traditional Turkish bagels with a crispy crust and soft center."
    },
    {
      image: "/img20.png",
      title: "Doughnuts",
      description:
        "Fresh doughnuts available in a variety of classic flavors."
    },
    {
      image: "/img21.png",
      title: "Tarts",
      description:
        "Fruit-filled tarts baked with a buttery and crispy crust."
    },
    {
      image: "/img22.png",
      title: "Shortbread",
      description:
        "Classic shortbread cookies with a rich buttery flavor."
    },
    {
      image: "/img23.png",
      title: "Cookies",
      description:
        "Homemade cookies baked daily using quality ingredients."
    }
  ];

  return (
    <section className="products">
      <h2>Brownies, Pastries, etc</h2>

      <div className="products-grid">
        {products.map((item, index) => (
          <div className="product-card" key={index}>
            <img
              src={item.image}
              alt={item.title}
            />

            <h3>{item.title}</h3>

            <p>{item.description}</p>

            <a href="/">more</a>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Products;