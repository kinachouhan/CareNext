import mongoose from "mongoose";

const connectDB = async () => {
    console.log(process.env.MONGO_URI)
  try {
    let connection = await mongoose.connect(process.env.MONGO_URI);
    console.log(connection.connection.host)
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.log("Mongodb error: ", error.message);
    process.exit(1);
  }
};


export default connectDB;