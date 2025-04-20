import React, { useState } from "react";
import { useCart } from "../context/CartContext";
import axios from "../services/axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Cart.css";

function Cart() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleOrder = async () => {
    if (!token && (!name || !phone)) {
      alert("Please fill in your name and phone number.");
      return;
    }

    if (cart.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    const orderData = {
      name: token && user?.name ? user.name : name,
      phone: token && user?.phone ? user.phone : phone,
      cart,
    };

    if (!orderData.name || !orderData.phone || cart.length === 0) {
      alert("Missing order information.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("/orders", orderData);
      clearCart();
      navigate("/confirmation");
    } catch (err) {
      console.error("Order failed:", err.response || err);
      if (err.response?.data?.error === "User must register before ordering.") {
        alert("Please register before placing an order.");
      } else {
        alert("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="cart-container">
      <h2>Your Cart</h2>

      {cart.length === 0 ? (
        <p className="empty-cart">No items yet.</p>
      ) : (
        <>
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item._id} className="cart-item">
                <div className="item-info">
                  <p>{item.name}</p>
                  <p>₹{item.price.toFixed(2)}</p>
                </div>

                <div className="quantity-remove">
                  <input
                    type="number"
                    min="1"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(item._id, parseInt(e.target.value))
                    }
                  />
                  <button onClick={() => removeFromCart(item._id)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <div className="total-price">
              <p>
                <strong>Total:</strong> ₹{total.toFixed(2)}
              </p>
            </div>

            {!token && (
              <>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </>
            )}

            <button
              className="place-order-btn"
              onClick={handleOrder}
              disabled={loading}
            >
              {loading ? "Placing Order..." : "Place Order"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default Cart;
