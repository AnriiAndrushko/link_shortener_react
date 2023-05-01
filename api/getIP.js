async function handler(req,res){
    if(req.method === "GET"){
        return res.status(200).json(req.headers['x-forwarded-for'] ||
            req.socket.remoteAddress ||
            null);
    }
    return res.status(404);
}

export default handler;