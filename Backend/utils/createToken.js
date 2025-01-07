import jwt from 'jsonwebtoken'

//create the token 
const generateToken =  (res, userId) => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, {
        expiresIn : "30d",
    });

    res.cookie('jwt', token, {
        httpOnly : true,
        secure : process.env.NODE_ENV != 'development',
        sameSize : 'strict',
        maxAge : 24 * 30 * 60 * 60 * 1000
    });

    return token;
}

export default generateToken;