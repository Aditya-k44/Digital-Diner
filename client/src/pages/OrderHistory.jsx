import React, { useState } from "react";
import axios from "../services/axios";
import "./OrderHistory.css";

function OrderHistory() {
  const [phone, setPhone] = useState("");
  const [orders, setOrders] = useState([]);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const res = await axios.get(`/orders/${phone}`);
      setOrders(res.data);
      setError("");
    } catch (err) {
      setOrders([]);
      setError("No orders found.");
    }
  };

  const groupedOrders = orders.reduce((acc, order) => {
    if (!acc[order.order_id]) acc[order.order_id] = [];
    acc[order.order_id].push(order);
    return acc;
  }, {});

  return (
    <div className="history-container">
      <h2>Order History</h2>
      <input
        placeholder="Enter phone number"
        value={phone}
        onChange={(e) => setPhone(e.target.value)}
        className="input-field"
      />
      <button onClick={fetchOrders}>View Orders</button>

      {error && <p className="error">{error}</p>}

      {Object.entries(groupedOrders).map(([orderId, items]) => (
        <div key={orderId} className="order-block">
          <h4>Order #{orderId}</h4>
          <p className="order-date">
            Date: {new Date(items[0].created_at).toLocaleString()}
          </p>
          <ul>
            {items.map((item, idx) => (
              <li key={idx}>
                {item.item_name} - ₹{item.price} × {item.quantity}
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default OrderHistory;
