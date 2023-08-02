import React from 'react'
import { useEffect, useState, useRef } from "react";
import useWindowDimensions from "../Hooks/useWindowDimensions";
import Logo from "../pages/Logo.png"
import CardanoImg from "../assets/cardano.png"
import PolkaImg from "../assets/polka.png"
import KusamaImg from "../assets/kusama.png"
import { Button, Paper, Typography, TextField, IconButton, Stack, Card, CardContent, CardMedia, CardActionArea } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';

import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const Main = () => {
  const navigate = useNavigate();
  const { height, width } = useWindowDimensions();
  const [cardano,setCardano] = useState(false);
  const [polka, setPolka] = useState(false);
  const [kusama, setKusama] = useState(false);

  const [consolidatedData, setConsolidatedData] = useState([]);
  const [cardanoTotalStake, setCardanoTotalStake] = useState(0);
  const [polkaTotalStake, setPolkaTotalStake] = useState(0);
  const [kusamaTotalStake, setKusamaTotalStake] = useState(0);

  const Chain = ['Cardano Chain','Polkadot Chain','Kusama Chain'];
  const Chain_Native = ['M ADA','DOT','KSM'];
  const Chain_Img = [CardanoImg,PolkaImg,KusamaImg];

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

  const handleCardano = () => {
    setCardano(!cardano);
  }
  const handlePolka = () => {
    setPolka(!polka);
  }
  const handleKusama = () => {
    setKusama(!kusama);
  }

  const handleTrack = () => {
    console.log("pressed");
    var choice = [0,0,0];
    if(cardano)
    choice[0] = 1;
    if(polka)
    choice[1] = 1;
    if(kusama)
    choice[2] = 1;
    axios.post("http://localhost:8686/api/user/updatechains",{"username":window.localStorage.getItem("username"),"chains": choice,"token":window.localStorage.getItem("token")})
    .then(res => {
        alert(res.data.message);
        window.location.reload();
    })
  }

  const handleConsolidated = (result) => {
    setConsolidatedData(result);

  }
  
  useEffect(() => {
    if(window.localStorage.getItem("username") == ""){
        navigate('/');
    }
    axios.post("http://localhost:8686/api/user/getstakedata",{"username":window.localStorage.getItem("username"),"token":window.localStorage.getItem("token")})
    .then(res => {
      if(res.data.message != "Invalid token"){
        handleConsolidated(res.data.message);
      }
    })
  },[]);
  return (
    <div style={{display:"flex",flexDirection: "column",backgroundColor: "#282c34", width: width, height: 1.3*height,alignItems:"center"}}>
        <Paper sx={{ boxShadow: "none" }} style = {{width:width, height: "10%",backgroundColor:"#282c34", justifyContent: "center"}}>
        <img src={Logo} alt="" style={{width: "7em",marginTop:"1.5em",marginLeft:"5%"}}/>
        </Paper>
        <Typography style={{display:"flex",color:"white",fontSize:25,fontWeight: "bold",marginTop: "2%",marginLeft:"2%"}}>
                Welcome <span style={{color: "#282c34"}}>s</span><span style={{color: "#208feb"}}>{window.localStorage.getItem("username")}</span>
        </Typography>
        <IconButton onClick={handleSignOut}>
        <LogoutIcon sx={{ color: "white"}}/>
        </IconButton>
        <FormGroup style={{marginTop: "1.5rem"}}>
            <FormControlLabel checked={cardano} control={<Checkbox/>} label="Cardano" style={{color:"white"}} onChange={handleCardano}/>
            <FormControlLabel checked={polka} control={<Checkbox />} label="PolkaDot" style={{color:"white"}} onChange={handlePolka}/>
            <FormControlLabel checked={kusama} control={<Checkbox />} label="Kusama" style={{color:"white"}} onChange={handleKusama}/>
        </FormGroup>
        <Button variant="contained" style={{color: "white",fontSize: 15,fontWeight:"bold",marginTop: "2%",marginBottom: "1em"}} onClick={handleTrack}>Track</Button>
        <Stack
        direction={{ xs: 'column', sm: 'row' }}
        spacing={{ xs: 1, sm: 2, md: 4 }}
      >
      {
        consolidatedData.map((item,index)=>{
          if(item != -1){
          return (
            <>
            <Card sx={{ maxWidth: 345 }} style={{marginTop: "5%"}}>
        <CardActionArea>
                <CardMedia
                component="img"
                height="140"
                image={Chain_Img[index]}
                />
            <CardContent>
                <Typography gutterBottom variant="h5" component="div">
                    {Chain[index]}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Stake: {item} {Chain_Native[index]}
                </Typography>
            </CardContent>
        </CardActionArea>
      </Card>
            </>
          );
        }
        })
      }
        </Stack>
    </div>
  )
}

export default Main