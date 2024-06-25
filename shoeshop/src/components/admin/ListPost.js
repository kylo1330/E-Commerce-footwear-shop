import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';
import Navbar from '../Navbar';
import checkAuth from '../auth/checkAuth';
import { Modal, Button } from 'react-bootstrap';
import './ListFootwear.css'; // Assuming you have a separate CSS file for styling

// Modal Component
const DeleteConfirmationModal = ({ show, handleClose, handleConfirm }) => (
  <Modal show={show} onHide={handleClose}>
    <Modal.Header closeButton>
      <Modal.Title>Confirm Delete</Modal.Title>
    </Modal.Header>
    <Modal.Body>Are you sure you want to delete this footwear?</Modal.Body>
    <Modal.Footer>
      <Button variant="secondary" onClick={handleClose}>
        Cancel
      </Button>
      <Button variant="danger" onClick={handleConfirm}>
        Delete
      </Button>
    </Modal.Footer>
  </Modal>
);

// FootwearCard Component
const FootwearCard = ({ footwear, onDelete, onToggle }) => (
  <div className="col-md-4 col-sm-6 mb-4">
    <div className="card h-100">
      <div style={{ height: '300px', overflow: 'hidden', position: 'relative' }}>
        <img
          src={`http://127.0.0.1:8000${footwear.image}`}
          className={`card-img-top ${footwear.enabled ? '' : 'disabled-image'}`}
          alt={footwear.model}
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
        />
        {!footwear.enabled && (
          <div className="disabled-overlay">
            <span>Currently Not Available</span>
          </div>
        )}
      </div>
      <div className="card-body d-flex flex-column">
        <h5 className="card-title">{footwear.brand} - {footwear.model}</h5>
        <p className="card-text">Category: {footwear.category}</p>
        <p className="card-text">Size: {footwear.size}</p>
        <p className="card-text">Price: ₹{footwear.price}</p> {/* Changed from $ to ₹ */}
        <p className="card-text">Stock: {footwear.stock}</p>
        <p className="card-text">Status: {footwear.enabled ? 'Enabled' : 'Disabled'}</p>
        <div className="d-flex justify-content-between mt-auto">
          {footwear.enabled && (
            <>
              <Link to={`/admin/posts/${footwear.id}/edit`} className="btn btn-primary">
                Edit
              </Link>
              <button
                onClick={() => onDelete(footwear.id)}
                className="btn btn-danger"
              >
                Delete
              </button>
            </>
          )}
          <button
            onClick={() => onToggle(footwear.id, !footwear.enabled)}
            className={`btn ${footwear.enabled ? 'btn-warning' : 'btn-success'}`}
          >
            {footwear.enabled ? 'Disable' : 'Enable'}
          </button>
        </div>
      </div>
    </div>
  </div>
);

function ListFootwear() {
  const [footwears, setFootwears] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    if (user) {
      fetchFootwears();
    }
  }, [user]);

  const fetchFootwears = async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://127.0.0.1:8000/shop/list_event', {
        headers: { Authorization: `Token ${user.token}` },
      });
      setFootwears(response.data);
    } catch (error) {
      console.error('Error fetching footwears:', error);
      setError('Failed to fetch footwears. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = (id) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:8000/shop/delete_event/${deleteId}/`, {
        headers: { Authorization: `Token ${user.token}` },
      });
      setFootwears((prevFootwears) => prevFootwears.filter(footwear => footwear.id !== deleteId));
    } catch (error) {
      console.error('Error deleting footwear:', error);
      setError('Failed to delete footwear. Please try again later.');
    } finally {
      setLoading(false);
      setShowModal(false);
      setDeleteId(null);
    }
  };

  const toggleFootwear = async (id, enabled) => {
    setLoading(true);
    try {
      await axios.patch(`http://127.0.0.1:8000/shop/toggle_footwear_status/${id}/`, {}, {
        headers: { Authorization: `Token ${user.token}` },
      });
      setFootwears((prevFootwears) => 
        prevFootwears.map((footwear) => 
          footwear.id === id ? { ...footwear, enabled } : footwear
        )
      );
    } catch (error) {
      console.error('Error toggling footwear status:', error);
      setError('Failed to update footwear status. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#ADD8E6', minHeight: '100vh', padding: '20px 0' }}>
      <Navbar />
      <div className="container">
        <div className="row">
          <div className="col-12">
            <h1 className="text-center my-4">
              <b>Footwear List</b>
            </h1>
          </div>
        </div>
        <div className="row">
          <div className="col-12 mb-4 text-center">
            <Link to="/admin/create" className="btn btn-primary">
              Create Footwear
            </Link>
          </div>
        </div>
        <div className="row">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : error ? (
            <div className="alert alert-danger" role="alert">
              {error}
              <button onClick={fetchFootwears} className="btn btn-link">Retry</button>
            </div>
          ) : (
            footwears.map((footwear) => (
              <FootwearCard 
                key={footwear.id} 
                footwear={footwear} 
                onDelete={handleDelete} 
                onToggle={toggleFootwear} 
              />
            ))
          )}
        </div>
      </div>
      <DeleteConfirmationModal
        show={showModal}
        handleClose={() => setShowModal(false)}
        handleConfirm={confirmDelete}
        />
        </div>
      );
    }
    
    export default checkAuth(ListFootwear);
    