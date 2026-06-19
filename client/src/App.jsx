import { BrowserRouter, Routes, Route } from "react-router-dom";

import Dashboard from "./pages/Dashboard";
import Inventory from "./pages/Inventory";
import AddProduct from "./pages/AddProduct";
import ProductDetails from "./pages/ProductDetails";
import History from "./pages/History";
import TransactionHistory from "./pages/TransactionHistory";
import Navbar from "./components/Navbar";
import Reports from "./pages/Reports";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/inventory" element={<Inventory />} />
        <Route path="/add-product" element={<AddProduct />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/history" element={<History />} />
        <Route path="/transactions" element={<TransactionHistory />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/admin/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
