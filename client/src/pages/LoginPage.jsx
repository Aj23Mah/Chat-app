import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setToken, setUser } from "../redux/userSlice";
import logo from "../assets/logo.png"

const LoginPage = () => {
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();
  const dispatch = useDispatch();


  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await axios({
        method: "post",
        url: "http://localhost:3333/api/login",
        data: {
          userId: location?.state?._id,
          email: data.email,
          password: data.password,
        },
        withCredentials: true,
      });

      // console.log("Login successful", response.data);
      // toast.success(response.data.message);

      if (response.data.success) {
        dispatch(setUser(response.data.data));
        dispatch(setToken(response?.data?.token));
        localStorage.setItem("token", response?.data?.token);
        console.log(response?.data?.message);
        toast.success(response.data.message);
        navigate("/");
      } else {
        console.log(response?.data?.message);
        toast.error(response.data.message);
      }

    } catch (error) {
      console.error("Error during login", error);
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="mt-5 md:mt-20 p-1">
      <div className="bg-white w-full max-w-md rounded overflow-hidden px-4 py-10 mx-auto">
        <div className="w-fit mx-auto mb-4">
          <img src={logo} alt="" height={140} width={140} />
        </div>
        <h3 className="text-center md:text-2xl text-lg font-bold">
          Welcome to chat app!
        </h3>

        <form className="grid gap-3 mt-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              className="bg-slate-100 px-2 py-1 focus:outline-sky-500"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="bg-slate-100 px-2 py-1 focus:outline-sky-500"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>
          <button className="bg-sky-500 px-4 py-1 hover:bg-sky-700 text-white rounded m-2 font-bold leading-relaxed tracking-wide">
            Login
          </button>
        </form>
        <p className="my-3 text-center">
          New User?
          <Link to={"/register"} className="hover:text-sky-600 font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
