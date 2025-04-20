import mongoose from "mongoose";

const MenuItemSchema = new mongoose.Schema(
  {
    name: String,
    description: String,
    price: Number,
    category: String,
    image: String,
  },
  { collection: "menuitems" }
);

const Menu =
  mongoose.model.MenuItem || mongoose.model("MenuItem", MenuItemSchema);

export default Menu;
