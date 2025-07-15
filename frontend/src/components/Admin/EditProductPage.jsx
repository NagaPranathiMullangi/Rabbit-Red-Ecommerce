import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchProductDetails } from "../../../redux/slices/productsSlice";
import { updateProduct } from "../../../redux/slices/adminProductSlice";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";

function EditProductPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const { selectedProduct, loading, error } = useSelector(
    (state) => state.products
  );

  const [productData, setProductData] = useState({
    name: "",
    description: "",
    price: 0,
    countInStock: 0,
    sku: "",
    category: "",
    brand: "",
    sizes: [],
    colors: [],
    collections: "",
    material: "",
    gender: "",
    images: [],
  });

  const [uploading, setUploading] = useState(false); // imagre uploading state

  useEffect(() => {
    if (id) {
      dispatch(fetchProductDetails(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (selectedProduct) {
      setProductData(selectedProduct);
    }
  }, [selectedProduct]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData(); // ✅ FIXED HERE
    formData.append("image", file);

    try {
      setUploading(true);
      const { data } = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data", // ✅ fixed typo: was "content-Type"
          },
        }
      );
      setProductData((prevData) => ({
        ...prevData,
        images: [...prevData.images, { url: data.imageUrl, altText: "" }],
      }));
      setUploading(false);
    } catch (error) {
      console.log(error);
      setUploading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(updateProduct({ id, productData }));
    navigate("/admin/products");
  };

  if (loading) {
    return <p>loading</p>;
  }

  if (error) {
    return <p>error:{error}</p>;
  }

  return (
    <div className="max-w-5xl mx-auto p-6 shadow-md rounded-md">
      <h2 className="text-3xl font-bold mb-6">Edit Product</h2>

      <form onSubmit={handleSubmit}>
        {/*name */}
        <div className="mb-6">
          <label className="block font-semibold mb-2 ">Product Name</label>
          <input
            type="text"
            value={productData.name}
            name="name"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/**decription */}
        <div className="mb-6">
          <label className="block font-semibold mb-2 ">Description</label>
          <textarea
            name="description"
            value={productData.description}
            className="w-full border border-gray-300 p-2 rounded-md"
            rows={4}
            onChange={handleChange}
            required></textarea>
        </div>

        {/* price */}
        <div className="mb-6">
          <label className="block font-semibold mb-2 ">Price</label>
          <input
            type="number"
            value={productData.price}
            name="price"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/* count in stock */}
        <div className="mb-6">
          <label className="block font-semibold mb-2 ">Count In Stock</label>
          <input
            type="numner"
            value={productData.countInStock}
            name="countInStock"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        {/*sku */}
        <div className="mb-6">
          <label className="block font-semibold mb-2 ">SKU</label>
          <input
            type="text"
            value={productData.sku}
            name="sku"
            onChange={handleChange}
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* sizes */}
        <div className="mb-6">
          <label className="block font-semibold mb-2 ">
            Sizes (comma-seperated)
          </label>
          <input
            type="text"
            value={productData.sizes.join(",")}
            name="sizes"
            onChange={(e) =>
              setProductData({
                ...productData,
                sizes: e.target.value.split(",").map((size) => size.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/*colors */}
        <div className="mb-6">
          <label className="block font-semibold mb-2 ">
            Colors (comma-seperated)
          </label>
          <input
            type="text"
            value={productData.colors.join(",")}
            name="colors"
            onChange={(e) =>
              setProductData({
                ...productData,
                colors: e.target.value.split(",").map((color) => color.trim()),
              })
            }
            className="w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>

        {/* image uplaod */}
        <div className="mb-6">
          <label className="block font-semibold mb-2">Upload Image</label>
          {uploading && <p>uploading image</p>}
          <input type="file" onChange={handleImageUpload} />
          <div className="flex gap-4 mt-4">
            {productData.images.map((image, index) => (
              <div key={index}>
                <img
                  src={image.url}
                  alt={image.altText || "product image"}
                  className="w-20 h-20 object-cover rounded-md shadow-md"
                />
              </div>
            ))}
          </div>
        </div>

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded-md
        hover:bg-green-600 transition-colors">
          Update Product
        </button>
      </form>
    </div>
  );
}

export default EditProductPage;
