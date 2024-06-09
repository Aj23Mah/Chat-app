import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const navigate = useNavigate()
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };


  // const handleUploadPhoto = async(e)=> {
  //   const file = e.target.files[0]

  //   const uploadPhoto = await uploadFile(file)
  //   setUploadPhoto(file)

  //   setData((prev)=>{
  //     return {
  //       ...prev,
  //       profile_pic: uploadPhoto?.url 
  //     }
  //   })
  // }

  // const handleClearUploadPhoto = (e) => {
  //   e.stopPropagation()
  //   e.preventDefault()
  //   setUploadPhoto(null)
  // }

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    try {
      const response = await axios.post(
        "http://localhost:3333/api/register",
        data, // Send data as JSON
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Register successful", response.data);
      toast.success("sign up was successful");
      navigate('/login')
    } catch (error) {
      console.error("Error registering", error);
      toast.error("Something went wrong with the registration");
    }
  };

  return (
    <div className="mt-5 md:mt-20 p-1">
      <div className="bg-white w-full max-w-md rounded overflow-hidden px-4 py-10 mx-auto">
        <h3 className="text-center md:text-2xl text-lg font-bold">
          Welcome to chat app!
        </h3>

        <form className="grid gap-3 mt-2" onSubmit={handleSubmit}>
          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter your name"
              className="bg-slate-100 px-2 py-1 focus:outline-sky-500"
              value={data.name}
              onChange={handleOnChange}
              required
            />
          </div>
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
          <button className="bg-sky-500 px-4 py-1 hover:bg-sky-600 text-white rounded m-2 font-bold leading-relaxed tracking-wide">
            Register
          </button>
        </form>
        <p className="my-3 text-center">
          Already have an account?
          <Link to={"/login"} className="hover:text-sky-600 font-semibold">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
