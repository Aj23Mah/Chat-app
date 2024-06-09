import axios from "axios";
import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  logout,
  setUser,
  setOnlineUser,
  setSocketConnection,
} from "../redux/userSlice";
import SideBar from "../components/SideBar"
import logo from "../assets/logo.png";
import io from "socket.io-client";

const Home = () => {
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  console.log("redux-user", user);

  const fetchUserDetails = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3333/api/user-details",
        {
          withCredentials: true,
        }
      );

      dispatch(setUser(response.data.data));

      if (response.data.data.logout) {
        dispatch(logout());
        navigate("/login");
      }

      console.log("current user Details", response.data.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, []);

  /* sockect connection */

  useEffect(() => {
    const socketConnection = io(
      "http://localhost:3333/",
      {
        auth: {
          token: localStorage.getItem("token"),
        },
        withCredentials: true,
      }
    );

    socketConnection.on("onlineUser", (data) => {
      console.log("onlineUser", data);
      dispatch(setOnlineUser(data));
    });

    dispatch(setSocketConnection(socketConnection));

    return () => {
      socketConnection.disconnect();
    };
  }, [dispatch]);

  // console.log('location', location)
  const basePath = location.pathname == "/";

  return (
    <div className="grid lg:grid-cols-[20%,1fr] h-screen max-h-screen">
      <section className={`bg-white ${!basePath && "hidden"} lg:block`}>
        <SideBar />
      </section>

      {/* message components */}
      <section className={`${basePath && "hidden"}`}>
        <Outlet />
      </section>
      
      <div
        className={`justify-center items-center flex-col gap-2 hidden  ${
          !basePath ? "hidden" : "lg:flex"
        }`}
      >
        <div className="flex items-center">
          <img src={logo} width={120} className="" alt="logo" />
          <p className="font-bold text-4xl text-sky-500">CHAT APP</p>
        </div>
        <p className="text-2xl mt-2 text-slate-500">
          Select user to send message
        </p>
      </div>
    </div>
  );
};

export default Home;
