const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const router = require("./routes/index");
const cookieParser = require("cookie-parser");
const http = require("http");
const { Server } = require("socket.io");
const getUserDetailFromToken = require("./helpers/getUserDetailFromToken");
const UserModel = require("./models/UserModel");
const {
  ConversationModel,
  MessageModel,
} = require("./models/ConversationModel");
const getConversation = require('./helpers/getConversation')

require("dotenv").config();
const app = express();



/* socket connection */
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
});

// online user

const onlineUser = new Set();

io.on("connection", async (socket) => {
  console.log("User connected", socket.id);

  const token = socket.handshake.auth.token;
  // current user details
  const user = await getUserDetailFromToken(token);

  // console.log('user', user)

  // create a room
  socket.join(user?._id?.toString());
  onlineUser.add(user?._id?.toString());

  io.emit("onlineUser", Array.from(onlineUser));

  socket.on("message-page", async (userId) => {
    console.log("userId", userId);
    const userDetails = await UserModel.findById(userId).select("-password");

    const payload = {
      _id: userDetails?._id,
      name: userDetails?.name,
      email: userDetails?.email,
      // profile_pic: userDetails?.profile_pic,
      online: onlineUser?.has(userId),
    };

    socket.emit("message-user", payload);

    // get previous message
    const getConversationMessage = await ConversationModel.findOne({
      "$or": [
        { sender: user?._id, receiver: userId },
        { sender: userId, receiver: user?._id },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    // console.log("Get Conversation Message", getConversationMessage);

    socket.emit("message", getConversationMessage?.messages || []);
  });

  //new messge
  socket.on("new message", async (data) => {

    try {

    // check conversation is available both user
    let conversation = await ConversationModel.findOne({
      "$or": [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    });

    // console.log('conversation message', conversation);

    // if conversation is not available
    if (!conversation) {
      const createConversation = await ConversationModel({
        sender: data?.sender,
        receiver: data?.receiver,
      });
      conversation = await createConversation.save();
    }

    const message = await MessageModel({
      text: data.text,
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      // seen: false => default
      msgByUserId: data?.msgByUserId,
    });
    const saveMessage = await message.save();

    // console.log('new message', data);
    // console.log('conversation message', conversation);

    const updateConversation = await ConversationModel.updateOne(
      {
        _id: conversation?._id,
      },
      {
        "$push": {
          messages: saveMessage?._id,
        },
      }
    );

    const getConversationMessage = await ConversationModel.findOne({
      "$or": [
        { sender: data?.sender, receiver: data?.receiver },
        { sender: data?.receiver, receiver: data?.sender },
      ],
    })
      .populate("messages")
      .sort({ updatedAt: -1 });

    // console.log("Get Conversation Message", getConversationMessage);

    // message send to both sender and receiver
    io.to(data?.sender).emit("message", getConversationMessage?.messages || []);
    io.to(data?.receiver).emit("message", getConversationMessage?.messages || []);

    //send conversation
    const conversationSender = await getConversation(data?.sender)
    const conversationReceiver = await getConversation(data?.receiver)

    io.to(data?.sender).emit('conversation',conversationSender)
    io.to(data?.receiver).emit('conversation',conversationReceiver)

  } catch (error) {
    console.error("Error in new message event:", error);
  }


  });

  // sidebar
  socket.on('sidebar',async(currentUserId)=>{
    console.log("current user",currentUserId)

    const conversation = await getConversation(currentUserId)

    socket.emit('conversation',conversation)
    
})

socket.on('seen',async(msgByUserId)=>{
    
    let conversation = await ConversationModel.findOne({
        "$or" : [
            { sender : user?._id, receiver : msgByUserId },
            { sender : msgByUserId, receiver :  user?._id}
        ]
    })

    const conversationMessageId = conversation?.messages || []

    const updateMessages  = await MessageModel.updateMany(
        { _id : { "$in" : conversationMessageId }, msgByUserId : msgByUserId },
        { "$set" : { seen : true }}
    )

    //send conversation
    const conversationSender = await getConversation(user?._id?.toString())
    const conversationReceiver = await getConversation(msgByUserId)

    io.to(user?._id?.toString()).emit('conversation',conversationSender)
    io.to(msgByUserId).emit('conversation',conversationReceiver)
})


  // disconnect
  socket.on("disconnect", () => {
    onlineUser.delete(user?._id?.toString());
    console.log("User disconnected", socket.id);
  });
});

app.use(express.json());
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    credentials: true,
  })
);
app.use(cookieParser());

const PORT = process.env.PORT || 3333;
const uri = process.env.DB_URI;

app.get("/", (req, res) => {
  res.send("welcome to our chat app API");
});

// api endpoints
app.use("/api", router);

server.listen(PORT, async () => {
  console.log(`server running on port: ${PORT}`);
  let conn;
  try {
    conn = await mongoose.connect(uri);
    console.log("DB is now connected");
  } catch (e) {
    console.error(e);
  }
});

// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");
// const router = require('./routes/index')
// const cookiesParser = require('cookie-parser')

// const {app, server} = require('./socket/index')

// // const app = express();
// require("dotenv").config();

// app.use(express.json());
// app.use(cors({
//   origin: process.env.FRONTEND_URL,
//   credentials: true,
// }));
// app.use(cookiesParser())

// const PORT = process.env.PORT || 3333;
// const uri = process.env.DB_URI;

// app.get("/", (req, res) => {
//   res.send("welcome to our chat app API");
// });

// // api endpoints
// app.use('/api', router)

// server.listen(PORT, async () => {
//   console.log(`server running on port: ${PORT}`);
//   let conn;
//   try {
//     conn = await mongoose.connect(uri);
//     console.log("DB is now connected");
//   } catch (e) {
//     console.error(e);
//   }
// });