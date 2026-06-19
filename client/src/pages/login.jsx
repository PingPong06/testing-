import { useState } from "react";
import { login } from "../services/api";

function Login() {

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

 const handleLogin = async (e) => {

  // console.log("BUTTON CLICKED");

  e.preventDefault();

  try {

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

    window.alert(
      "Login Successful"
    );

window.location.href = "/";

  } catch (error) {

    window.alert(
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
          Admin Login
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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;