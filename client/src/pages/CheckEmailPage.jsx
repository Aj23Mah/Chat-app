import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaRegCircleUser } from "react-icons/fa6";

const CheckEmailPage = () => {
  const navigate = useNavigate();
  const [data, setData] = useState({
    email: "",
  });

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
      const response = await axios.post(
        "http://localhost:3333/api/email",
        data, // Send data as JSON
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("email registration successful", response.data);
      toast.success(response.data.message);
      navigate('/password', {
        state: {
          name: response?.data?.data?.name,
          userId: response?.data?.data?.userId
        }
      });
    } catch (error) {
      console.error("Error email registration", error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="mt-5">
      <div className="bg-white w-full max-w-md rounded overflow-hidden px-4 py-10 mx-auto">
        <div className="w-fit mx-auto mb-4"><FaRegCircleUser size={80} /></div>
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
              className="bg-slate-100 px-2 py-1 focus:outline-blue-700"
              value={data.email}
              onChange={handleOnChange}
              required
            />
          </div>

          <button className="bg-blue-600 px-4 py-1 hover:bg-blue-700 text-white rounded m-2 font-bold leading-relaxed tracking-wide">
            Let's Go
          </button>
        </form>
        <p className="my-3 text-center">
          New User?
          <Link to={"/register"} className="hover:text-blue-500 font-semibold">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}

export default CheckEmailPage;
