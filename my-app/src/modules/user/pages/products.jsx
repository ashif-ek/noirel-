// import axios from "axios"
// import { useEffect, useState } from "react"

// export default function Products() {
//   const [products, setProducts] =useState([])

//     useEffect(()=>{
//       axios.get("http://localhost:5000/products")
//       .then(res=> setProducts(res.data))
//       .catch(err=> console.error("error", err))
//     },
//     [])

//   return (
//     <>
//       <ul>{products.map((p)=>
//   <li key ={p.id} >

// <img src={p.images} alt={p.name} />
//     <p>{p.name}</p>
//     <p>{p.description}</p>
//     <p>$ {p.price}</p>
//     <p>{p.count}</p>
//     <p>{p.category}</p>

//   </li>

//     )}</ul>
//     </>
//   )
// }

// import { useEffect, useState } from "react"
// import Api from "../../../auth/api"

// export default function Products() {
//   const [products, setProducts] = useState([])
//   const [cart, setCart] = useState([])  // cart state

//   useEffect(() => {
//     Api.get("/products")
//       .then(res => setProducts(res.data))
//       .catch(err => console.error("error", err))
//   }, [])

//   // Add to Cart function
//   const addToCart = (product) => {
//     setCart((prevCart) => {
//       // check if product already exists in cart
//       const existing = prevCart.find((item) => item.id === product.id)
//       if (existing) {

//         // increase quantity
//         return prevCart.map((item) =>
//           item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item

//         )
//       } else {
//         // add new product with quantity = 1
//         return [...prevCart, { ...product, quantity: 1 }]
//       }
//     })
//   }

//   return (
//     <div className="bg-gray-50 min-h-screen py-10 px-6">
//       <h1 className="text-3xl font-bold text-center mb-10 text-gray-800">Our Products</h1>

//       <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
//         {products.map((p) => (
//           <li
//             key={p.id}
//             className="bg-white rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col"
//           >
//             <img
//               src={p.images}
//               alt={p.name}
//               className="w-full h-56 object-cover"
//             />

//             <div className="p-4 flex-1 flex flex-col justify-between">
//               <div className="space-y-2">
//                 <h2 className="text-lg font-semibold text-gray-800">{p.name}</h2>
//                 <p className="text-sm text-gray-600 line-clamp-2">{p.description}</p>
//                 <p className="text-xl font-bold text-indigo-600">$ {p.price}</p>
//                 <p className="text-sm text-gray-500">Stock: {p.count}</p>
//                 <span className="inline-block text-xs px-2 py-1 rounded-full bg-indigo-100 text-indigo-700">
//                   {p.category}
//                 </span>
//               </div>

//               {/* Add to Cart Button */}
//               <button
//                 onClick={() => addToCart(p)}
//                 className="mt-4 w-full bg-indigo-600 text-white py-2 px-4 rounded-xl font-medium hover:bg-indigo-700 transition-colors duration-300"
//               >
//                 Add to Cart
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>

//       {/* Show Cart (for testing only) */}
//       <div className="mt-10 bg-white shadow-md p-6 rounded-xl">
//         <h2 className="text-2xl font-bold mb-4">🛒 Cart</h2>
//         {cart.length === 0 ? (
//           <p>Your cart is empty</p>
//         ) : (
//           <ul className="space-y-2">
//             {cart.map((item) => (
//               <li key={item.id}>
//                 {item.name} - ${item.price} × {item.quantity}
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>
//     </div>
//   )
// }













// import axios from "axios"
// import { useEffect, useState } from "react"

// export default function Products() {
//   const [products, setProducts] = useState([])
//   const [selectedProduct, setSelectedProduct] = useState(null)
//   const [isModalOpen, setIsModalOpen] = useState(false)

//   useEffect(() => {
//     axios.get("http://localhost:5000/products")
//       .then(res => setProducts(res.data))
//       .catch(err => console.error("error", err))
//   }, [])

//   const openProductModal = (product) => {
//     setSelectedProduct(product)
//     setIsModalOpen(true)
//     document.body.style.overflow = 'hidden'
//   }

//   const closeModal = () => {
//     setIsModalOpen(false)
//     document.body.style.overflow = 'auto'
//   }

//   return (
//     <div className="min-h-screen bg-black text-white">
//       {/* Hero Section */}
//       <div className="relative h-screen flex items-center justify-center overflow-hidden">
//         <div
//           className="absolute inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40 transition-opacity duration-1000"
//           style={{ backgroundImage: "url('https://images.unsplash.com/photo-1595425970377-2f8ded7c7b19?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')" }}
//         ></div>

//         <div className="relative z-10 text-center px-6">
//           <h1 className="text-5xl md:text-7xl font-light mb-6 tracking-wider font-playfair">Essence Rare</h1>
//           <p className="text-xl md:text-2xl max-w-2xl mx-auto mb-10 font-light tracking-widest uppercase border-t border-b border-white/30 py-4">
//             The Art of Scent
//           </p>
//           <div className="animate-bounce mt-20">
//             <svg className="w-8 h-8 mx-auto text-white/70" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
//             </svg>
//           </div>
//         </div>
//       </div>

