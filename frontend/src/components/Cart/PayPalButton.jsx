import React from "react";
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

function PayPalButton({ amount, onSuccess, onError }) {
  const roundedAmount = parseFloat(amount).toFixed(2); // Ensure only 2 decimal places

  return (
    <PayPalScriptProvider
      options={{
        "client-id": import.meta.env.VITE_PAYPAL_CLIENT_ID,
        currency: "USD",
      }}>
      <PayPalButtons
        style={{ layout: "vertical" }}
        createOrder={(data, actions) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  currency_code: "USD",
                  value: roundedAmount,
                },
              },
            ],
          });
        }}
        onApprove={(data, actions) => {
          return actions.order.capture().then((details) => {
            console.log("Payment approved:", details);
            onSuccess(details); // your success callback
          });
        }}
        onError={(err) => {
          console.error("PayPal Checkout onError", err);
          onError(err); // your error callback
        }}
      />
    </PayPalScriptProvider>
  );
}

export default PayPalButton;
