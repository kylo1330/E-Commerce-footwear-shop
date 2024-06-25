import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import './ListFootwear.css';

const CART_IMAGE_DIR = '/cart_images';

const ListFootwear = () => {
  const [footwears, setFootwears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [counts, setCounts] = useState({});
  const [addToCartDisabled, setAddToCartDisabled] = useState({});
  const [filters, setFilters] = useState({
    category: '',
    brand: '',
    priceMin: '',
    priceMax: '',
    size: '',
  });
  const [filteredFootwears, setFilteredFootwears] = useState([]);

  const user = useSelector(state => state.auth.user);
  const token = user?.token;
  const userId = user?.id;

  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      fetchFootwears();
    }
  }, [user]);

  useEffect(() => {
    setFilteredFootwears(footwears.filter(applyFilters));
  }, [filters, footwears]);

  useEffect(() => {
    const anyCountGreaterThanZero = Object.values(counts).some(count => count > 0);
    setAddToCartDisabled(prevDisabled => {
      const newDisabled = {};
      Object.keys(prevDisabled).forEach(id => {
        newDisabled[id] = anyCountGreaterThanZero ? false : prevDisabled[id];
      });
      return newDisabled;
    });
  }, [counts]);

  const fetchFootwears = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/shop/list_event', {
        headers: { Authorization: `Token ${token}` },
      });
      setFootwears(response.data);
      setAddToCartDisabled(prevDisabled => {
        const newDisabled = {};
        response.data.forEach(footwear => {
          newDisabled[footwear.id] = !footwear.enabled;
        });
        return newDisabled;
      });
      setFilteredFootwears(response.data);
    } catch (error) {
      console.error('Error fetching footwears:', error);
      setError('Failed to fetch footwears. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const addToCart = async (footwear) => {
    const count = counts[footwear.id] || 0;

    if (count === 0) {
      alert('Please select a quantity before adding to cart.');
      return;
    }

    const cartData = {
      category: footwear.category,
      footwear: footwear.id,
      quantity: count,
      image: `${CART_IMAGE_DIR}/${footwear.image}`,
    };

    try {
      await axios.post('http://localhost:8000/shop/add_cart_item/', cartData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });
      // Decrease stock quantity on the admin side
      await decreaseStockQuantity(footwear.id, count);
      alert('Item added to cart');
      setCounts(prevCounts => ({
        ...prevCounts,
        [footwear.id]: 0,
      }));
      navigate(`/cart/`);
    } catch (error) {
      console.error('Error adding item to cart:', error);
      alert('Failed to add item to cart. Please try again.');
    }
  };

  const decreaseStockQuantity = async (footwearId, quantity) => {
    try {
      const response = await axios.put(`http://localhost:8000/update_stock/${footwearId}/`, { quantity }, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Token ${token}`,
        },
      });

      if (response.status === 200) {
        console.log('Stock quantity decreased successfully');
      } else {
        console.error('Failed to decrease stock quantity');
      }
    } catch (error) {
      console.error('Error decreasing stock quantity:', error);
    }
  };

  const increment = (id) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [id]: (prevCounts[id] || 0) + 1,
    }));
  };

  const decrement = (id) => {
    setCounts((prevCounts) => ({
      ...prevCounts,
      [id]: (prevCounts[id] || 0) > 0 ? (prevCounts[id] || 0) - 1 : 0,
    }));
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  const applyFilters = (footwear) => {
    const { category, brand, priceMin, priceMax, size } = filters;
    let result = true;
    if (category && footwear.category !== category) {
      result = false;
    }
    if (brand && footwear.brand !== brand) {
      result = false;
    }
    if (priceMin && footwear.price < parseFloat(priceMin)) {
      result = false;
    }
    if (priceMax && footwear.price > parseFloat(priceMax)) {
      result = false;
    }
    if (size && footwear.size !== size) {
      result = false;
    }
    return result;
  };

  return (
    <div className="list-footwear-container">
      <Navbar />
      <div className="container-fluid" style={{ paddingLeft: '0', marginLeft: '0' }}>
        <div className="row">
          <div className="col-lg-3 filters-container">
            <div className="filters">
              <h4>Filters</h4>
              <div className="filter-group">
                <label htmlFor="category">Category</label>
                <select name="category" id="category" className="form-control" value={filters.category} onChange={handleFilterChange}>
                  <option value="">All</option>
                  <option value="Sports">Sports</option>
                  <option value="Sandals">Sandals</option>
                  <option value="Canvas">Canvas</option>
                  <option value="Slippers">Slippers</option>
                </select>
              </div>
              <div className="
filter-group">
<label htmlFor="brand">Brand</label>
<select name="brand" id="brand" className="form-control" value={filters.brand} onChange={handleFilterChange}>
  <option value="">All</option>
  <option value="Puma">Puma</option>
  <option value="Bata">Bata</option>
  <option value="Adidas">Adidas</option>
  <option value="Nike">Nike</option>
</select>
</div>
<div className="filter-group">
<label htmlFor="priceMin">Price Min</label>
<input type="number" name="priceMin" id="priceMin" className="form-control" value={filters.priceMin} onChange={handleFilterChange} />
</div>
<div className="filter-group">
<label htmlFor="priceMax">Price Max</label>
<input type="number" name="priceMax" id="priceMax" className="form-control" value={filters.priceMax} onChange={handleFilterChange} />
</div>
<div className="filter-group">
<label htmlFor="size">Size</label>
<select name="size" id="size" className="form-control" value={filters.size} onChange={handleFilterChange}>
  <option value="">All</option>
  <option value="xs">Extra Small</option>
  <option value="s">Small</option>
  <option value="m">Medium</option>
  <option value="l">Large</option>
  <option value="xl">Extra Large</option>
</select>
</div>
</div>
</div>
<div className="col-lg-9">
<div className="row">
{loading ? (
<div className="text-center">Loading...</div>
) : error ? (
<div className="alert alert-danger" role="alert">
  {error}
  <button onClick={fetchFootwears} className="btn btn-link">Retry</button>
</div>
) : (
filteredFootwears.map((footwear) => (
  <div className={`col-md-4 col-sm-9 mb-4 ${footwear.enabled ? '' : 'disabled'}`} key={footwear.id}>
    <div className="card h-100">
      <div style={{ height: '250px', overflow: 'hidden', position: 'relative' }}>
        <img
          src={`http://127.0.0.1:8000${footwear.image}`}
          className={`card-img-top ${footwear.enabled ? '' : 'disabled-image'}`}
          alt={footwear.model}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
        {!footwear.enabled && (
          <div className="overlay disabled-overlay">
            <div className="text-center disabled-overlay-text">
              This item is currently disabled.
            </div>
          </div>
        )}
      </div>
      <div className="card-body">
        <h5 className="card-title">{footwear.model}</h5>
        <p className="card-text">
          <strong>Brand:</strong> {footwear.brand}
          <br />
          <strong>Category:</strong> {footwear.category}
          <br />
          <strong>Size:</strong> {footwear.size}
          <br />
          <strong className="card-price">Price:</strong> ₹{footwear.price}
        </p>
        <div className="quantity-controls">
          <button
            className="btn btn-sm btn-primary"
            onClick={() => decrement(footwear.id)}
            disabled={counts[footwear.id] <= 0}
          >
            -
          </button>
          <input
            type="text"
            className="quantity form-control"
            value={counts[footwear.id] || 0}
            readOnly
          />
          <button
            className="btn btn-sm btn-primary"
            onClick={() => increment(footwear.id)}
          >
            +
          </button>
        </div>
        <button
          className="btn btn-primary mt-2"
          onClick={() => addToCart(footwear)}
          disabled={addToCartDisabled[footwear.id]}
        >
          Add to Cart
        </button>
        <Link to={`/shoe_details/${footwear.id}`} className="btn btn-link mt-2">
          View Details
        </Link>
      </div>
    </div>
  </div>
))
)}
</div>
</div>
</div>
</div>
</div>
);
};

export default ListFootwear;
