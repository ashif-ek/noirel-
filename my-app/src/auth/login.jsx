


// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";

// export default function Login() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!email || !password) {
//       alert("Enter email and password");
//       return;
//     }

//     try {
//       const res = await axios.get("http://localhost:5000/users", {
//         params: { email, password }
//       });

//       if (res.data.length > 0) {
//         alert(`Welcome, ${res.data[0].name}`);
//         navigate("/"); 
//       } else {
//         alert("Invalid credentials");
//       }
//     } catch (err) {
//       console.error(err);
//       alert("Server error");
//     }
//   };

//   return (
//     <div>
//       <h2>Login</h2>
//       <form onSubmit={handleSubmit}>
//         <input
//           type="email"
//           value={email}
//           onChange={(e) => setEmail(e.target.value)}
//           placeholder="Email"
//         />
//         <br /><br />
//         <input
//           type="password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           placeholder="Password"
//         />
//         <br /><br />
//         <button type="submit">Login</button>
//       </form>
//     </div>
//   );
// }




// import React, { useState } from 'react'
// import { Navigate, useNavigate } from 'react-router-dom'
// import Api from './api'

// export default function Login() {

//   const [name, setName] =useState("")
//   const [password, setPassword] =useState("")

//   const navigate = useNavigate();

//   const handleSubmit =async(e)=>{
//     e.preventDefault()

  
//   try{
//   // const res = await axios.get("http://localhost:5000/users")
   
//     const res= await Api.get("/users");

//     const user= res.data.find(
//     (check)=> check.name === name && check.password === password)

//   if(user){
//     navigate("/")
//   }
//   else{
//     alert('not found')
//   }
//   }
//   catch(err){
//     console.error('error', err)
//   }
// }
//   return (
//     <div>

//       <form onSubmit={handleSubmit}>
//       <input 
//       type="text" 
//       placeholder='username'
//       value={name}
//       onChange={(e)=>setName(e.target.value)}
//       />
// <br />

//       <input type="password" 
//       placeholder='password'
//       value={password}
//       onChange={(e)=>setPassword( e.target.value)}
//       />
// <button
// type='submit'>submit</button>
//       </form>
//     </div>
//   )
// }






// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import Api from "./api";


// export default function Login() {
//   const [name, setName] = useState("");
//   const [password, setPassword] = useState("");
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     try {
//       const res = await Api.get("/users");
//       const user = res.data.find(
//         (u) => u.name === name && u.password === password
//       );

//       if (user) {
//         navigate("/");
//       } else {
//         alert("User not found");
//       }
//     } catch (err) {
//       console.error("error", err);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-white p-6 rounded shadow-md w-80 space-y-4"
//       >
//         <h1 className="text-xl font-bold text-center">Login</h1>

//         <input
//           type="text"
//           placeholder="Username"
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           className="w-full border rounded p-2"
//         />

//         <input
//           type="password"
//           placeholder="Password"
//           value={password}
//           onChange={(e) => setPassword(e.target.value)}
//           className="w-full border rounded p-2"
//         />

//         <button
//           type="submit"
//           className="w-full bg-blue-500 text-white py-2 rounded"
//         >
//           Submit
//         </button>
//       </form>
//     </div>
//   );
// }







import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Api from "./api";
import { useAuth } from "../context/AuthContext";   

export default function Login() {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();  

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await Api.get("/users");
      const user = res.data.find(
        (u) => u.name === name && u.password === password
      );

      if (user) {
        login(user.id);    // save userId into context + localStorage
        navigate("/");  
      } else {
        alert("User not found");
      }
    } catch (err) {
      console.error("error", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-80 space-y-4"
      >
        <h1 className="text-xl font-bold text-center">Login</h1>

        <input
          type="text"
          placeholder="Username"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border rounded p-2"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded p-2"
        />

        <button
          type="submit"
          className="w-full bg-blue-500 text-white py-2 rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
}
