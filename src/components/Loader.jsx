import React from 'react';
import './Loader.css';

export const Loader = ({ fullPage = false, message = 'Loading...' }) => {
  return (
    <div className={`loader-container ${fullPage ? 'full-page' : ''}`}>
      <div className="loader-content">
        <div className="premium-spinner">
          <div className="spinner-inner"></div>
          <div className="spinner-inner"></div>
          <div className="spinner-inner"></div>
        </div>
        {message && <p className="loader-message">{message}</p>}
      </div>
    </div>
  );
};
