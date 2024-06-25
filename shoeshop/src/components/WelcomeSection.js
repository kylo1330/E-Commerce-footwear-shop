import React from 'react';
import './WelcomeSection.css'; // Import the CSS file
import { useSelector } from 'react-redux'; // Import useSelector from react-redux
import { Link } from 'react-router-dom'; // Import Link from react-router-dom

const WelcomeSection = () => {
  // Get isSuperuser state from the Redux store
  const isSuperuser = useSelector((state) => state.auth.isSuperuser);

  return (
    <>
      {/* Coming soon section */}
      <div className="coming">
        <h2>Coming Soon...</h2>
      </div>

      {/* Welcome section with conditional className based on isSuperuser */}
      <div className={`welcome-section ${isSuperuser ? 'admin-login' : ''}`}>
        <h2>Welcome to our Footwear Website!</h2>
        {/* Conditionally render text based on isSuperuser */}
        <p>Explore the latest Footwears{isSuperuser && ' and manage foot wear inventory'}</p>

        {/* Conditionally render the link to manage foot wear if superuser */}
        {isSuperuser && (
          <Link to="/admin/create" className="custom-btn">
            Foot Wear
          </Link>
        )}
      </div>

      {/* Bottom bar */}
      <div className="bottom-bar">
        <span className="brand">METRO WEARS</span>
      </div>
    </>
  );
}

export default WelcomeSection;
