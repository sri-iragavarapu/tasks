import "./Newsletter.css";

function Newsletter() {
  return (
    <section className="newsletter">

      <div>
        <h2>Sign up for the newsletter</h2>

        <p>
          Want to be the first to read our news? Subscribe to the newsletter to keep abreast of all events.
        </p>

        <div className="newsletter-form">
          <input
            type="email"
            placeholder="Enter a valid email address"
          />
        </div>
        <button>SUBMIT</button>
      </div>

      <div>
        <h2>Hours & Location</h2>

  <a href="#">14 E 12th St, New York, NY 10007 (123) 456-2253</a>
     <p>Monday - Sunday</p>
      <p>7am - 8pm</p>
      </div>

    </section>
  );
}

export default Newsletter;