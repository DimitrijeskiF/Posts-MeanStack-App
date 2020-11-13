const jtw = require('jsonwebtoken');


module.exports = (req, res, next) =>{
    try {
        const token = req.headers.authorization.split(" ")[1];
        const decodedToken = jtw.verify(token, process.env.JTW_KEY);

        req.userData = {
          email: decodedToken.email,
          userId: decodedToken.userId
        }
        next()
    } catch (error) {
        res.status(401).json({
            message: 'Filed to authenticate!'
        })
    }
}
