import React, { useState, useEffect } from "react";
import style from "../Styles/AvatarPage.module.css";
import { useNavigate } from "react-router-dom";

const AvatarPage = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem("user");

  useEffect(() => {
    if (!token) {
      navigate("/");
    } else {
      setAvatar(generateRandomAvatar());
      setLoading(false);
    }
  }, [navigate, token]);

  const generateRandomAvatar = () => {
    const randomAvatarId = Math.floor(Math.random() * 10000000);
    return `https://api.multiavatar.com/${randomAvatarId}.png`;
  };

  const [avatar, setAvatar] = useState(() => generateRandomAvatar());

  const changeAvatar = () => {
    setLoading(true);
    setAvatar(generateRandomAvatar());
    setTimeout(() => setLoading(false), 2000);
  };

  const saveAvatar = async () => {
    const result = await fetch("http://localhost:7000/set/avatar",{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({token,avatar})
    });
    let response = await result.json();
    if (response.success) {
      navigate("/");
    } else {
      console.error("Error saving avatar:", response.error);
    }
  };

  return (
    <div className={style.AvatarPageContainer}>
      <div className={style.innerContainer}>
        <div className={style.imageContainer}>
          {loading ? (
            <img src="https://cdn.dribbble.com/users/189524/screenshots/2822794/silhouette-solo-loader-dribbble_v2.gif" alt="loading" />
          ) : (
            <img src={avatar} alt="avatar" />
          )}
          <div onClick={changeAvatar} className={style.changer}>
            &#8634;
          </div>
        </div>
        <div className={style.buttonDiv}>
          <button className={style.submitBtn} onClick={saveAvatar}>Submit</button>
        </div>
      </div>
    </div>
  );
};

export default AvatarPage;
