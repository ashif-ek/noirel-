
import { useState, useEffect } from "react";
import Api from "../../auth/api";
import { toast } from "react-toastify";
import { FiEdit2, FiTrash2, FiPlus, FiSearch, FiX, FiBox } from "react-icons/fi";

export default function AdminProducts() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    count: "",
    category: "",
    imageUrl: "",
    isActive: true,
  });
  const [editingProduct, setEditingProduct] = useState(null);
  const [filters, setFilters] = useState({ search: "", category: "all", status: "all" });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Fetch products
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const { data } = await Api.get("/products");
      setProducts(data);
      setFilteredProducts(data);
    } catch {
      toast.error("Failed to fetch products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Filter products
  useEffect(() => {
    let result = [...products];
    const { search, category, status } = filters;

    if (search) {
      const s = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(s) ||
          p.description.toLowerCase().includes(s) ||
          p.category.toLowerCase().includes(s)
      );
    }
    if (category !== "all") result = result.filter((p) => p.category === category);
    if (status !== "all") result = result.filter((p) => p.isActive === (status === "active"));

    setFilteredProducts(result);
  }, [filters, products]);

  // Categories for dropdown
  const categories = [...new Set(products.map((p) => p.category))];

  // Reset form
  const resetForm = () =>
    setFormData({
      name: "",
      description: "",
      price: "",
      count: "",
      category: "",
      imageUrl: "",
      isActive: true,
    });

  // Add product
  const handleAdd = async () => {
    if (!formData.name || !formData.price || !formData.category) {
      toast.error("Please fill all required fields");
      return;
    }
    try {
      const newProd = {
        ...formData,
        id: Date.now().toString(),
        price: parseFloat(formData.price),
        count: parseInt(formData.count || 0),
        images: formData.imageUrl ? [formData.imageUrl] : [],
        created_at: new Date().toISOString().split("T")[0],
      };
      await Api.post("/products", newProd);
      toast.success("Product added successfully");
      resetForm();
      setIsFormOpen(false);
      fetchProducts();
    } catch {
      toast.error("Failed to add product");
    }
  };

  // Update product
  const handleUpdate = async () => {
    if (!editingProduct) return;
    try {
      const updated = {
        ...editingProduct,
        price: parseFloat(editingProduct.price),
        count: parseInt(editingProduct.count || 0),
        images: editingProduct.imageUrl
          ? [editingProduct.imageUrl]
          : editingProduct.images || [],
      };
      await Api.put(`/products/${editingProduct.id}`, updated);
      toast.success("Product updated successfully");
      setEditingProduct(null);
      setIsFormOpen(false);
      fetchProducts();
    } catch {
      toast.error("Failed to update product");
    }
  };

  // Delete product
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      await Api.delete(`/products/${id}`);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch {
      toast.error("Failed to delete product");
    }
  };

  // Toggle status
  const toggleStatus = async (product) => {
    try {
      const updated = { ...product, isActive: !product.isActive };
      await Api.put(`/products/${product.id}`, updated);
      toast.success(`Product ${updated.isActive ? "activated" : "deactivated"}`);
      fetchProducts();
    } catch {
      toast.error("Failed to update status");
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-semibold text-gray-800">Product Management</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your product inventory</p>
        </div>
        <button
          onClick={() => setIsFormOpen(true)}
          className="mt-4 md:mt-0 flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2.5 rounded-md"
        >
          <FiPlus className="text-lg" /> Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 mb-6 grid md:grid-cols-3 gap-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
            className="w-full pl-10 pr-4 py-2.5 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={filters.category}
          onChange={(e) => setFilters({ ...filters, category: e.target.value })}
          className="px-4 py-2.5 border rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="px-4 py-2.5 border rounded-md focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {/* Products */}
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin h-12 w-12 border-t-2 border-b-2 border-blue-500 rounded-full" />
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-white border p-8 text-center rounded-lg">
          <FiBox className="mx-auto text-4xl text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-700 mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your search or add a new product</p>
          <button
            onClick={() => setIsFormOpen(true)}
            className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
          >
            <FiPlus /> Add Product
          </button>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProducts.map((p) => (
            <div
              key={p.id}
              className="bg-white border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              {p.images?.[0] && (
                <img src={p.images[0]} alt={p.name} className="h-48 w-full object-cover" />
              )}
              <div className="p-4">
                <div className="flex justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 truncate">{p.name}</h3>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      p.isActive ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {p.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">{p.description}</p>
                <div className="flex justify-between mb-2">
                  <span className="text-blue-600 font-semibold">${p.price}</span>
                  <span className="text-gray-500 text-sm">{p.count} in stock</span>
                </div>
                <div className="flex justify-between gap-2">
                  <button
                    onClick={() => toggleStatus(p)}
                    className={`flex-1 py-2 text-sm rounded ${
                      p.isActive
                        ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                        : "bg-green-100 text-green-700 hover:bg-green-200"
                    }`}
                  >
                    {p.isActive ? "Deactivate" : "Activate"}
                  </button>
                  <button
                    onClick={() => {
                      setEditingProduct({ ...p, imageUrl: p.images?.[0] || "" });
                      setIsFormOpen(true);
                    }}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                  >
                    <FiEdit2 />
                  </button>
                  <button
                    onClick={() => handleDelete(p.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded"
                  >
                    <FiTrash2 />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow w-full max-w-lg">
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-semibold">
                {editingProduct ? "Edit Product" : "Add Product"}
              </h3>
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsFormOpen(false);
                  resetForm();
                }}
              >
                <FiX />
              </button>
            </div>
            <div className="p-4 space-y-3">
              {["name", "price", "count", "category", "imageUrl"].map((field) => (
                <input
                  key={field}
                  type={field === "price" || field === "count" ? "number" : "text"}
                  placeholder={field}
                  value={editingProduct ? editingProduct[field] ?? "" : formData[field]}
                  onChange={(e) =>
                    editingProduct
                      ? setEditingProduct({ ...editingProduct, [field]: e.target.value })
                      : setFormData({ ...formData, [field]: e.target.value })
                  }
                  className="w-full px-3 py-2 border rounded"
                />
              ))}
              <textarea
                rows={3}
                placeholder="Description"
                value={editingProduct ? editingProduct.description : formData.description}
                onChange={(e) =>
                  editingProduct
                    ? setEditingProduct({ ...editingProduct, description: e.target.value })
                    : setFormData({ ...formData, description: e.target.value })
                }
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <div className="flex justify-end gap-2 border-t p-4">
              <button
                onClick={() => {
                  setEditingProduct(null);
                  setIsFormOpen(false);
                  resetForm();
                }}
                className="px-3 py-2 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={editingProduct ? handleUpdate : handleAdd}
                className="px-3 py-2 bg-blue-600 text-white rounded"
              >
                {editingProduct ? "Save" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}































// import { useState, useEffect } from "react";
// import Api from "../../auth/api";
// import { toast } from "react-toastify";

// export default function AdminProducts() {
//   const [products, setProducts] = useState([]);
//   const [newProduct, setNewProduct] = useState({
//     name: "",
//     description: "",
//     price: "",
//     count: "",
//     category: "",
//     imageUrl: "",
//     isActive: true,
//   });
//   const [editingProduct, setEditingProduct] = useState(null); // track editing product

//   // Fetch products
//   const fetchProducts = async () => {
//     const res = await Api.get("/products");
//     setProducts(res.data);
//   };

//   useEffect(() => {
//     fetchProducts();
//   }, []);

//   // Add product
//   const handleAdd = async () => {
//     if (!newProduct.name || !newProduct.price || !newProduct.category) {
//       toast.error("Please fill all required fields");
//       return;
//     }

//     const productToAdd = {
//       id: Date.now().toString(), // simple unique ID
//       name: newProduct.name,
//       description: newProduct.description,
//       price: parseFloat(newProduct.price),
//       count: parseInt(newProduct.count || 0),
//       category: newProduct.category,
//       images: newProduct.imageUrl ? [newProduct.imageUrl] : [],
//       isActive: newProduct.isActive,
//       created_at: new Date().toISOString().split("T")[0], // YYYY-MM-DD
//     };

//     await Api.post("/products", productToAdd);
//     toast.success("Product added");

//     resetForm();
//     fetchProducts();
//   };

//   // Edit product (save changes)
//   const handleUpdate = async () => {
//     if (!editingProduct) return;

//     const updatedProduct = {
//       ...editingProduct,
//       price: parseFloat(editingProduct.price),
//       count: parseInt(editingProduct.count || 0),
//       images: editingProduct.imageUrl
//         ? [editingProduct.imageUrl]
//         : editingProduct.images || [],
//     };

//     await Api.put(`/products/${editingProduct.id}`, updatedProduct);
//     toast.success("Product updated");

//     setEditingProduct(null);
//     resetForm();
//     fetchProducts();
//   };

//   // Delete product
//   const handleDelete = async (id) => {
//     await Api.delete(`/products/${id}`);
//     toast.success("Product deleted");
//     fetchProducts();
//   };

//   // Reset form
//   const resetForm = () => {
//     setNewProduct({
//       name: "",
//       description: "",
//       price: "",
//       count: "",
//       category: "",
//       imageUrl: "",
//       isActive: true,
//     });
//   };

//   return (
//     <div className="p-6">
//       <h2 className="text-2xl font-bold mb-4">Manage Products</h2>

//       {/* Add / Edit Product Form */}
//       <div className="grid grid-cols-2 gap-3 mb-6">
//         <input
//           type="text"
//           placeholder="Name"
//           value={editingProduct ? editingProduct.name : newProduct.name}
//           onChange={(e) =>
//             editingProduct
//               ? setEditingProduct({ ...editingProduct, name: e.target.value })
//               : setNewProduct({ ...newProduct, name: e.target.value })
//           }
//           className="border p-2 rounded"
//         />
//         <input
//           type="number"
//           placeholder="Price"
//           value={editingProduct ? editingProduct.price : newProduct.price}
//           onChange={(e) =>
//             editingProduct
//               ? setEditingProduct({ ...editingProduct, price: e.target.value })
//               : setNewProduct({ ...newProduct, price: e.target.value })
//           }
//           className="border p-2 rounded"
//         />
//         <input
//           type="number"
//           placeholder="Count (stock)"
//           value={editingProduct ? editingProduct.count : newProduct.count}
//           onChange={(e) =>
//             editingProduct
//               ? setEditingProduct({ ...editingProduct, count: e.target.value })
//               : setNewProduct({ ...newProduct, count: e.target.value })
//           }
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           placeholder="Category"
//           value={editingProduct ? editingProduct.category : newProduct.category}
//           onChange={(e) =>
//             editingProduct
//               ? setEditingProduct({
//                   ...editingProduct,
//                   category: e.target.value,
//                 })
//               : setNewProduct({ ...newProduct, category: e.target.value })
//           }
//           className="border p-2 rounded"
//         />
//         <input
//           type="text"
//           placeholder="Image URL"
//           value={
//             editingProduct
//               ? editingProduct.imageUrl || editingProduct.images?.[0] || ""
//               : newProduct.imageUrl
//           }
//           onChange={(e) =>
//             editingProduct
//               ? setEditingProduct({ ...editingProduct, imageUrl: e.target.value })
//               : setNewProduct({ ...newProduct, imageUrl: e.target.value })
//           }
//           className="border p-2 rounded col-span-2"
//         />
//         <textarea
//           placeholder="Description"
//           value={
//             editingProduct ? editingProduct.description : newProduct.description
//           }
//           onChange={(e) =>
//             editingProduct
//               ? setEditingProduct({
//                   ...editingProduct,
//                   description: e.target.value,
//                 })
//               : setNewProduct({ ...newProduct, description: e.target.value })
//           }
//           className="border p-2 rounded col-span-2"
//         />
//         <label className="flex items-center space-x-2 col-span-2">
//           <input
//             type="checkbox"
//             checked={
//               editingProduct ? editingProduct.isActive : newProduct.isActive
//             }
//             onChange={(e) =>
//               editingProduct
//                 ? setEditingProduct({
//                     ...editingProduct,
//                     isActive: e.target.checked,
//                   })
//                 : setNewProduct({ ...newProduct, isActive: e.target.checked })
//             }
//           />
//           <span>Active Product</span>
//         </label>
//         {editingProduct ? (
//           <button
//             onClick={handleUpdate}
//             className="bg-green-600 text-white px-4 py-2 rounded col-span-2"
//           >
//             Save Changes
//           </button>
//         ) : (
//           <button
//             onClick={handleAdd}
//             className="bg-blue-600 text-white px-4 py-2 rounded col-span-2"
//           >
//             Add Product
//           </button>
//         )}
//       </div>

//       {/* Products List */}
//       <ul className="space-y-3">
//         {products.map((p) => (
//           <li
//             key={p.id}
//             className="border p-3 rounded bg-white flex justify-between items-center"
//           >
//             <div>
//               <p className="font-bold">
//                 {p.name} - ${p.price}
//               </p>
//               <p className="text-sm text-gray-600">{p.category}</p>
//               <p className="text-sm">{p.description}</p>
//               <p className="text-sm">Stock: {p.count}</p>
//               <p className="text-sm">Created: {p.created_at}</p>
//               {p.images?.[0] && (
//                 <img
//                   src={p.images[0]}
//                   alt={p.name}
//                   className="w-20 h-20 object-cover mt-2 rounded"
//                 />
//               )}
//             </div>
//             <div className="flex flex-col items-end space-y-2">
//               <span
//                 className={`px-2 py-1 text-sm rounded ${
//                   p.isActive
//                     ? "bg-green-200 text-green-800"
//                     : "bg-red-200 text-red-800"
//                 }`}
//               >
//                 {p.isActive ? "Active" : "Inactive"}
//               </span>
//               <button
//                 onClick={() => setEditingProduct({ ...p, imageUrl: p.images?.[0] || "" })}
//                 className="bg-yellow-500 text-white px-3 py-1 rounded"
//               >
//                 Edit
//               </button>
//               <button
//                 onClick={() => handleDelete(p.id)}
//                 className="bg-red-600 text-white px-3 py-1 rounded"
//               >
//                 Delete
//               </button>
//             </div>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
