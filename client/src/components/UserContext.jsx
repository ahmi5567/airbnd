/* eslint-disable react/prop-types */
import axios from "axios";
import { createContext, useEffect, useState } from "react";

export const UserContext = createContext();


export const UserContextProvider = ({children}) =>{
  
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      if(!user){
        try {
          const {data} = await axios.get('/profile', {
            // withCredentials: true
          });
          setUser(data);
          setReady(true);
        } catch (error) {
          setUser(null)
          setReady(true)
          console.error("Error fetching user data:", error);
        }
      }
    }
    fetchUser();
  } , [])
  
  return (
    <UserContext.Provider value={{user, setUser, ready}}>
      {children}
    </UserContext.Provider>
    
  )
}