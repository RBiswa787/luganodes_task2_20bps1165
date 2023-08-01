import React from 'react'
import { useEffect, useState, useRef } from "react";
import useWindowDimensions from "../Hooks/useWindowDimensions";
import Logo from "../pages/Logo.png"
import { Button, Paper, Typography, TextField } from '@mui/material';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const Landing = () => {
const navigate = useNavigate();
  const { height, width } = useWindowDimensions();
  const [loginView, setLoginView] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLoginView = () => {
    setLoginView(true);
  }
  const handleLoginViewSignUp = () => {
    setLoginView(false);
  }
  const handleUsername = (e) => {
    setUsername(e.target.value);
  }
  const handlePassword = (e) => {
    setPassword(e.target.value);
  }
  
  const handleSignUp = () => {
    axios({
        method: "GET",
        url: "http://localhost:8686/api/user/signup",
        auth: {
            username: username,
            password: password
        }
    })
    .then(res => {
        alert(res.data.message);
    })
  }

  const handleSignIn = () => {
    axios({
        method: "GET",
        url: "http://localhost:8686/api/user/signin",
        auth: {
            username: username,
            password: password
        }
    })
    .then(
        res => {
            if(res.data.message == "Found"){
                alert("Authentication Successful.");
                window.localStorage.setItem("username",username);
                window.localStorage.setItem("token",res.data.access);
                navigate('/protected');
            }
            else{
                alert("Authentication Not Successful.");
            }
        }
    );
  }

  return (

    <div style={{display:"flex",flexDirection: "column",backgroundColor: "#282c34", width: width, height: height,alignItems:"center"}}>
        {
            !loginView  && 
            <>
        <Paper style = {{width:width, height: "10%",backgroundColor:"#282c34", justifyContent: "center"}}>
        <img src={Logo} alt="" style={{width: "7em",marginTop:"1.5em",marginLeft:"5%"}}/>
        </Paper>
        <Paper style={{display:"flex",flexDirection:"column",backgroundColor: "#282c34", width: 0.9*width, height: 0.8*height,marginTop:"1.5%"}}>
            <Typography style={{display:"flex",color:"#8d97a7",fontSize:15,fontWeight: "bold",marginTop: "5%",marginLeft:"2%"}}>
                START FOR FREE
            </Typography>
            <Typography style={{display:"flex",color:"white",fontSize:25,fontWeight: "bold",marginTop: "1%",marginLeft:"2%"}}>
                Create new account <span style={{color: "#208feb"}}>.</span>
            </Typography>
            <Paper style={{display:"flex",backgroundColor: "#282c34", width: "100%",height:"5%",marginLeft:"2%",marginTop:"1%",alignItems:"center"}}>
                <Typography style={{display:"flex",color:"#8d97a7",fontSize:12,fontWeight: "bold"}}>
                    Already a Member?   
                </Typography>
                <Button variant="text" style={{color: "#208feb",fontSize:12,fontWeight:"bold",border:"none",marginLeft:"0.5%"}}
                onClick = {handleLoginView}>
                    Sign In
                </Button>
            </Paper>
            <Paper style={{display:"flex",backgroundColor: "#282c34", width: "100%",height:"2.5%",marginLeft:"2%",marginTop:"2em",alignItems:"center"}}>
                <TextField sx={{ input: { color: '#282c34', backgroundColor:"white"} }} size="small" id="standard-basic" label="Username" variant="filled" style={{width:"9em"}} 
                value={username} onChange={(e) => handleUsername(e)}/>
                <TextField sx={{ input: { color: '#282c34', backgroundColor:"white"} }} type="password" size="small" id="outlined-basic" label="Password" variant="filled" style={{width:"9em",marginLeft:"1em"}} 
                value={password} onChange={(e) => handlePassword(e)}/>
            </Paper>
            <Paper style={{display:"flex",backgroundColor: "#282c34", width: "100%",height:"4em",marginLeft:"2%",marginTop:"2em",alignItems:"center"}}>
                <Button style={{width: "15em",fontSize:15,color:"white",backgroundColor:"#208feb"}} onClick={handleSignUp}>Create Account</Button>
            </Paper>
        </Paper>
        </>
    }
    {
            loginView  && 
            <>
        <Paper style = {{width:width, height: "10%",backgroundColor:"#282c34", justifyContent: "center"}}>
        <img src={Logo} alt="" style={{width: "7em",marginTop:"1.5em",marginLeft:"5%"}}/>
        </Paper>
        <Paper style={{display:"flex",flexDirection:"column",backgroundColor: "#282c34", width: 0.9*width, height: 0.8*height,marginTop:"1.5%"}}>
            <Typography style={{display:"flex",color:"#8d97a7",fontSize:15,fontWeight: "bold",marginTop: "5%",marginLeft:"2%"}}>
                SIGN IN
            </Typography>
            <Typography style={{display:"flex",color:"white",fontSize:25,fontWeight: "bold",marginTop: "1%",marginLeft:"2%"}}>
                Welcome back <span style={{color: "#208feb"}}>!</span>
            </Typography>
            <Paper style={{display:"flex",backgroundColor: "#282c34", width: "100%",height:"5%",marginLeft:"2%",marginTop:"1%",alignItems:"center"}}>
                <Typography style={{display:"flex",color:"#8d97a7",fontSize:12,fontWeight: "bold"}}>
                    Not Registered?   
                </Typography>
                <Button variant="text" style={{color: "#208feb",fontSize:12,fontWeight:"bold",border:"none",marginLeft:"0.5%"}}
                onClick = {handleLoginViewSignUp}>
                    Sign Up
                </Button>
            </Paper>
            <Paper style={{display:"flex",backgroundColor: "#282c34", width: "100%",height:"2.5%",marginLeft:"2%",marginTop:"2em",alignItems:"center"}}>
                <TextField sx={{ input: { color: '#282c34', backgroundColor:"white"} }} size="small" id="standard-basic" label="Username" variant="filled" style={{width:"9em"}} 
                value={username} onChange={(e) => handleUsername(e)}/>
                <TextField sx={{ input: { color: '#282c34', backgroundColor:"white"} }} type="password" size="small" id="outlined-basic" label="Password" variant="filled" style={{width:"9em",marginLeft:"1em"}} 
                value={password} onChange={(e) => handlePassword(e)}/>
            </Paper>
            <Paper style={{display:"flex",backgroundColor: "#282c34", width: "100%",height:"4em",marginLeft:"2%",marginTop:"2em",alignItems:"center"}}>
                <Button style={{width: "15em",fontSize:15,color:"white",backgroundColor:"#208feb"}} onClick={handleSignIn}>Sign In</Button>
            </Paper>
        </Paper>
        </>
    }
    </div>
  )
}

export default Landing