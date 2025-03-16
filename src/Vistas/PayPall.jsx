import React from 'react';
import BtnPaylPal from './components/BtnPaylPal';
import Header from './components/header';


export default function PayPall() {
  return (
    <div className="paypal-container">
      <Header />
      <div className="paypal-button-container">
        <BtnPaylPal />
      </div>
    </div>
  );
}
