
export const test = async (req, res, next) => {
    res.send("Hello from test");
  
};

export const signout = async (req, res, next) => {
    try{
        res
            .clearCookie('access_token')
            .status(200)
            .json({message: 'Signout successful'});
    }
    catch(error){
        next(error)
    }
}

