import React, { useContext, useEffect, useRef, useState } from "react";
import style from "../Styles/ChatContainer.module.css";
import { MyContext } from "../Context/MyContaxt";
import { socket } from "../Utils/socket";

const ChatContainer = () => {
  const { username, name } = useContext(MyContext);
  const [inputval, setinputval] = useState("");
  const [userChats, setuserChats] = useState([]);
  const token = localStorage.getItem("user");
  const id = localStorage.getItem("id");
  const [activeUsers, setActiveUsers] = useState([])
  const [calling, setCalling] = useState(false)
  const scroller = useRef();
  const [imgToBeSend, setImgToBeSend] = useState("")


  // Chatting code
  useEffect(() => {
    const fetchChat = async () => {
      try {
        const response = await fetch("http://localhost:7000/chat/fetchchat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token: token, receiver: username._id }),
        });
        const data = await response.json();
        setuserChats(data);
      } catch (error) {
        console.error("Error fetching chat:", error);
      }
    };

    if (username !== "") {
      fetchChat();
    }
  }, [username, token]);

  const sendMessage = async () => {
    const newMessage = {
      members: { reciever: username._id, sender: id },
      chat: inputval,
    };
    setuserChats([...userChats, newMessage]);
    const chatdata = { sender: id, receiver: username._id, message: inputval };
    socket.emit("send-message", chatdata);
    const data = await fetch("http://localhost:7000/chat/sendmessage", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        reciever: username._id,
        message: inputval,
      }),
    });
    await data.json();
    setinputval("");
  };

  const handleReceiveMessage = (data) => {
    const newchat = {
      members: { reciever: data.receiver, sender: data.sender },
      chat: data.message,
    };
    setuserChats([...userChats, newchat]);
  };

  useEffect(() => {
    socket.on("receive-message", handleReceiveMessage);
    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [userChats]);

  useEffect(() => {
    scroller.current?.scrollIntoView();
  }, [userChats]);

 

    useEffect(() => {
      socket.on("get-users", (activeUsers)=>{
        setActiveUsers(activeUsers);
      })
    }, [])
    

    const handleFileChange = (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImgToBeSend(reader.result); // Set image as base64 encoded URL
        };
        reader.readAsDataURL(file);
      }
    };


  
  return (
    <div className={style.chatContainer}>
      {username != "" ? (
        <>
          <div className={style.chatHeader}>
            <div className={style.userimg}>
              <img src={username.avatar} alt="" />
            </div>
            <div className={style.userDetails}>
              <h2>{username.name}</h2>
            </div>
            {!calling && <div className={style.videocall}>
              <i className="fa-solid fa-video"></i>
            </div>}
            <div className={style.threedot}>
              <span>︙</span>
            </div>
          </div>
          <>
           {!imgToBeSend ?<div className={style.messageCotnainer}>
              {userChats.map((item, index) => {
                return (
                  <div key={index}>
                    {item.members.reciever === username._id ? (
                      <div className={style.right}>
                        <span>{item.chat}</span>
                      </div>
                    ) : (
                      <div className={style.left}>
                        <span>{item.chat}</span>
                      </div>
                    )}
                  </div>
                );
              })}
              <div ref={scroller} />
            </div>: <div className={style.sendImgContainer}>
              <img className={style.sendImg}  src={imgToBeSend} alt="" /></div>}
            <div className={style.inputContainer}>
              <span>😆</span>
              <label htmlFor="photoInput" className={style.photosender}>+</label>
              <input type="file" id="photoInput"style={{display: "none"}} onChange={handleFileChange}/>
              <input
                type="text"
                value={inputval}
                onChange={(e) => {
                  setinputval(e.target.value);
                }}
                placeholder={"say hii to " + `${username.name}`}
              />
              <button
                disabled={inputval === "" || inputval === null}
                onClick={sendMessage}
              >
                <i className="material-icons">send</i>
              </button>
            </div>
          </>
        </>
      ) : (
        <div className={style.gifContainer}>
          <img
            src="https://pic.funnygifsbox.com/uploads/2020/01/funnygifsbox.com-2020-01-13-06-50-51-80.gif"
            alt="image"
          />
          <h1>WELCOME TO OWLTALK</h1>
        </div>
      )}
    </div>
  );
};

export default ChatContainer;
