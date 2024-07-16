import React, { useContext, useEffect, useState } from "react";
import style from "../Styles/Asidebar.module.css";
import Chats from "./Chats";
import { useNavigate } from "react-router-dom";
import { MyContext } from "../Context/MyContaxt";
import { socket } from "../Utils/socket";

const Asidebar = () => {
  const navigate = useNavigate();
  const {userId, setuserId,setActiveUsers , name, setName} = useContext(MyContext)
  const [avatar, setavatar] = useState("")
  const token = localStorage.getItem("user")
  const userAvatar = async () => {
    const result = await fetch("http://localhost:7000/set/selfavatar",{
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            "token" : token
        }
    });
    let response = await result.json();
    if (response.success) {
      setavatar(response.avatar)
      setName(response.name)
      setuserId(response.id)
      navigate("/");
    } else {
      console.error("Error saving avatar:", response.error);
    }
  };

  useEffect(() => {
    userAvatar();
  }, [])
  
  useEffect(()=>{
    socket.emit("new-user-add", userId);
    socket.on("get-users", (activeUsers) => {
      setActiveUsers(activeUsers)
  });
  },[userId])

  return (
    <div className={style.asideContainer}>
      <div className={style.logo}>
        <h1>🦉OWLTALK</h1>
      </div>

      <div className={style.chatSection}>
        <Chats />
      </div>
      <div className={style.userInfoContainer}>
        <div className={style.userimg}>
          <img src={avatar} alt="user" />
        </div>
        <div className={style.userDetails}>
          <h1>{name}</h1>
        </div>
        <div onClick={() => navigate("/setavatar")} className={style.settings}>
          &#x2699;
        </div>
      </div>
    </div>
  );
};

export default Asidebar;
