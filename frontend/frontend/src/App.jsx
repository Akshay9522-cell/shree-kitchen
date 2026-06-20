import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Navbar from "./components/Navbar";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import ProductDetails from "./pages/ProductDetails";
import OrderSuccess from "./pages/OrderSuccess";
import MyOrders from "./pages/MyOrders";
import AdminOrders from "./pages/AdminOrders";
import AdminProducts from "./pages/AdminProducts";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import AdminDashboard from "./pages/AdminDashboard";


function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Routes>
        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/product/:id"
          element={<ProductDetails />}
        />
        <Route
        path="/login"
        element={<Login />}
        />

<Route
  path="/register"
  element={<Register />}
/>

<Route
  path="/cart"
  element={<Cart/>}
/>
<Route
  path="/checkout"
  element={<Checkout />}
/>
<Route
  path="/order-success"
  element={<OrderSuccess />}
/>
<Route
  path="/my-orders"
  element={<MyOrders />}
/>

<Route
  path="/order-success"
  element={<OrderSuccess />}
/>
<Route
  path="/adminorders"
  element={<AdminOrders />}
/>
<Route
  path="/admin/products"
  element={
    <AdminProducts />
  }
/>
<Route
  path="/admin/add-product"
  element={<AddProduct />}
/>
<Route
  path="/admin/edit-product/:id"
  element={<EditProduct />}
/>
 <Route
  path="/admin/dashboard"
  element={<AdminDashboard />}
/>

 
      </Routes>
    </BrowserRouter>
  );
}

export default App;