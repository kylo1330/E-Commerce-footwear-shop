import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { useSelector } from "react-redux";
import checkAuth from "../auth/checkAuth";

function CreateFootwear() {
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [model, setModel] = useState("");
  const [size, setSize] = useState("");
  const [price, setPrice] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState(null); // State for the image file

  const navigate = useNavigate();
  const user = useSelector((state) => state.auth.user);

  const addFootwear = () => {
    const formData = new FormData();
    formData.append("brand", brand);
    formData.append("category", category);
    formData.append("model", model);
    formData.append("size", size);
    formData.append("price", price);
    formData.append("stock", stock);
    formData.append("image", image); // Append the image file to the form data

    axios
      .post("http://127.0.0.1:8000/shop/create_foot", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Token ${user.token}`,
        },
      })
      .then((response) => {
        navigate("/"); // Assuming success route exists
      })
      .catch((error) => {
        console.error("Error adding new footwear:", error);
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    addFootwear();
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  return (
    <div style={{ backgroundColor: "#ADD8E6", minHeight: "100vh", padding: "20px 0" }}>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-8 offset-2">
            <h1 className="text-center">Add Footwear</h1>
            <form onSubmit={handleSubmit} encType="multipart/form-data">
              <div className="form-group">
                <label>Brand</label>
                <select
                  className="form-control"
                  value={brand}
                  onChange={(event) => setBrand(event.target.value)}
                >
                  <option value="">Select a brand</option>
                  <option value="Nike">Nike</option>
                  <option value="Adidas">Adidas</option>
                  <option value="Puma">Puma</option>
                  <option value="Bata">Bata</option> {/* Added Bata as a brand option */}
                </select>
              </div>
              <div className="form-group">
                <label>Category</label>
                <select
                  className="form-control"
                  value={category}
                  onChange={(event) => setCategory(event.target.value)}
                >
                  <option value="">Select a category</option>
                  <option value="Sports">Sports</option>
                  <option value="Canvas">Canvas</option>
                  <option value="Sandals">Sandals</option>
                  <option value="Slippers">Slippers</option>
                </select>
              </div>
              <div className="form-group">
                <label>Model</label>
                <input
                  type="text"
                  className="form-control"
                  value={model}
                  onChange={(event) => setModel(event.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Size</label>
                <select
                  className="form-control"
                  value={size}
                  onChange={(event) => setSize(event.target.value)}
                >
                  <option value="">Select a size</option>
                  <option value="xs">XS</option>
                  <option value="s">S</option>
                  <option value="m">M</option>
                  <option value="l">L</option>
                  <option value="xl">XL</option>
                </select>
              </div>
              <div className="form-group">
                <label>Price</label>
                <input
                  type="number"
                  className="form-control"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Stock</label>
                <input
                  type="number"
                  className="form-control"
                  value={stock}
                  onChange={(event) => setStock(event.target.value)}
                />
              </div>
              <div className="form-group">
                <label>Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleImageChange}
                />
              </div>
              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default checkAuth(CreateFootwear);
