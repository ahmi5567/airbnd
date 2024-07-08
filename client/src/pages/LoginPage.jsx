import axios from "axios";
import { useContext, useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { UserContext } from "../components/UserContext";

export default function LoginPage() {
  const[email , setEmail] = useState('');
  const[password , setPassword] = useState('');
  const [redirect, setRedirect] = useState(false);
  const {setUser} = useContext(UserContext);
  const handleLogin = async (e) =>{
    e.preventDefault();
    try {
      const response = await axios.post('/login',  {
        email,
        password,
      },{
        withCredentials:true,
        
      });
      setUser(response.data);
      console.log(response.data);
      setRedirect(true);
    } catch (error) {
      console.error('Login failed:', error);
      alert('Login failed. Please try again.');
    }
  }

  if(redirect){
    return <Navigate to="/"/>
  }
  return (
    <div className="mt-4 grow flex items-center justify-around">
      <div className="mb-32">
        <h1 className="text-4xl text-center mb-4">Login</h1>
        <form className="max-w-md mx-auto " onSubmit={handleLogin}>
          <input type="email" placeholder="you@gmail.com" value={email} onChange={(e)=>setEmail(e.target.value)}/>
          <input type="password" placeholder="password" value={password} onChange={(e)=>setPassword(e.target.value)}/>
          <button className="primary" type="submit">
            Login
          </button>
          <div className="text-center py-2 text-gray-500">Don&#39;t have an account? <Link className="underline text-black" to="/register">Register now</Link></div>
        </form>
      </div>
    </div>
  );
}
