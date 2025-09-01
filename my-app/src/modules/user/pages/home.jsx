import Footer from "../../../components/footer";
import Hero from "../../../components/hero";
import Navbar from "../../../components/navbar";
import Products from "./products";
import Carts from "./carts";
// import Orders from "./orders";
// import Products from "./products";
// import Whishlist from "./whishlist";

export default function Home() {
  return (
    <>
    <Navbar/>
    <Hero/>
    {/* <Carts/>
    <Orders/>
    <Products/>
    <Whishlist/> */}
    <Products/>
    <Carts/>
    <Footer/>


      
    </>
  )
}
