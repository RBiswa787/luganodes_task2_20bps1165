const axios = require("axios")
const db = require("../models");
const User = db.user;
const configData = require("../config/config.json");


function makeToken(length) {
    let result           = '';
    let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let charactersLength = characters.length;
    for (let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

exports.create = (req,res) => {
    
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [credusername, credpassword] = credentials.split(':');

    const payload = new User({
        username : credusername,
        password : credpassword,
        token: null,
        chains: [0,0,0]
    });

    User.findOne({username: payload.username})
        .then(
            data => {
                if(!data){
                    payload.save().then(
                        () => {
                            res.send({"message": "User added successfully."});
                        }
                    )
                    .catch( err => {
                        res.statusCode = 500;
                        res.send({"message":err.message});
                    }
                    );
                }
                else{
                    res.statusCode = 203;
                    res.send({message: "User already exists with the username " + payload.username});
                }
            }
        );
}

exports.findOne = (req, res) => {
    const base64Credentials = req.headers.authorization.split(' ')[1];
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
    const [credusername, credpassword] = credentials.split(':');
    User.findOne({username: credusername})
        .then(data => {
            if (!data) {
                res.statusCode = 203;
                return res.send({message: "Not found User with username " + credusername, access: null});
            }
            else{
                if(data.password === credpassword){
                    const access_token = makeToken(20);
                    User.findOneAndUpdate({username:credusername},{token:access_token})
                        .catch(
                            err => {
                                res.statusCode = 500;
                                return res.send({message: err.message});
                            }
                        );
                    res.statusCode = 200;
                    return res.send({message: "Found",access:access_token,isDoctor:data.isDoctor});
                }
                else{
                    res.statusCode = 203;
                    return res.send({message: "User found but password incorrect", access:null});
                }
            }
        })
        .catch(err => {
            res.statusCode = 500;
            res.send({ message: err.message});
        });
};

exports.signOut = (req,res) => {
    User.findOneAndUpdate({username:req.body.username},{token:null})
        .then(res.send({message: "Successfully signed out!"}))
        .catch(
            err => {
                res.statusCode = 500;
                return res.send({message: err.message});
            }
        );
};

exports.updateChains = (req,res) => {
    
    User.findOne({username: req.body.username, token: req.body.token})
    .then(
        data => {
            if(!data){
                res.statusCode = 500;
                return res.send({"message":"Invalid token"});
            }
            else{
                User.findOneAndUpdate({username:req.body.username,token: req.body.token},{chains: req.body.chains})
                .then(res.send({message: "Successfully updated!"}))
                .catch(
                    err => {
                        res.statusCode = 500;
                        return res.send({message: err.message});
                    }
        );
            }
        }
    );
}

async function process(choice){
    var options_one = {
        method: 'GET',
        url: configData["CARDANO_URL"],
        headers: {Accept: '*/*', 'User-Agent': 'StakeTracker/1.0.0'}
    };

    var options_two = {
        method: 'POST',
        url: configData["POLKA_URL"],
        headers: {
          Accept: '*/*',
          'User-Agent': 'StakeTracker/1.0.0',
          'X-API-Key': configData["API_KEY"],
          'Content-Type': 'application/json'
        },
        data: {stash: configData["POLKA_STASH"]}
      };

     var options_three = {
        method: 'POST',
        url: configData["KUSAMA_URL"],
        headers: {
          Accept: '*/*',
          'User-Agent': 'StakeTracker/1.0.0',
          'X-API-Key': configData["API_KEY"],
          'Content-Type': 'application/json'
        },
        data: {stash: configData["KUSAMA_STASH"]}
      };

      const [firstResponse, secondResponse, thirdResponse] = await Promise.all([
        axios.request(options_one),
        axios.request(options_two),
        axios.request(options_three)
      ]);
      
      var result = [-1,-1,-1];

      if(choice[0] == 1){
        result[0] = parseFloat((parseInt(firstResponse.data.data.stake)/1000000000000).toFixed(2));
      }
      if(choice[1] == 1){
        result[1] = Math.round(parseInt(secondResponse.data.data.info.bonded_nominators)/1000000000000);
      }
      if(choice[2] == 1){
        result[2] = Math.round(parseInt(thirdResponse.data.data.info.bonded_nominators)/10000000000);
      }

      return result;

}


exports.getStakeData = async (req,res) => {

    var choice = [];

    User.findOne({username: req.body.username, token: req.body.token})
    .then(
        async data => {
            if(!data){
                res.statusCode = 500;
                return res.send({"message":"Invalid token"});
            }
            else{
                choice = data.chains;
                let result = await process(choice);
                res.statusCode = 200;
                res.send({"message" :result});
         }
        }
    );

    

    
}