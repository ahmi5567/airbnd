import "./App.css";
import { BrowserRouter, Routes, Route } from "./react-router-dom";
import IndexPage from "./pages/IndexPage.jsx";
import LoginPage from "./pages/LoginPage.jsx";
import RegisterPage from "./pages/RegisterPage.jsx";
import Layout from "./Layout.jsx";
import axios from "axios";
import { UserContextProvider } from "./components/UserContext.jsx";
import PlacesFormPage from "./pages/PlacesFormPage.jsx";
import ProfilePage from "./pages/Account.jsx";
import PlacesPage from "./pages/PlacesPage.jsx";
import PlacePage from "./pages/PlacesPage.1.jsx";
import BookingPage from "./pages/BookingsPage.jsx";
import SingleBookingPage from "./pages/SingleBookingPage.jsx";

axios.defaults.baseURL = "http://localhost:4000";
axios.defaults.withCredentials = true;

function App() {
  return (
    <BrowserRouter>
      <UserContextProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<IndexPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/account" element={<ProfilePage />} />
            <Route path="/account/places" element={<PlacesPage />} />
            <Route path="/account/places/new" element={<PlacesFormPage />} />
            <Route path="/account/places/:id" element={<PlacesFormPage />} />
            <Route path="/place/:id" element={<PlacePage />} />
            <Route path="/account/booking" element={<BookingPage />} />
            <Route
              path="/account/booking/:id"
              element={<SingleBookingPage />}
            />
          </Route>
        </Routes>
      </UserContextProvider>
    </BrowserRouter>
  );
}

export default App;
