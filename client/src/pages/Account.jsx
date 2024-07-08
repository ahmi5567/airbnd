import { useContext, useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { UserContext } from "../components/UserContext.jsx";
import axios from "axios";
import PlacesPage from "./PlacesPage.jsx";
import AccountNav from "../components/AccountNav.jsx";

export default function ProfilePage() {
  const [redirect, setRedirect] = useState(null);
  const { user, ready, setUser } = useContext(UserContext);
  const location = useLocation();
  const subpage = location.pathname.split("/")[2] || "";

  async function logout() {
    await axios.post("/logout");
    setRedirect("/");
    setUser(null);
  }

  if (!ready) {
    return <div>Loading...</div>;
  }

  if (ready && !user && !redirect) {
    return <Navigate to="/login" />;
  }

  if (redirect) {
    return <Navigate to={redirect} />;
  }

  return (
    <div>
      <AccountNav />
      <div className="mt-8">    
        {subpage === '' && (
          <div className="text-center max-w-lg mx-auto">
            logged in as {user.name} {user.email} <br />
            <button onClick={logout} className="primary max-w-[200px] mt-2">
              Logout
            </button>
          </div>
        )}
        {subpage === "booking" && <div>Booking Content</div>}
        {subpage === "places" && (
          <div>
            <PlacesPage />
          </div>
        )}
      </div>
    </div>
  );
}
