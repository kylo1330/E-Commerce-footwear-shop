import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
import { useSelector } from 'react-redux';
import checkAuth from '../auth/checkAuth';

function FootwearDetail() {
  const { footwearId } = useParams();
  const [footwear, setFootwear] = useState({
    brand: '',
    model: '',
    category: '',
    size: '',
    price: '',
    stock: '',
    image: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const user = useSelector((store) => store.auth.user);
  const navigate = useNavigate();

  useEffect(() => {
    if (user && user.token) {
      axios
        .get(`http://127.0.0.1:8000/shop/footwear/user/${footwearId}/`, {
          headers: { Authorization: `Token ${user.token}` },
        })
        .then((response) => {
          setFootwear(response.data);
          setLoading(false);
          setError('');
        })
        .catch((error) => {
          console.error('Error fetching footwear details:', error);
          setError('Failed to fetch footwear details. Please try again later.');
          setLoading(false);
        });
    } else {
      navigate('/login');
    }
  }, [footwearId, user, navigate]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-4">
              <div className="card" style={{ minHeight: '200px' }}>
                <div className="card-body">
                  <p>Loading...</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-4">
              <div className="card" style={{ minHeight: '200px' }}>
                <div className="card-body">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ backgroundImage: `url('https://img.freepik.com/premium-photo/shoe-store-interior_950558-13725.jpg')`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat', backgroundPosition: 'center', minHeight: 'vh' }}>
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-md-4">
              <div className="card" style={{ minHeight: '200px', backgroundColor: 'rgba(255, 255, 255, 0.8)' }}>
                <div className="card-header">
                  <h3>{footwear.brand} {footwear.model}</h3>
                </div>
                <div className="card-body">
                  <p>Category: {footwear.category}</p>
                  <p>Size: {footwear.size}</p>
                  <p>Price: {footwear.price}</p>
                  <p>Stock: {footwear.stock}</p>
                  <img src={`http://127.0.0.1:8000${footwear.image}`} alt={`${footwear.brand} ${footwear.model}`} className="img-fluid" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default checkAuth(FootwearDetail);
