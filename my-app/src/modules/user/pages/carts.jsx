// import { useCart } from "../../../context/CartContext";

// export default function Cart() {
//   const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

//   const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

//   if (cart.length === 0) {
//     return (
//       <div className="p-6 text-center text-gray-600">
//         <h1 className="text-2xl font-bold mb-4">Your Cart</h1>
//         <p>Your cart is empty</p>
//       </div>
//     );
//   }

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Your Cart</h1>

//       <ul className="space-y-3">
//         {cart.map((item) => (
//           <li
//             key={item.id}
//             className="border p-3 rounded flex justify-between items-center"
//           >
//             <div>
//               <p className="font-medium">{item.name}</p>
//               <p className="text-sm text-gray-600">
//                 ${item.price} × {item.quantity} = ${item.price * item.quantity}
//               </p>
//             </div>

//             <div className="flex items-center space-x-2">
//               <button
//                 onClick={() => updateQuantity(item.id, -1)}
//                 disabled={item.quantity <= 1}
//                 className="px-2 py-1 bg-gray-200 rounded disabled:opacity-50"
//               >
//                 -
//               </button>
//               <span>{item.quantity}</span>
//               <button
//                 onClick={() => updateQuantity(item.id, 1)}
//                 className="px-2 py-1 bg-gray-200 rounded"
//               >
//                 +
//               </button>
//               <button
//                 onClick={() => removeFromCart(item.id)}
//                 className="text-red-500"
//               >
//                 Remove
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>

//       <div className="flex justify-between items-center pt-4 border-t mt-4">
//         <button
//           onClick={clearCart}
//           className="bg-red-500 text-white px-3 py-1 rounded"
//         >
//           Clear Cart
//         </button>
//         <p className="font-bold text-lg">Total: ${total}</p>
//       </div>
//     </div>
//   );
// }





























import { useCart } from "../../../context/CartContext";

export default function Cart() {
  const { cart, updateQuantity, removeFromCart, clearCart } = useCart();

  return (
    <div className="bg-gray-50 min-h-screen py-10 px-6">
      <h1 className="text-3xl font-bold text-center mb-10">🛒 Your Cart</h1>

      {cart.length === 0 ? (
        <p className="text-center text-gray-600">Your cart is empty</p>
      ) : (
        <div className="max-w-xl mx-auto">
          <ul className="space-y-4">
            {cart.map((item) => (
              <li
                key={item.id}
                className="bg-white p-4 rounded-xl shadow flex justify-between items-center"
              >
                <div>
                  <span className="font-semibold">{item.name}</span>
                  <img src= {item.images} alt={item.description} />
                  <p className="text-sm text-gray-600">
                    ${item.price} × {item.quantity} = $
                    {item.price * item.quantity}
                  </p>
                </div>

                <div className="flex items-center space-x-2">
                  {/* Decrease quantity */}
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300"
                  >
                    -
                  </button>

                  <span className="font-semibold">{item.quantity}</span>

                  {/* Increase quantity */}
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="px-3 py-1 bg-gray-200 rounded-full hover:bg-gray-300"
                  >
                    +
                  </button>

                  {/* Remove button */}
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="ml-3 text-red-600 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex justify-between items-center">
            <button
              onClick={clearCart}
              className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Clear Cart
            </button>
            <p className="font-bold text-xl">
              Total: $
              {cart.reduce((sum, item) => sum + item.price * item.quantity, 0)}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}



