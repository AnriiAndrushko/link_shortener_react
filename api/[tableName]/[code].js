import Urls from "../../models/urls.js";
import connectMongo from "../../utils/connectMongo.js";

async function handler(req,res){

    const { code, tableName } = req.params;

    if(req.method==="GET") {
        await connectMongo();
        const data = await Urls(tableName).findOne({code:code});
        if (data) {
            data.clicked++;
            data.save();
            return res.json(data.url);
        }
        return res.status(404).json("Incorrect url");
    }else if(req.method==="DELETE"){
        await connectMongo();
        const result = await Urls(tableName).deleteOne({code:code});
        if (result.deletedCount===1) {
            return res.status(200).json("Deleted successfully");
        }
        return res.sendStatus(404);
    }
    return res.sendStatus(400);
}

export default handler;