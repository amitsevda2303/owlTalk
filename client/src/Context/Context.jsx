import { useState } from "react";

import { MyContext } from "./MyContaxt";

export default function Context({ children }) {
  const [username, setusername] = useState("");
  const [userId, setuserId] = useState("");
  const [activeUsers, setActiveUsers] = useState([]);
  const [name, setName] = useState("");
  const contextValue = {
    username,
    setusername,
    userId,
    setuserId,
    activeUsers,
    setActiveUsers,
    name,
    setName,
  };

  return (
    <MyContext.Provider value={contextValue}>{children}</MyContext.Provider>
  );
}
