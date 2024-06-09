import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router-dom";
import Avatar from "./Avatar";
import { HiDotsVertical } from "react-icons/hi";
import { FaAngleLeft, FaPlus, FaRegImage, FaVideo } from "react-icons/fa6";
// import uploadFile from './../helpers/uploadFile';
import { IoCloseSharp, IoSend } from "react-icons/io5";
import Loading from "../components/Loading";
import wallpaper from "../assets/wallpaper.png";
import moment from 'moment'

const MessagePage = () => {
  const params = useParams();
  const socketConnection = useSelector(
    (state) => state?.user?.socketConnection
  );

  const user = useSelector((state) => state?.user);

  const [dataUser, setDataUser] = useState({
    name: "",
    email: "",
    // profile_pic: "",
    online: false,
    _id: "",
  });
  // console.log("params", params.userId);

  const [openImageVideoUpload, setOpenImageVideoUpload] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    imageUrl: "",
    videoUrl: "",
  });

  const [loading, setLoading] = useState(false);
  const [allMessage, setAllMesssage] = useState([])
  const currentMessage = useRef(null)

  useEffect(()=>{
    if(currentMessage.current){
      currentMessage.current.scrollIntoView({behavior: 'smooth', block: 'end'})
    }
  },[allMessage])

  const handleUploadImageVideoButton = () => {
    setOpenImageVideoUpload((prev) => !prev);
  };

  // const handleUploadImage = async(e)=> {
  //   const file = e.target.files[0]
  // setLoading(true)
  //   const uploadPhoto = await uploadFile(file)
  // setLoading(false)
  // setOpenImageVideoUpload(false)
  // setMessage((prev)=>{
  //   return {
  //     ...prev,
  //     imageUrl: uploadPhoto?.url
  //   }
  // })
  // }

  // const handleCloseUploadImage =()=>{
  //   setMessage((prev)=>{
  //       return {
  //         ...prev,
  //         imageUrl: ""
  //       }
  //     })
  // }

  // const handleUploadVideo = async(e)=> {
  //   const file = e.target.files[0]
  // setLoading(true)
  //   const uploadPhoto = await uploadFile(file)
  // setLoading(false)
  // setOpenImageVideoUpload(false)
  //   setMessage((prev)=>{
  //     return {
  //       ...prev,
  //       videoUrl: uploadPhoto?.url
  //     }
  //   })
  // }

  // const handleCloseUploadVideo =() => {
  //     setMessage((prev)=>{
  //     return {
  //       ...prev,
  //       videoUrl: ""
  //     }
  //   })
  // }

  useEffect(() => {
    if (socketConnection) {
      socketConnection.emit("message-page", params.userId);

      socketConnection.emit('seen', params.userId)

      socketConnection.on("message-user", (data) => {
        // console.log("data user details", data);
        // setMessage(data);
        setDataUser(data);
      });

      socketConnection.on('message', (data)=>{
        console.log('message data', data);
        setAllMesssage(data)
      })
    }
    return () => {
      if (socketConnection) {
        socketConnection.off("message-user");
      }
    };
  }, [socketConnection, params?.userId, user]);

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setMessage((prev) => {
      return {
        ...prev,
        // [name]: value,
        text: value,
      };
    });
  };

  const handleSendMessage = (e) => {
    e.preventDefault()
    if(message.text || message.imageUrl || message.videoUrl) {
      if(socketConnection) {
        socketConnection.emit('new message', {
          sender: user?._id,
          receiver: params?.userId,
          text: message.text,
          imageUrl: message.imageUrl,
          videoUrl: message.videoUrl,
          msgByUserId: user?._id,
        })
        setMessage({
          text: "",
          imageUrl: "",
          videoUrl: "",
        })
      }
    }
  }

  return (
    <div
      style={{ background: `url(${wallpaper})` }}
      className="bg-no-repeat bg-cover"
    >
      <header className="sticky top-0 h-16 bg-white flex justify-between items-center px-4">
        <div className="flex items-center gap-4">
          <Link to={"/"} className="lg:hidden">
            <FaAngleLeft size={25} />
          </Link>

          <div>
            <Avatar
              width={50}
              height={50}
              // imageUrl={dataUser?.profile_pic}
              name={dataUser?.name}
              userId={dataUser?._id}
            />
          </div>

          <div>
            <h3 className="font-semibold text-lg my-0 text-ellipsis line-clamp-1">
              {dataUser?.name}
            </h3>
            <p className="-my-2 text-base">
              {dataUser.online ? (
                <span className="text-sky-500">online</span>
              ) : (
                <span className="text-slate-400">offline</span>
              )}
            </p>
          </div>
        </div>

        <div>
          <button className="cursor-pointer hover:text-blue-500">
            <HiDotsVertical size={25} />
          </button>
        </div>
      </header>

      {/* show all messages */}
      <section className="h-[calc(100vh-128px)] overflow-x-hidden overflow-y-scroll scrollbar relative bg-slate-200 bg-opacity-50">
        

        
        {/* Show all message here */}

        <div 
          ref={currentMessage}  // currently send gara ko msg display garauni
          className="flex flex-col gap-2 py-2 mx-2">
          {
            allMessage.map((msg,index)=>{
              return(
                <div className={`p-1 py-1 rounded w-fit max-w-m[280px] md:max-w-sm lg:max-w-md ${user._id === msg.msgByUserId ? "ml-auto bg-teal-100" : "bg-white"}`}>
                  <div className="w-full">
                  {
                    msg.imageUrl && (
                      <img src={msg?.imageUrl}
                      className="w-full h-full object-scale-down" 
                      />
                    )
                  }
                  {
                    msg.videoUrl && (
                      <video src={msg?.videoUrl} 
                      className="w-full h-full object-scale-down" 
                      controls
                      />
                    )
                  }
                  </div>
                  <p className="px-2">{msg.text}</p>
                  <p className="text-xs ml-auto w-fit">{moment(msg.createdAt).format('hh:mm')}</p>
                </div>
              )
            })
          }
        </div>

        {/* upoad image display */}

        {/* {message.imageUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              // onClick={handleCloseUploadImage}
            >
              <IoCloseSharp size={30} />
            </div>
            <div className="bg-white p-3">
              <img
                src={message.imageUrl}
                alt="uploadImage"
                className="aspect-square w-full max-w-sm m-2 object-scale-down"
              />
            </div>
          </div>
        )} */}

        {/* upoad video display */}

        {/* {message.videoUrl && (
          <div className="w-full h-full sticky bottom-0 bg-slate-700 bg-opacity-30 flex justify-center items-center rounded overflow-hidden">
            <div
              className="w-fit p-2 absolute top-0 right-0 cursor-pointer hover:text-red-600"
              // onClick={handleCloseUploadVideo}
            >
              <IoCloseSharp size={30} />
            </div>
            <div className="bg-white p-3">
              <video
                src={message.videoUrl}
                className="aspect-square w-full max-w-sm m-2 object-scale-down"
                controls
                muted
                autoPlay
              ></video>
            </div>
          </div>
        )} */}

        {loading && (
          <div className="w-full h-full sticky bottom-0 flex justify-center items-center">
            <Loading />
          </div>
        )}

      </section>

      {/* send messages */}
      <section className="h-16 bg-white flex items-center px-4">
        <div className="relative">
          <button
            onClick={handleUploadImageVideoButton}
            className="flex justify-center items-center w-11 h-11 rounded-full hover:bg-blue-500 hover:text-white"
          >
            <FaPlus size={20} />
          </button>

          {/* video and images */}
          {openImageVideoUpload && (
            <div className="bg-white shadow rounded absolute bottom-14 w-36 px-2 py-3">
              <form>
                <label
                  htmlFor="uploadImage"
                  className="flex items-center gap-3 p-2 px-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-blue-500">
                    <FaRegImage size={18} />
                  </div>
                  <p>Image</p>
                </label>

                <label
                  htmlFor="uploadVideo"
                  className="flex items-center gap-3 p-2 px-3 hover:bg-slate-200 cursor-pointer"
                >
                  <div className="text-purple-500">
                    <FaVideo size={18} />
                  </div>
                  <p>Video</p>
                </label>

                <input
                  type="file"
                  id="uploadImage"
                  // onChange={handleUploadImage}
                  className="hidden"
                />
                <input
                  type="file"
                  id="uploadVideo"
                  // onChange={handleUploadVideo}
                  className="hidden"
                />
              </form>
            </div>
          )}
        </div>

        {/* input box */}
        <form className="h-full w-full flex gap-2" onSubmit={handleSendMessage}>
            <input
              type="text"
              placeholder="Type here message..."
              className="py-1 px-4 outline-none w-full h-full"
              value={message.text}
              onChange={handleOnChange}
            />
            <button className="text-sky-500 hover:text-sky-600">
              <IoSend size={25} />
            </button> 
        </form>

      </section>
    </div>
  );
}
// 7:14:21

export default MessagePage;
