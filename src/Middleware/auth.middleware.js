const jwt = require("jsonwebtoken");
const { BlackListModel } = require("../Models/blacklisting.model");
const SpecialKey = process.env.tokenkey;

const auth = async(req, res, next) =>{
    const token = req.headers.authorization;
    try {
        let existingToken = await BlackListModel.find({
            blacklist : {$in : token},
        });
        if(existingToken.length > 0){
            res.status(200).json({msg : "Please Login!!!"});
        }else{
            const decoded = jwt.verify(token, SpecialKey);
            req.body.userID = decoded.userID;
            req.body.username = decoded.username;
            next();
        }
    } catch (error) {
        res.status(400).json({error : error});
    }
}

module.exports={
    auth
}