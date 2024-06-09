import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Avatar from "../components/Avatar";
import {useDispatch} from 'react-redux'
import { setUser } from "../redux/userSlice";

const CheckPasswordPage = () => {
  const [data, setData] = useState({ password: "" });
  const navigate = useNavigate();
  const location = useLocation();

  const dispatch = useDispatch()

  useEffect(() => {
    if (!location.state?.name || !location.state?.userId) {
      navigate("/email");
    }
  }, [location, navigate]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await axios.post(
        "http://localhost:3333/api/password",
        { userId: location.state.userId, password: data.password }, // Ensure userId is included
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("Password verification successful", response.data);
      toast.success(response.data.message);

      if(response.data.success) 
        {
          // dispatch(setUser(response.data.data))
          dispatch(setToken(response?.data?.token))
          // console.log(response);
          localStorage.setItem('token', response?.data?.token);
        }
      navigate("/");
    } catch (error) {
      console.error("Error verifying password", error);
      toast.error(error.response?.data?.message || "Error verifying password");
    }
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden px-4 py-10 mx-auto">
        <div className="w-fit mx-auto mb-4">
          {location.state?.name && <Avatar width={70} height={70} name={location.state.name} />}
        </div>
        <h2 className="font-semibold text-lg mt-1 text-center">{location.state?.name}</h2>
        <h3 className="text-center md:text-2xl text-lg font-bold my-2">Welcome to chat app!</h3>
        <form className="grid gap-3 mt-4" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              className="bg-slate-100 px-2 py-1 focus:outline-blue-700"
              value={data.password}
              onChange={handleOnChange}
              required
            />
          </div>
          <button className="bg-blue-600 px-4 py-1 hover:bg-blue-700 text-white rounded m-2 font-bold leading-relaxed tracking-wide">
            Login
          </button>
        </form>
        <p className="my-3 text-center">
          <Link to="/forget-password" className="hover:text-blue-500 font-semibold">
            Forget password?
          </Link>
        </p>
      </div>
    </div>
  );
};

export default CheckPasswordPage;
