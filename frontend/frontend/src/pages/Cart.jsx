console.log(updateCartItem);
console.log(removeCartItem);
import { useEffect, useState } from "react";
import { getCart } from "../services/cartService";
import { updateCartItem, removeCartItem } from "../services/cartService";
import { useNavigate } from "react-router-dom";

export default function Cart() {
    const navigate = useNavigate();
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    try {
      const res = await getCart();
      console.log("CART RESPONSE:", res.data);
      setCart(res.data.cart.items || []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const handleIncrease = async (
  item
) => {
  await updateCartItem(
    item.product._id,
    item.quantity + 1
  );

  loadCart();
};
const handleDecrease = async (
  item
) => {
  if (item.quantity <= 1) return;

  await updateCartItem(
    item.product._id,
    item.quantity - 1
  );

  loadCart();
};
const handleRemove = async (
  item
) => {
  await removeCartItem(
    item.product._id
  );

  loadCart();
};

  // Calculate order metrics dynamically
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.product.price * item.quantity), 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-8 text-center my-12">
        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your Cart is Empty</h2>
        <p className="text-gray-500 mb-6">Looks like you haven't added anything to your cart yet.</p>
        <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2.5 px-6 rounded-lg transition duration-200">
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8 bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-extrabold text-gray-900 mb-8 tracking-tight">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left: Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {cart.map((item) => (
            <div
              key={item._id}
              className="flex flex-col sm:flex-row bg-white border border-gray-200 rounded-xl p-4 shadow-sm hover:shadow-md transition duration-200"
            >
              {/* Product Image */}
              <div className="w-full sm:w-32 h-32 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden mb-4 sm:mb-0">
                <img
                  src={item.product.image}
                  alt={item.product.name}
                  className="h-full w-full object-cover mix-blend-multiply"
                />
              </div>

              {/* Product Details */}
              <div className="sm:ml-6 flex flex-col justify-between flex-1">
                <div>
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-bold text-gray-800 hover:text-indigo-600 transition cursor-pointer">
                      {item.product.name}
                    </h2>
                    <p className="text-lg font-semibold text-gray-900 ml-4">
                      ₹{(item.product.price * item.quantity).toLocaleString("en-IN")}
                    </p>
                  </div>
                  <p className="text-sm text-gray-500 mt-1">Unit Price: ₹{item.product.price}</p>
                </div>

                {/* Footer details inside card */}
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <div className="flex items-center text-sm font-medium text-gray-600">
                    <span className="mr-2">Qty:</span>
                   <div className="flex items-center gap-2">
  <button
    onClick={() => handleDecrease(item)}
    className="bg-gray-200 px-3 py-1 rounded"
  >
    -
  </button>

  <span className="font-bold">
    {item.quantity}
  </span>

  <button
    onClick={() => handleIncrease(item)}
    className="bg-gray-200 px-3 py-1 rounded"
  >
    +
  </button>
</div>
                  </div>
                  
                  {/* Optional: Placeholder for a remove button to make it look standard */}
                  <button 
                  onClick={() =>
        handleRemove(item)
      }
      className="bg-red-500 text-white px-3 py-1 rounded">
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Order Summary Sidebar */}
        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm lg:sticky lg:top-6">
          <h2 className="text-xl font-bold text-gray-900 mb-5 pb-4 border-b border-gray-100">
            Order Summary
          </h2>
          
          <div className="space-y-3 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Items ({totalItems})</span>
              <span>₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery Charges</span>
              <span className="text-green-600 font-medium">FREE</span>
            </div>
            
            <hr className="border-gray-100 my-4" />
            
            <div className="flex justify-between text-lg font-bold text-gray-900">
              <span>Total Amount</span>
              <span>₹{totalPrice.toLocaleString("en-IN")}</span>
            </div>
          </div>

         <button
  onClick={() => navigate("/checkout")}
  className="w-full mt-6 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition duration-200 shadow-sm hover:shadow"
>
  Proceed to Checkout
</button>
        </div>
      </div>
    </div>
  );
}