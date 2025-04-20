import React, { useEffect, useState } from "react";
import axios from "../services/axios";
import { useCart } from "../context/CartContext";
import "./Menu.css";

function Menu() {
  const [menuItems, setMenuItems] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    axios
      .get("/menu")
      .then((res) => {
        setMenuItems(res.data);
      })
      .catch((err) => {
        console.error("Menu fetch error:", err.message);
      });
  }, []);

  const categorized = menuItems.reduce((acc, item) => {
    const category = item.category || "Uncategorized";
    if (!acc[category]) acc[category] = [];
    acc[category].push(item);
    return acc;
  }, {});

  return (
    <div className="menu-container">
      <h1>Our Menu</h1>
      {Object.entries(categorized).map(([category, items]) => (
        <div key={category}>
          <h2>{category}</h2>
          <div className="menu-list">
            {items.map((item) => (
              <div key={item._id} className="menu-item">
                <h3>{item.name}</h3>
                <p>{item.description}</p>
                <p>
                  <strong>₹{item.price.toFixed(2)}</strong>
                </p>
                <button onClick={() => addToCart(item)}>Add to Cart</button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default Menu;