//       {/* Products Grid */}
//       <div className="py-20 px-6 max-w-7xl mx-auto">
//         <div className="text-center mb-16">
//           <h2 className="text-3xl md:text-4xl font-light mb-4 tracking-wider">Our Collection</h2>
//           <div className="w-20 h-px bg-white/40 mx-auto"></div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
//           {products.map((p) => (
//             <div
//               key={p.id}
//               className="group relative bg-gradient-to-b from-gray-900 to-black rounded-lg overflow-hidden transition-all duration-700 hover:scale-105 cursor-pointer"
//               onClick={() => openProductModal(p)}
//             >
//               <div className="overflow-hidden">
//                 <img
//                   src={p.images}
//                   alt={p.name}
//                   className="w-full h-80 object-cover transform transition-transform duration-700 group-hover:scale-110"
//                 />
//                 <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-80"></div>
//               </div>

//               <div className="absolute bottom-0 left-0 right-0 p-6 text-center">
//                 <h2 className="text-xl font-light mb-2 tracking-wider">{p.name}</h2>
//                 <p className="text-sm text-gray-300 mb-3 font-light tracking-widest">{p.category}</p>
//                 <p className="text-xl font-serif">$ {p.price}</p>

//                 <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
//                   <button className="text-xs tracking-widest uppercase border border-white/30 px-4 py-2 hover:bg-white hover:text-black transition-colors duration-300">
//                     Discover
//                   </button>
//                 </div>
//               </div>

//               <div className="absolute top-4 right-4">
//                 <span className="text-xs bg-white/10 backdrop-blur-lg px-2 py-1 rounded-full text-white/80">
//                   {p.count} in stock
//                 </span>
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Product Modal */}
//       {isModalOpen && selectedProduct && (
//         <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
//           <div className="relative max-w-4xl w-full max-h-[90vh] overflow-auto bg-gradient-to-br from-gray-900 to-black border border-white/10 rounded-lg">
//             <button
//               onClick={closeModal}
//               className="absolute top-4 right-4 z-10 text-white/70 hover:text-white transition-colors"
//             >
//               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M6 18L18 6M6 6l12 12"></path>
//               </svg>
//             </button>

//             <div className="grid md:grid-cols-2 gap-8">
//               <div className="h-96 md:h-full">
//                 <img
//                   src={selectedProduct.images}
//                   alt={selectedProduct.name}
//                   className="w-full h-full object-cover"
//                 />
//               </div>

//               <div className="p-8">
//                 <h2 className="text-3xl font-light mb-2">{selectedProduct.name}</h2>
//                 <p className="text-sm text-gray-300 mb-6 uppercase tracking-widest">{selectedProduct.category}</p>

//                 <p className="text-xl font-serif mb-6">$ {selectedProduct.price}</p>

//                 <p className="text-gray-300 mb-8 leading-relaxed">{selectedProduct.description}</p>

//                 <div className="mb-8">
//                   <p className="text-sm text-gray-400 mb-2">Stock: {selectedProduct.count}</p>
//                   <div className="w-full bg-gray-700 h-2 rounded-full">
//                     <div
//                       className="bg-white h-2 rounded-full"
//                       style={{ width: `${Math.min(selectedProduct.count / 10 * 100, 100)}%` }}
//                     ></div>
//                   </div>
//                 </div>

//                 <button className="w-full py-3 bg-white text-black text-sm tracking-widest uppercase hover:bg-gray-200 transition-colors duration-300">
//                   Add to Cart
//                 </button>

//                 <button className="w-full py-3 mt-4 border border-white/30 text-sm tracking-widest uppercase hover:bg-white/10 transition-colors duration-300">
//                   Save to Wishlist
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }













import { useWishlist } from "../../../context/WishlistContext";
import { useEffect, useState } from "react";
import Api from "../../../auth/api";
import { useCart } from "../../../context/CartContext";

export default function Products() {
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();
  const { addToWishlist } = useWishlist();

  useEffect(() => {
    Api.get("/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.error("error", err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Our Products</h1>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {products.map((p) => (
          <li key={p.id} className="border rounded p-3 flex flex-col">
            <img
              src={p.images}
              alt={p.name}
              className="w-full h-40 object-cover rounded mb-3"
            />

            <h2 className="font-semibold">{p.name}</h2>
            <p className="text-gray-700 mb-2">${p.price}</p>

            <button
              onClick={() => {
                addToCart(p);
                alert(`${p.name} added to cart!`);
              }}
              className="bg-blue-500 text-white px-3 py-1 rounded mb-2"
            >
              Add to Cart
            </button>

            <button
              onClick={() => {
                addToWishlist(p);
                alert(`${p.name} added to wishlist!`);
              }}
              className="bg-red-500 text-white px-3 py-1 rounded"
             
            >
               Add to Wishlist
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
