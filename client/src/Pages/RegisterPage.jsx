import React, { useEffect, useState } from "react";
import style from "../Styles/LoginPage.module.css";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [name, setName] = useState("");
  const [email, setEmailVal] = useState("");
  const [password, setPassVal] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    if (localStorage.getItem("user")) {
      navigate("/");
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await fetch("http://localhost:7000/auth/createuser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, password }),
    });
    const response = await result.json();
    if (response.success) {
      localStorage.setItem("user", response.authToken);
      localStorage.setItem("id", response._id);
    }
    setEmailVal("");
    setName("");
    setPassVal("");
    navigate("/setavatar");
  };
  return (
    <div onSubmit={handleSubmit} className={style.loginContainer}>
      <div className={style.righttop}>🦉</div>
      <div className={style.rightbottom}>🦉</div>
      <div className={style.lefttop}>🦉</div>
      <div className={style.leftbottom}>🦉</div>
      <form className={style.loginOuterBox}>
        <h1>🦉OWLTALK🦉</h1>
        <div className={style.inputContainer}>
          <input
            onChange={(e) => {
              setName(e.target.value);
            }}
            type="text"
            id="name"
            autoFocus
          />
          <label
            className={name.length > 0 ? style.labeltop : style.labelmid}
            htmlFor="name"
          >
            Name🦉
          </label>
        </div>
        <div className={style.inputContainer}>
          <input
            onChange={(e) => {
              setEmailVal(e.target.value);
            }}
            type="email"
            id="email"
          />
          <label
            className={email.length > 0 ? style.labeltop : style.labelmid}
            htmlFor="email"
          >
            Email
          </label>
        </div>
        <div className={style.inputContainer}>
          <input
            onChange={(e) => {
              setPassVal(e.target.value);
            }}
            type="text"
            id="password"
          />
          <label
            className={password.length > 0 ? style.labeltop : style.labelmid}
            htmlFor="password"
          >
            Password
          </label>
        </div>
        <button type="submit" className={style.submitBtn}>
          🎈Register🎈
        </button>
        <p>
          Already have an account?{" "}
          <Link className={style.anchortag} to="/login">
            Login here...
          </Link>
        </p>
      </form>
    </div>
  );
};

export default LoginPage;
