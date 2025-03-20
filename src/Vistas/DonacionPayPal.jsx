import React from 'react';
import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";

const DonacionPayPal = ({ clientId, amount, description, onSuccess }) => {
  return (
    <PayPalScriptProvider 
      options={{ 
        "client-id": clientId,
        currency: "USD",
        intent: "capture"
      }}
    >
      <PayPalButtons
        style={{ 
          layout: "vertical",
          color: "gold",
          shape: "pill",
          label: "donate"
        }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [{
              amount: {
                value: amount,
                currency_code: "USD"
              },
              description: description
            }]
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then(details => {
            onSuccess(details);
          });
        }}
      />
    </PayPalScriptProvider>
  );
};

export default DonacionPayPal;