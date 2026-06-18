import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="bg-slate-800 text-white shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">PVC Inventory</h1>

        <div className="flex gap-6">
          <Link to="/" className="hover:text-blue-300">
            Dashboard
          </Link>

          <Link to="/inventory" className="hover:text-blue-300">
            Inventory
          </Link>

          <Link to="/transactions" className="hover:text-blue-300">
            Transactions
          </Link>

          <Link to="/reports" className="hover:text-blue-300">
            Reports
          </Link>

          <Link to="/history" className="hover:text-blue-300">
            History
          </Link>

          <Link to="/add-product" className="hover:text-blue-300">
            Add Product
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
