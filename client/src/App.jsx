import React, { useEffect, useMemo } from "react";
import Home from "./Components/Home";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import LoginPage from "./Pages/LoginPage";
import RegisterPage from "./Pages/RegisterPage";
import AvatarPage from "./Pages/AvatarPage";
import { socket } from "./Utils/socket";

const App = () => {
  useEffect(() => {
    socket.on("connect");
    return () => {
      socket.off("connect");
    };
  }, []);
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/setavatar" element={<AvatarPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
