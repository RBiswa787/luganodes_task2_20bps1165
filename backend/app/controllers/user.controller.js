const db = require("../models");
const User = db.user;


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
    if(!req.body.username){
        res.statusCode = 400;
        return res.send({message: "Username cannot be empty"});
    }
    if(!req.body.password){
        res.statusCode = 400;
        return res.send({message: "Password cannot be empty!"});
    }

    const payload = new User({
        username : req.body.username,
        password : req.body.password,
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

