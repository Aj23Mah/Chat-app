import React, { useEffect, useRef, useState } from "react";
import Avatar from "./Avatar";
import Divider from "./Divider";
// import uploadFile from './../helpers/uploadFile';
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { setUser } from "../redux/userSlice";
import axios from "axios";

const EditUserDetails = ({ onClose, user }) => {
  const [data, setData] = useState({
    name: user?.user || "",
    // profile_pic: user?.profile_pic || "",
  });
  // const uploadPhotoRef = useRef();
  const dispatch = useDispatch();


  // useEffect(() => {
  //   setData((prev) => {
  //     return {
  //       ...prev,
  //       ...user,
  //     };
  //   });
  // }, [user]);

  useEffect(() => {
    setData((prev) => ({
      ...prev,
      name: user?.name || prev.name,
      // profile_pic: user?.profile_pic || prev.profile_pic,
    }));
  }, [user]);

  //   console.log("user edit", user);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setData((prev) => {
      return {
        ...prev,
        [name]: value,
      };
    });
  };

  // const handleOpenUploadPhoto = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();

  //   uploadPhotoRef.current.click();
  // };

  //   const handleUploadPhoto = async(e) => {
  //     const file = e.target.files[0]
  //     const uploadPhoto = await uploadFile(file)
  //     setData((prev)=>{
  //         return{
  //             ...prev,
  //             profile_pic: uploadPhoto?.url
  //         }
  //     })
  //   }   

  

  const handleSubmit = async (e) => {
    e.preventDefault();
    // e.stopPropagation();
    try {
      // const response = await axios({
      //   method: "post",
      //   url: "http://localhost:3333/api/update-user",
      //   data: data,
      //   withCredentials: true,
      // });

      const response = await axios.post(
        "http://localhost:3333/api/update-user",
        data,
        { withCredentials: true }
      );
      
      console.log("response", response);
      toast.success(response?.data?.message);

      if (response.data.success) {
        dispatch(setUser(response?.data?.data));
        onClose(); // Close the modal after successful submission
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="h-screen w-full fixed top-0 left-0 right-0 bg-gray-700 bg-opacity-40 flex justify-center items-center z-10">
      <div className="bg-white p-4 py-6 m-1 rounded w-full max-w-sm">
        <h2 className="font-semibold">Profile Details</h2>
        <p className="text-sm">Edit user details</p>

        <form className="grid gap-3 mt-3" onSubmit={handleSubmit}>

        <div className="my-1 flex justify-center items-center gap-3">
              <Avatar
                width={70}
                height={70}
                // imageUrl={data?.profile_pic}
                name={data?.name}
              />
            </div>


          <div className="flex flex-col gap-1">
            <label htmlFor="name">Name:</label>
            <input
              type="text"
              name="name"
              id="name"
              value={data.name}
              onChange={handleOnChange}
              className="w-full py-1 px-2 focus:outline-blue-700 border"
            />
          </div>

          {/* <div> */}
            {/* <label htmlFor="profile_pic">Photo</label> */}
            {/* <div>Photo: </div> */}
            {/* <div className="my-1 flex items-center gap-3">
              <Avatar
                width={40}
                height={40}
                // imageUrl={data?.profile_pic}
                name={data?.name}
              />

              //  <button
              //   className="font-semibold"
              //   // onClick={handleOpenUploadPhoto}
              // >
              //   Change Photo
              // </button>
              // <input
              //   id="profile_pic"
              //   type="file"
              //   className="hidden"
              //   //   onChange={handleUploadPhoto}
              //   // ref={uploadPhotoRef}
              // /> 

            </div> */}
          {/* </div> */}

          <Divider />

          <div className="flex gap-2 w-fit ml-auto mt-3">
            <button
              type="button"
              onClick={onClose}
              className="border-blue-500 border text-blue-500 px-4 py-1 rounded"
            >
              Cancel
            </button>
            <button
            type="submit"
              onClick={handleSubmit}
              className="border-blue-500 bg-blue-500 border text-white px-4 py-1 rounded"
            >
              save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// export default EditUserDetails;
export default React.memo(EditUserDetails);
