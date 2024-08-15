import mongoose from "mongoose";

type connectionObject = {
    isConnected?: number;
}

const connection: connectionObject = {};

const dbConnection = async():Promise<void> =>{
    if (connection.isConnected) {
        console.log("Database is already connected");
        return;
    }else{
        try {
            const db = await mongoose.connect(process.env.MONGODB_URI as string|| '', {});
            connection.isConnected = db.connections[0].readyState;

        } catch (error) {
            console.log("Database connection error due to: ", error);
            process.exit(1);
        }
    }
}

export default dbConnection;