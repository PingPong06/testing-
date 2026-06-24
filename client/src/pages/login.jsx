import { useState, useEffect } from "react";
import { login } from "../services/api";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";



function Login() {
const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

 
 const handleLogin = async (e) => {

  // console.log("BUTTON CLICKED");

  e.preventDefault();

  try {

    // console.error(error);

    const response = await login({
      username,
      password,
    });

    localStorage.setItem(
      "token",
      response.data.token
    );

    localStorage.setItem(
  "userId",
  response.data.userId
);

localStorage.setItem(
  "username",
  response.data.username
);

localStorage.setItem(
  "role",
  response.data.role
);

  toast.success("Login Successful");

setTimeout(() => {
  navigate("/");
}, 1500);
  } catch (error) {

    toast.error(
  error.response?.data?.message ||
  "Login Failed"
);

    console.error(error);

  }

};

  return (
    <div className="min-h-screen flex justify-center items-center">
      <form
        onSubmit={handleLogin}
        className="bg-white p-8 rounded-xl shadow-md w-96"
      >
        <h1 className="text-2xl font-bold mb-6">
          Login
        </h1>

        <input
          type="text"
          placeholder="Username"
          className="w-full border p-3 rounded-lg mb-4"
          value={username}
          onChange={(e) =>
            setUsername(e.target.value)
          }
        />

        

        <input
          type="password"
          placeholder="Password"
          className="w-full border p-3 rounded-lg mb-4"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
        />

          {/* <button
  type="button"
  onClick={() => toast.success("Hello")}
  className="w-full bg-green-500 text-white p-3 rounded-lg mb-4"
>
  Test Toast
</button> */}

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg cursor-pointer"
        >
          Login
        </button>

        <p className="text-red-500 font-bold">
  <Link
    to="/forgot-password"
    className="text-blue-600 hover:underline"
  >
    Forgot Password?
  </Link>
</p>

      </form>
    </div>
  );
}

export default Login;