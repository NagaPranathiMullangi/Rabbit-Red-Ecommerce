const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const checkoutRoutes = require("./routes/checkoutRoutes");
const orderRoutes = require("./routes/orderRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const subscriberRoutes = require("./routes/subscriberRoutes");
const adminRoutes = require("./routes/adminRoutes");
const productAdminRoutes = require("./routes/productAdminRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");

const app = express();
app.use(
  cors({
    origin: "*", // or set to your frontend domain
  })
);
app.use(express.json());

// CORS Fix: Allow requests from your frontend domain
app.use((req, res, next) => {
  res.setHeader(
    "Access-Control-Allow-Origin",
    "https://rabbit-red-ecommerce-6k37.vercel.app"
  );
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

dotenv.config();

//const PORT = process.env.PORT || 3000;

connectDB();

app.get("/", (req, res) => {
  res.send("WELCOME TO RABBIT API");
});

//API Routes
app.use("/api/users", userRoutes);

app.use("/api/products", productRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/checkout", checkoutRoutes);

app.use("/api/orders", orderRoutes);

app.use("/api/upload", uploadRoutes);

app.use("/api", subscriberRoutes);

//admin
app.use("/api/admin/users", adminRoutes);

app.use("/api/admin/products", productAdminRoutes);

app.use("/api/admin/orders", adminOrderRoutes);

/*app.listen(PORT, () => {
  console.log(`server is running on http://localhost:${PORT}`);
});*/

module.exports = app;
module.exports.handler = serverless(app);
