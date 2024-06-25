import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import checkAuth from '../auth/checkAuth';

const loadRazorpayScript = (src) => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = src;
    script.onload = () => {
      resolve(true);
    };
    script.onerror = () => {
      resolve(false);
    };
    document.body.appendChild(script);
  });
};

function CartList() {
  const userToken = useSelector(state => state.auth.user?.token);
  const [cartItems, setCartItems] = useState([]);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [deliveryLocation, setDeliveryLocation] = useState('');
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchCartItems();
  }, []);

  const fetchCartItems = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:8000/shop/list_cart/', {
        headers: { 'Authorization': `Token ${userToken}` }
      });
      setCartItems(response.data);
      calculateTotalAmount(response.data);
    } catch (error) {
      console.error('Error fetching cart items:', error);
      setError('Failed to fetch cart items. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const calculateTotalAmount = (items) => {
    const total = items.reduce((sum, item) => sum + parseFloat(item.sumTotal || 0), 0);
    setTotalAmount(total);
  };

  const deleteCartItem = async (itemId) => {
    try {
      await axios.delete(`http://localhost:8000/shop/delete_cart/${itemId}/`, {
        headers: { 'Authorization': `Token ${userToken}` }
      });
      fetchCartItems();
      alert("Cart item removed successfully");
    } catch (error) {
      console.error('Error deleting cart item:', error);
    }
  };

  const handleDeliveryLocationChange = (e) => {
    setDeliveryLocation(e.target.value);
  };

  const handlePayment = async () => {
    setLoading(true);
    try {
      const res = await loadRazorpayScript('https://checkout.razorpay.com/v1/checkout.js');

      if (!res) {
        setError('Razorpay SDK failed to load. Are you online?');
        return;
      }

      const options = {
        key: 'rzp_test_juCSC8R25SR9Jh',
        amount: totalAmount * 100,
        currency: 'INR',
        name: 'Footwear Shop',
        description: 'Payment for Footwear',
        handler: async function (response) {
          alert(`Payment Successful. Total Amount: ₹${totalAmount}`);
          navigate('/confirmation', { state: { cartItems, totalAmount, deliveryLocation } });
          setShowModal(false);
        },
        prefill: {
          name: 'John Doe', // Default name
          email: 'john.doe@example.com', // Default email
          contact: '1234567890', // Default contact
        },
        theme: {
          color: '#3399cc',
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error('Error processing payment:', error);
      setError('Payment failed. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStock = async (footwearId, quantity) => {
    try {
      const csrfToken = document.querySelector('[name=csrfmiddlewaretoken]').value;
      await axios.put(`http://localhost:8000/admin/update_stock/${footwearId}/`, { quantity }, {
        headers: {
          'Content-Type': 'application/json',
          'X-CSRFToken': csrfToken,
          Authorization: `Token ${userToken}`,
        },
      });
      console.log('Stock quantity updated successfully');
    } catch (error) {
      console.error('Error updating stock quantity:', error);
    }
  };

  return (
    <div className='container-fluid'>
      <Navbar />
      <div className="row">
        <div className="col-12">
          <div>
            <h2>Cart contents</h2>
          </div>
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
              <button onClick={fetchCartItems} className="btn btn-link">Retry</button>
            </div>
          ) : (
            <>
              <table className="table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Brand</th>
                    <th>Model</th>
                    <th>Category</th>
                    <th>Size</th>
                    <th>Quantity</th>
                    <th>Sum Total</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {cartItems.map(item => (
                    <tr key={item.id}>
                      <td>
                        <img
                          src={item.image ? `http://localhost:8000${item.image.url}` : 'default_image_path_here'}
                          style={{ width: "65px", height: "70px" }}
                          alt={item.model}
                        />
                      </td>
                      <td>{item.brand}</td>
                      <td>{item.model}</td>
                      <td>{item.category}</td>
                      <td>{item.size}</td>
                      <td>{item.quantity}</td>
                      <td>₹{item.sumTotal}</td>
                      <td>
                        <button
                          className='btn btn-danger btn-sm'
                          onClick={() => deleteCartItem(item.id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <hr />
              <div>
                <h4>Total Amount: ₹{totalAmount}</h4>
                {!showModal && (
                  <button className='btn btn-primary' onClick={() => setShowModal(true)}>Proceed to Payment</button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
      {showModal && (
        <div className="modal-bg" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <div className="modal-content" style={{ position: 'relative', backgroundColor: '#fff', padding: '20px', borderRadius: '5px', boxShadow: '0 0 10px rgba(0, 0, 0, 0.3)', width: '400px' }}>
            <span className="close-btn" style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer', color: 'red', fontSize: '20px' }} onClick={() => setShowModal(false)}>&times;</span>
            <h2>Order Details</h2>
            <ul>
              {cartItems.map(item => (
                <li key={item.id}>
                  {item.brand} - {item.model} - {item.quantity} - ₹{item.sumTotal}
                </li>
              ))}
            </ul>
            <div className="form-group">
              <label htmlFor="deliveryLocation"><b>Delivery Location:</b></label>
              <input type="text" id="deliveryLocation" value={deliveryLocation} onChange={handleDeliveryLocationChange} />
            </div>
            <button className="btn btn-primary" onClick={handlePayment}>Pay ₹{totalAmount}</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default checkAuth(CartList);
