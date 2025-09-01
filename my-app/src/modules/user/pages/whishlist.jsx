// src/modules/user/pages/Whishlist.jsx
import { useWishlist } from "../../../context/WishlistContext";

export default function Wishlist() {
  const { wishlist, removeFromWishlist } = useWishlist();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>
      
      {wishlist.length === 0 ? (
        <p>No items in wishlist.</p>
      ) : (
        <ul className="space-y-4">
          {wishlist.map((item) => (
            <li key={item.id} className="flex justify-between items-center border p-3 rounded">
              <span>{item.name} - ${item.price}</span>
              <button 
                onClick={() => removeFromWishlist(item.id)} 
                className="bg-red-500 text-white px-3 py-1 rounded"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
