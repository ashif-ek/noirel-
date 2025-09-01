// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Api from "./api";

// export default function Register() {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//     const [confirmPassword, setconfirmPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

    
//     // Confirm password check
//     if (password !== confirmPassword) {
//       alert("Passwords do not match");
//       return;
//     }



//     try {
//       // Check if email already exists
//       const res = await Api.get("/users", {
//         params: { email }
//       });

//       if (res.data.length > 0) {
//         alert("Email already registered");
//         return;
//       }

//       // Add new user
//       await Api.post("/users", {
//         name,
//         email,
//         password,
//       });

//       alert("Registration successful");
//       navigate("/");
//     } catch (err) {
//       console.error(err);
//       alert("Server error");
//     }
//   };

//   return (
//     <div>
//       <h2>Register</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="text"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="Name"
//           required
//         />
//         <br /><br />
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//           required
//         />
//         <br /><br />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//           required
//         />
//         <br /><br />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setconfirmPassword(e.target.value)}
//           placeholder="Password"
//           required
//         />
//         <button type="submit">Register</button>
//       </form>
//     </div>
//   );
// }












import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "./api";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Password not match");
      return;
    }

    try {
      // check if email exists
      const res = await Api.get("/users", { params: { email } });
      if (res.data.length > 0) {
        alert("Email already registered");
        return;
      }

      // add new user
      const newUser = await Api.post("/users", { name, email, password });

      // log them in immediately using context
      login(newUser.data.id);

      alert("Registration successful");
      navigate("/");   
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80 space-y-4"
      >
        <h2 className="text-xl font-bold text-center">Register</h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          className="w-full border rounded p-2"
        />

        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="w-full border rounded p-2"
        />

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          required
          className="w-full border rounded p-2"
        />

        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          required
          className="w-full border rounded p-2"
        />

        <button
          type="submit"
          className="w-full bg-green-500 text-white py-2 rounded"
        >
          Register
        </button>
      </form>
    </div>
  );
}
