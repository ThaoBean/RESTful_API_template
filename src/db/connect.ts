import mongoose from "mongoose";
import config from "config";
import log from "../logger";

function connect(){
    const dbUri = config.get("dbUri") as string;

    return mongoose
        .connect(dbUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        .then(()=>{
            log.info("Data connected");
        })
        .catch(err =>{
            log.error("DB Error: ", err);
            process.exit(1);
        });
}

export default connect;