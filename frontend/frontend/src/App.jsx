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
import UserDashboard from "./pages/UserDashboard";
import Profile from "./pages/Profile";
import ChangePassword from "./pages/ChangePassword";
import AccountLayout from "./components/AccountLayout";


function App() {
  return (
    <BrowserRouter>
      {/* <Navbar /> */}

      <Routes>
        <Route element={<Navbar/>}></Route>
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
<Route element={<AccountLayout />}>

  <Route
    path="/user/dashboard"
    element={<UserDashboard />}
  />

  <Route
    path="user/my-orders"
    element={<MyOrders />}
  />

  <Route
    path="/user/profile"
    element={<Profile />}
  />

  <Route
    path="/user/change-password"
    element={<ChangePassword />}
  />

</Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;