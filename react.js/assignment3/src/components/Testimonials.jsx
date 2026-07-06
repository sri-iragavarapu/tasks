import "./Testimonials.css";

function Testimonials() {

  const people = [
    "STELLA LARSON",
    "NICK JHONSON",
    "OLGA IVANOVA",
    "PAUL HUDSON",
    "CASH HUDSON",
    "MIKE PERRY"
  ];

  return (
    
    <section className="testimonials">
      <h2>Testimonials</h2>

      <div className="testimonial-grid">

        {people.map((person,index)=>(
          <div className="testimonial-card" key={index}>
            <img src="/img24.png" alt="quotes" />

            <p>
             Sample text. Click to select the text box. Click again or double click to start editing the text.
            </p><br/>

            <h4>{person}</h4>
          </div>
        ))}

      </div>

      <div className="food-grid">
       
        <div>
          <img src="/img25.jpg" alt="" />
          <h3>Breads</h3>
<p>
  Freshly baked artisan breads made daily with quality ingredients and traditional recipes.
</p>
        </div>

        <div>
          <img src="/img26.jpg" alt="" />
         <h3>Cookies</h3>
<p>
  Delicious homemade cookies with a perfect balance of sweetness and flavor.
</p>
        </div>

        <div>
          <img src="/img27.jpg" alt="" />
         <h3>Pastries</h3>
         <p>
  Light, flaky pastries crafted with care and baked fresh every day.
</p>
        </div>

      </div>

    </section>
  );
}

export default Testimonials;