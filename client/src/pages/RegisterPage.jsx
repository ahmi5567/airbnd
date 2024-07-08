import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
  const [name , setName] = useState("");
  const [email , setEmail] = useState("");
  const [password , setPassword] = useState("");
  const [redirect, setRedirect] = useState(false);

  const handleRegister = async (e) =>{
    e.preventDefault();
   try {
     await axios.post('/register', {
       name,
       email,
       password,
     });
     setRedirect(true);
   } catch (error) {
     console.error('Registration failed:', error);
     alert('Registration failed. Please try again.');
   }
  }
  if(redirect){
    return <Navigate to="/login"/>
  }
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-32">
        <h1 className="text-4xl text-center mb-4">Register</h1>
        <form className="max-w-md mx-auto " onSubmit={handleRegister}>
          <input type="text" placeholder="Enter your name"
          value={name} onChange={e => setName(e.target.value)}
          />
          <input type="email" placeholder="you@gmail.com"
          value={email} onChange={e => setEmail(e.target.value)}
          />
          <input type="password" placeholder="password"
          value={password} onChange={e => setPassword(e.target.value)}
          />
          <button className="primary" type="submit">
            Register
          </button>
          <div className="text-center py-2 text-gray-500">Already a member? <Link className="underline text-black" to="/login">Login</Link></div>
        </form>
      </div>
    </div>
  );
}
