// import mongoose from "mongoose";

// const configOptions = {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// };

// const connectToDB = async () => {
//   const connectionUrl = process.env.MONGODB_URI

//   mongoose
//     .connect(connectionUrl, configOptions)
//     .then(() => console.log("Ecommerce database connected successfully!"))
//     .catch((err) =>
//       console.log(`Getting Error from DB connection ${err.message}`)
//     );
// };

// export default connectToDB;


import mongoose from "mongoose";

let isConnected = false;

const connectToDB = async () => {
  if (isConnected) {
    return;
  }

  try {
    const db = await mongoose.connect(process.env.MONGODB_URI);
    isConnected = db.connections[0].readyState === 1;
    console.log("Ecommerce database connected successfully!");
  } catch (error) {
    console.error("DB connection error:", error.message);
  }
};

export default connectToDB;
