import { Outlet, useNavigate, useLocation } from "react-router";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";

const Body = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((store) => store.user);
  const location = useLocation();

  const fetchUser = async () => {
    if (!userData && !location.pathname.startsWith("/reset-password")) {
      try {
        const user = await axios.get(BASE_URL + "/profile/view", {
          withCredentials: true,
        });
        dispatch(addUser(user.data));
      } catch (error) {
        if (error.status === 401) {
          navigate("/login");
        }
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return (
    <>
      <html data-theme="dark" className="flex flex-col min-h-screen">
        <Navbar />
        <Outlet />
        <Footer />
      </html>
    </>
  );
};

export default Body;
