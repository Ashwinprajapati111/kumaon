export default function Payment() {

  const startPayment = () => {

    const options = {
      key: "RAZORPAY_KEY",
      amount: 50000,
      currency: "INR",
      name: "Kumaon Organics",
      description: "Product Purchase",

      handler: function (response) {
        alert("Payment Successful");
        console.log(response);
        localStorage.removeItem("cart");
      },

      prefill: {
        name: "Customer",
        email: "test@test.com",
        contact: "9999999999"
      },

      theme: {
        color: "#6366f1"
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="text-center mt-20">

      <h1 className="text-3xl font-bold mb-6">
        Payment
      </h1>

      <button
        onClick={startPayment}
        className="bg-green-600 text-white px-8 py-4 rounded"
      >
        Pay Now
      </button>

    </div>
  );
}