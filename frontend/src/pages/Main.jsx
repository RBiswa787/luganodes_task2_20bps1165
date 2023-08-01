import React from 'react'
import { useEffect, useState, useRef } from "react";
import useWindowDimensions from "../Hooks/useWindowDimensions";
import Logo from "../pages/Logo.png"
import { Button, Paper, Typography, TextField, IconButton } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const Main = () => {
  const navigate = useNavigate();
  const { height, width } = useWindowDimensions();

  const handleSignOut = () => {
    var uname = window.localStorage.getItem("username");
    window.localStorage.setItem("username","");
    window.localStorage.setItem("token",null);
    axios.post("http://localhost:8686/api/user/signout",{"username":uname})
    .then(res => {
        alert("Signed Out.");
        navigate('/');
    }
    );
  }
  
  useEffect(() => {
    if(window.localStorage.getItem("username") == ""){
        navigate('/');
    }
  },[]);
  return (
    <div style={{display:"flex",flexDirection: "column",backgroundColor: "#282c34", width: width, height: height,alignItems:"center"}}>
        <Paper style = {{width:width, height: "10%",backgroundColor:"#282c34", justifyContent: "center"}}>
        <img src={Logo} alt="" style={{width: "7em",marginTop:"1.5em",marginLeft:"5%"}}/>
        </Paper>
        <Typography style={{display:"flex",color:"white",fontSize:25,fontWeight: "bold",marginTop: "2%",marginLeft:"2%"}}>
                Welcome <span style={{color: "#282c34"}}>s</span><span style={{color: "#208feb"}}>{window.localStorage.getItem("username")}</span>
        </Typography>
        <IconButton onClick={handleSignOut}>
        <LogoutIcon sx={{ color: "white"}}/>
        </IconButton>
        
    </div>
  )
}

export default Main