import { useState, useEffect } from "react";
import Api from "../../auth/api";
import { toast } from "react-toastify";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
    count: "",
    category: "",
    imageUrl: "",
    isActive: true,
  });

  // Fetch products
  const fetchProducts = async () => {
    const res = await Api.get("/products");
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Add product
  const handleAdd = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast("Please fill all fields");
      return;
    }

    const productToAdd = {
      id: Date.now().toString(), // simple unique ID
      name: newProduct.name,
      description: newProduct.description,
      price: parseFloat(newProduct.price),
      count: parseInt(newProduct.count || 0),
      category: newProduct.category,
      images: newProduct.imageUrl ? [newProduct.imageUrl] : [],
      isActive: newProduct.isActive,
      created_at: new Date().toISOString().split("T")[0], // YYYY-MM-DD
    };

    await Api.post("/products", productToAdd);

    setNewProduct({
      name: "",
      description: "",
      price: "",
      count: "",
      category: "",
      imageUrl: "",
      isActive: true,
      createdAt: new Date().toISOString(),

    });

    fetchProducts();
  };

  // Delete product
  const handleDelete = async (id) => {
    await Api.delete(`/products/${id}`);
    fetchProducts();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Manage Products</h2>

      {/* Add Product Form */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <input
          type="text"
          placeholder="Name"
          value={newProduct.name}
          onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Price"
          value={newProduct.price}
          onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Count (stock)"
          value={newProduct.count}
          onChange={(e) => setNewProduct({ ...newProduct, count: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Category"
          value={newProduct.category}
          onChange={(e) =>
            setNewProduct({ ...newProduct, category: e.target.value })
          }
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Image URL"
          value={newProduct.imageUrl}
          onChange={(e) =>
            setNewProduct({ ...newProduct, imageUrl: e.target.value })
          }
          className="border p-2 rounded col-span-2"
        />
        <textarea
          placeholder="Description"
          value={newProduct.description}
          onChange={(e) =>
            setNewProduct({ ...newProduct, description: e.target.value })
          }
          className="border p-2 rounded col-span-2"
        />
        <label className="flex items-center space-x-2 col-span-2">
          <input
            type="checkbox"
            checked={newProduct.isActive}
            onChange={(e) =>
              setNewProduct({ ...newProduct, isActive: e.target.checked })
            }
          />
          <span>Active Product</span>
        </label>
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded col-span-2"
        >
          Add Product
        </button>
      </div>

      {/* Products List */}
      <ul className="space-y-3">
        {products.map((p) => (
          <li
            key={p.id}
            className="border p-3 rounded bg-white flex justify-between items-center"
          >
            <div>
              <p className="font-bold">
                {p.name} - ${p.price}
              </p>
              <p className="text-sm text-gray-600">{p.category}</p>
              <p className="text-sm">{p.description}</p>
              <p className="text-sm">Stock: {p.count}</p>
              <p className="text-sm">Created: {p.created_at}</p>
              {p.images?.[0] && (
                <img
                  src={p.images[0]}
                  alt={p.name}
                  className="w-20 h-20 object-cover mt-2 rounded"
                />
              )}
            </div>
            <div className="flex flex-col items-end space-y-2">
              <span
                className={`px-2 py-1 text-sm rounded ${
                  p.isActive
                    ? "bg-green-200 text-green-800"
                    : "bg-red-200 text-red-800"
                }`}
              >
                {p.isActive ? "Active" : "Inactive"}
              </span>
              <button
                onClick={() => handleDelete(p.id)}
                className="bg-red-600 text-white px-3 py-1 rounded"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
