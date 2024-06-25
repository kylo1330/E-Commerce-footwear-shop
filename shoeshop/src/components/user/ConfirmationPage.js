import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import QRCode from 'qrcode.react';
import html2pdf from 'html2pdf.js';

const ConfirmationPage = () => {
  const location = useLocation();
  const { cartItems, totalAmount, deliveryLocation } = location.state;
  const navigate = useNavigate();
  const qrCodeRef = useRef(null);

  // Concatenate delivery location and total amount into a single string for QR code
  const qrCodeData = `${deliveryLocation}-${totalAmount}`;

  const handleViewHistory = () => {
    navigate(`/OrderHistory`);
  };

  const handleDownloadPDF = () => {
    const element = document.getElementById('confirmationPage');
    const options = {
      filename: 'order_confirmation.pdf',
      html2canvas: {
        scale: 2,
      },
      jsPDF: {
        orientation: 'landscape', // Change orientation to landscape
        unit: 'mm',
        format: 'a4',
      },
    };
    html2pdf().set(options).from(element).save();
  };

  return (
    <div className="container-fluid d-flex justify-content-center align-items-center" style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="card shadow" style={{ maxWidth: '800px', display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
            <div className="card-body" id="confirmationPage" style={{ height: 'auto', flex: 1 }}>
              <h3 className="card-title text-center">Order Confirmation</h3>
              <div className="card-text">
                <p><strong>Delivery Location:</strong> {deliveryLocation}</p>
                <p><strong>Total Amount Paid:</strong> ₹{totalAmount}</p>
                <h4>Order Details:</h4>
                <ul>
                  {cartItems.map(item => (
                    <li key={item.id}>
                      <strong>{item.brand} - {item.model}</strong><br />
                      Quantity: {item.quantity}<br />
                      Subtotal: ₹{item.sumTotal}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Render QR code in a rectangular box */}
            <div className="text-center" style={{ flex: 1 }}>
              <div className="qr-code" ref={qrCodeRef} style={{ border: '2px solid #333', padding: '10px', borderRadius: '5px', backgroundColor: '#fff', maxWidth: '400px', height: 'auto' }}>
                <QRCode value={qrCodeData} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="text-center mt-3">
        <button className="btn btn-primary" style={{ marginTop: '20px', borderRadius: '5px', padding: '10px 20px', fontSize: '16px' }} onClick={handleViewHistory}>
          View My Order History
        </button>
        <button className="btn btn-success ml-3" style={{ marginTop: '20px', borderRadius: '5px', padding: '10px 20px', fontSize: '16px' }} onClick={handleDownloadPDF}>
          Download PDF
        </button>
      </div>
    </div>
  );
}

export default ConfirmationPage;
