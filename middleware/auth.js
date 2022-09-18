const jwt = require('jsonwebtoken')

const auth = (req, res, next) => {

    
    console.log(req.cookies);
    const token = req.cookies.token

    // ||
    //     req.body.token ||
    //     req.header("Authorization").replace("Bearer ", "")

    console.log(`The token value :`);
    console.log(token);

    if (!token) {
        return res.send(403).send("token is missing")
    }
    try {
        const decode = jwt.verify(token, process.env.SECRET_KEY);
        console.log(` The decode value is`);
        console.log(decode);


        // Setting custom properties in request
        req.user = decode
    } catch (error) {
        console.log(error);
        return res.status(401).send("Invalid Token")
    }
    return next();

}

module.exports = auth