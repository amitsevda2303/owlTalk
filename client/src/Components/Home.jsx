import React, { useEffect } from 'react'
import style from "../Styles/Home.module.css"
import Asidebar from './Asidebar'
import ChatContainer from './ChatContainer'
import { useNavigate } from 'react-router-dom'
const Home = () => {
  
  const navigate = useNavigate();
  useEffect(() => {
    if (!localStorage.getItem("user")) {
         navigate("/login")   
    }
  }, [])
  
  return (
    <div className={style.container}>
        <div className={style.innercontainer}>
            <Asidebar/>
            <ChatContainer/>
        </div>
    </div>
  )
}

export default Home
