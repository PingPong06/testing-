import { Link, NavLink } from "react-router-dom";
import { useState } from "react";
import logo from "../assets/esscon-logo.png";
import { motion, AnimatePresence } from "framer-motion";

<img
  src={logo}
  alt="logo"
  className="h-20 border border-red-500"
/>

function Navbar() {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");
  const username = localStorage.getItem("username");
  const [menuOpen, setMenuOpen] = useState(false);

  const isLoggedIn = !!token;
  const isAdmin = role === "ADMIN";
  // console.log("Navbar isAdmin =", isAdmin);

  return (
    <nav className="bg-slate-800 text-white shadow-md w-full">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center md:justify-between">
        
      <div className="flex items-center gap-4">
  <button
    className="md:hidden text-2xl cursor-pointer"
    onClick={() => setMenuOpen(!menuOpen)}
  >
    {menuOpen ? "✕" : "☰"}
  </button>

  <div className="flex items-center gap-3">
  <img
    src={logo}
    alt="Esscon Logo"
    className="h-10 w-auto"
  />

  {/* <h1 className="text-2xl font-bold">
    Esscon
  </h1> */}
  </div>
</div>

        <div className="hidden md:flex items-center gap-4">
          <NavLink
  to="/"
  className={({ isActive }) =>
    `
    px-3
    py-2
    rounded-lg
    transition
    duration-150
    ${
      isActive
        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
        : "hover:bg-slate-700 hover:text-blue-300"
    }
    `
  }
>
  Dashboard
</NavLink>

          <NavLink
  to="/inventory"
  className={({ isActive }) =>
    `
    px-3
    py-2
    rounded-lg
    transition
    duration-150
    ${
      isActive
        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
        : "hover:bg-slate-700 hover:text-blue-300"
    }
    `
  }
>
  Inventory
</NavLink>

          <NavLink
  to="/transactions"
  className={({ isActive }) =>
    `
    px-3
    py-2
    rounded-lg
    transition
    duration-150
    ${
      isActive
        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
        : "hover:bg-slate-700 hover:text-blue-300"
    }
    `
  }
>
  Transaction
</NavLink>

          <NavLink
  to="/reports"
  className={({ isActive }) =>
    `
    px-3
    py-2
    rounded-lg
    transition
    duration-150
    ${
      isActive
        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
        : "hover:bg-slate-700 hover:text-blue-300"
    }
    `
  }
>
  Reports
</NavLink>

          <NavLink
  to="/history"
  className={({ isActive }) =>
    `
    px-3
    py-2
    rounded-lg
    transition
    duration-150
    ${
      isActive
        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
        : "hover:bg-slate-700 hover:text-blue-300"
    }
    `
  }
>
  History
</NavLink>

          <NavLink
  to="/add-product"
  className={({ isActive }) =>
    `
    px-3
    py-2
    rounded-lg
    transition
    duration-150
    ${
      isActive
        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
        : "hover:bg-slate-700 hover:text-blue-300"
    }
    `
  }
>
  Add Product
</NavLink>

          {isAdmin && (
            <NavLink
  to="/users"
  className={({ isActive }) =>
    `
    px-3
    py-2
    rounded-lg
    transition
    duration-150
    ${
      isActive
        ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
        : "hover:bg-slate-700 hover:text-blue-300"
    }
    `
  }
>
  Users
</NavLink>
          )}

          {isLoggedIn ? (
            <div className="flex items-center gap-3">
              <span
                className="
bg-slate-700
px-3
py-2
rounded-lg
font-medium
"
              >
                {username}
              </span>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("userId");
                  localStorage.removeItem("username");
                  localStorage.removeItem("role");

                  window.location.reload();
                }}
                className="
bg-red-500
hover:bg-red-600
active:scale-95
transition
duration-150
px-4
py-2
rounded-lg
cursor-pointer
"
              >
                Logout
              </button>
            </div>
          ) : (
            <Link to="/login" className="bg-blue-500 px-3 py-1 rounded">
              Login
            </Link>
          )}
        </div>
      </div>

     <AnimatePresence>
  {menuOpen && (
    <motion.div
      initial={{
        opacity: 0,
        x: -250,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: -250,
      }}
      transition={{
        duration: 0.25,
      }}
      className="
      md:hidden
      bg-slate-800
      border-t
      border-slate-700
      "
    >
      <div className="flex flex-col gap-2 p-2">
          <NavLink
  to="/"
  onClick={() => setMenuOpen(false)}
  className={({ isActive }) =>
    `px-3 py-2 rounded ${
      isActive
        ? "bg-blue-600 text-white"
        : "hover:bg-slate-600"
    }`
  }
>
  Dashboard
</NavLink>

          <NavLink
  to="/inventory"
  onClick={() => setMenuOpen(false)}
  className={({ isActive }) =>
    `px-3 py-2 rounded ${
      isActive
        ? "bg-blue-600 text-white"
        : "hover:bg-slate-600"
    }`
  }
>
  Inventory
</NavLink>

          <NavLink
  to="/transactions"
  onClick={() => setMenuOpen(false)}
  className={({ isActive }) =>
    `px-3 py-2 rounded ${
      isActive
        ? "bg-blue-600 text-white"
        : "hover:bg-slate-600"
    }`
  }
>
  Transactions
</NavLink>

          <NavLink
  to="/reports"
  onClick={() => setMenuOpen(false)}
  className={({ isActive }) =>
    `px-3 py-2 rounded ${
      isActive
        ? "bg-blue-600 text-white"
        : "hover:bg-slate-600"
    }`
  }
>
  Report
</NavLink>

          <NavLink
  to="/history"
  onClick={() => setMenuOpen(false)}
  className={({ isActive }) =>
    `px-3 py-2 rounded ${
      isActive
        ? "bg-blue-600 text-white"
        : "hover:bg-slate-600"
    }`
  }
>
  History
</NavLink>

          <NavLink
  to="/add-product"
  onClick={() => setMenuOpen(false)}
  className={({ isActive }) =>
    `px-3 py-2 rounded ${
      isActive
        ? "bg-blue-600 text-white"
        : "hover:bg-slate-600"
    }`
  }
>
  Add Product
</NavLink>

          {isAdmin && (
            <NavLink
  to="/users"
  onClick={() => setMenuOpen(false)}
  className={({ isActive }) =>
    `px-3 py-2 rounded ${
      isActive
        ? "bg-blue-600 text-white"
        : "hover:bg-slate-600"
    }`
  }
>
  User
</NavLink>
          )}

          {isLoggedIn ? (
            <>
              <div className="px-3 py-2 bg-slate-600 rounded">{username}</div>

              <button
                onClick={() => {
                  localStorage.removeItem("token");
                  localStorage.removeItem("userId");
                  localStorage.removeItem("username");
                  localStorage.removeItem("role");

                  window.location.reload();
                }}
                className="
          bg-red-500
          hover:bg-red-600
          px-3
          py-2
          rounded
          text-left
          cursor-pointer
          "
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              onClick={() => setMenuOpen(false)}
              className="bg-blue-500 px-3 py-2 rounded"
            >
              Login
            </Link>
          )}
          </div>
        </motion.div>
      )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
