import { useParams, Link } from "react-router-dom";

export default function OrderSuccess() {
  const { orderId } = useParams();

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-green-50">

      <h1 className="text-3xl font-bold text-green-600 mb-4">
        🎉 Order Successful!
      </h1>

      <p className="text-lg mb-6">
        Your Order ID: <span className="font-semibold">{orderId}</span>
      </p>

      <Link
        to="/"
        className="bg-black text-white px-6 py-2 rounded-lg"
      >
        Continue Shopping
      </Link>

    </div>
  );
}