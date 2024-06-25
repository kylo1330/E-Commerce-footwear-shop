import axios from "axios";
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { useSelector } from "react-redux";
import checkAuth from "../auth/checkAuth";

function EditFootwear() {
    const { footwearId } = useParams();
    const [brand, setBrand] = useState("");
    const [category, setCategory] = useState("");
    const [model, setModel] = useState("");
    const [size, setSize] = useState(""); // Updated to use a dropdown
    const [price, setPrice] = useState("");
    const [stock, setStock] = useState("");
    const [image, setImage] = useState(null);
    const navigate = useNavigate();
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        if (user && user.token) {
            axios.get(`http://127.0.0.1:8000/shop/event/${footwearId}`, {
                headers: { 'Authorization': `Token ${user.token}` }
            })
            .then(response => {
                const { brand, category, model, size, price, stock } = response.data;
                setBrand(brand);
                setCategory(category);
                setModel(model);
                setSize(size);
                setPrice(price);
                setStock(stock);
            })
            .catch(error => {
                console.error('Error fetching footwear:', error);
            });
        }
    }, [footwearId, user]);

    function updateFootwear() {
        if (user && user.token) {
            const formData = new FormData();
            formData.append('brand', brand);
            formData.append('category', category);
            formData.append('model', model);
            formData.append('size', size);
            formData.append('price', price);
            formData.append('stock', stock);
            if (image) {
                formData.append('image', image);
            }

            axios.put(`http://127.0.0.1:8000/shop/update_event/${footwearId}`, formData, {
                headers: {
                    'Authorization': `Token ${user.token}`,
                    'Content-Type': 'multipart/form-data'
                }
            })
            .then(response => {
                navigate('/'); // Assuming success route exists
            })
            .catch(error => {
                console.error('Error updating footwear:', error);
                if (error.response) {
                    console.error('Response data:', error.response.data);
                }
            });
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        updateFootwear();
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
                        <h1 className="text-center">Edit Footwear</h1>
                        <form onSubmit={handleSubmit} encType="multipart/form-data">
                            <div className="form-group">
                                <label>Brand</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={brand}
                                    onChange={(event) => { setBrand(event.target.value) }}
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <input
                                    type="text"
                                    className="form-control"
                                    value={category}
                                    onChange={(event) => setCategory(event.target.value)}
                                />
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
                            <button type="submit" className="btn btn-primary">Submit</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default checkAuth(EditFootwear);
