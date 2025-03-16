import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import { useNavigate } from "react-router-dom";

const PayPalButtonComponent = () => {
  const navigate = useNavigate();

  const initialOptions = {
    "client-id": "AQZrdQZWt4YJBNTJ9iSgtdS_YclpZo0MBVSK_yjGY-FIiHJpW8SEttfkws4pA97daTLNIkYQ_QGkuCWA",
    currency: "USD",
    intent: "capture",
  };

  const createOrder = (data, actions) => {
    return actions.order.create({
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: "5",
          },
        },
      ],
    });
  };

  const onApprove = (data, actions) => {
    return actions.order.capture().then(function (details) {
      const name = details.payer.name.given_name;
      console.log(name);
      navigate("/exitosa");
    }).catch((error) => {
      console.error("Error al capturar el pago:", error);
      alert("Hubo un error al procesar tu pago. Por favor, intenta nuevamente.");
    });
  };

  return (
    <PayPalScriptProvider options={initialOptions}>
      <PayPalButtons createOrder={createOrder} onApprove={onApprove} />
    </PayPalScriptProvider>
  );
};

export default function BtnPaylPal() {
  return (
    <div style={{ maxWidth: "300px", margin: "0 auto" }}>
      <PayPalButtonComponent />
    </div>
  );
}
