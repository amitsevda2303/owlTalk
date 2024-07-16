import React, { useContext, useState, useEffect } from 'react';
import style from "../Styles/Asidebar.module.css";
import { MyContext } from '../Context/MyContaxt';

const Chats = () => {
  const {activeUsers} = useContext(MyContext)
  const [selectedChat, setSelectedChat] = useState(undefined);
  const [users, setUsers] = useState([]);
  const { setusername } = useContext(MyContext);
  const token = localStorage.getItem("user");

  const handleFunc = (index, data) => {
    setSelectedChat(index);
    setusername(data);
  };

  const allUsers = async () => {
    const result = await fetch("http://localhost:7000/get/getuser", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });
    const response = await result.json();
    setUsers(response);
  };

  useEffect(() => {
    allUsers();
  }, []); 

  return (
    <>
     {users.length > 0 ? (
    users.map((data, index) => {
        if (data && typeof data === 'object') {
            const isActive = activeUsers.some(user => user.userId === data._id);
            return (
                <div
                    key={index}
                    className={selectedChat === index ? style.selected : style.user}
                    onClick={() => handleFunc(index, data)}
                >
                    <div className={style.userimg}>
                        {data.avatar && <img src={data.avatar} alt="" />}
                    </div>
                    <div className={style.userDetails}>
                        <h3>{data.name}</h3>
                        <p
                            className={
                                selectedChat === index ? style.selectedp : style.notselectedp
                            }
                        >
                            {data.content && data.content.slice(1, 40) + "..."}
                        </p>
                    </div>
                    {isActive ? <div className={style.online}>🟢</div> : <div className={style.online}>🔴</div>}
                </div>
            );
        } else {
            return null;
        }
    })
) : (
    <div>Loading...</div>
)}
    </>
  );
};

export default Chats;