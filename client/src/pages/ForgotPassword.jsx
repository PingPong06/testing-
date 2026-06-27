// import { useState } from "react";
// import { forgotPassword } from "../services/api";
// import toast from "react-hot-toast";

// function ForgotPassword() {
//   const [email, setEmail] = useState("");

// const handleSubmit = async (e) => {
//   e.preventDefault();

//   try {
//     const response =
//       await forgotPassword(email);

//     toast.success(response.data.message);

//   } catch (error) {
//     toast.error(
//     error.response?.data?.message ||
//     "Password reset failed"
//   );

//   }
// };

//   return (
//     <div className="max-w-md mx-auto mt-10 bg-white p-6 rounded-xl shadow">
//       <h2 className="text-2xl font-bold mb-4">
//         Forgot Password
//       </h2>

//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           placeholder="Enter your email"
//           value={email}
//           onChange={(e) =>
//             setEmail(e.target.value)
//           }
//           className="w-full border p-3 rounded mb-4"
//         />

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white p-3 rounded cursor-pointer"
//         >
//           Send Reset Link
//         </button>
//       </form>
//     </div>
//   );
// }

// export default ForgotPassword;