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
      </Routes>
    </BrowserRouter>
  );
}

export default App;