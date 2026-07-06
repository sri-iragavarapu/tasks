import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import Features from "./components/Features";
import BreadGallery from "./components/BreadGallery";
import AboutBakery from "./components/AboutBakery";
import BestBread from "./components/BestBread";
import Products from "./components/Products";
import Testimonials from "./components/Testimonials";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Features />
      <BreadGallery />
      <AboutBakery />
      <BestBread />
      <Products />
      <Testimonials />
      <Newsletter />
      <Footer />
    </>
  );
}

export default App;