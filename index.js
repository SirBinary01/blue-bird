//import from packages
const express = require("express");
const mongoose = require("mongoose");
const adminRouter = require("./routes/admin");
//import from other files
const authRouter = require("./routes/auth");
const productRouter = require("./routes/product");
const userRouter = require("./routes/user");
const DB = "mongodb+srv://SirBinary:SirBinary19@cluster0.polpz.mongodb.net/?retryWrites=true&w=majority";


//INIT
const PORT = process.env.PORT || 3000;
const app = express();

//middleware
app.use(express.json());
app.use(authRouter);
app.use(adminRouter);
app.use(productRouter);
app.use(userRouter);

//Connections
mongoose
  .connect(DB)
  .then(() => {
    console.log("Connection successful");
  })
  .catch((e) => {
    console.log(e);
  });

//GET, PUT, POST, DELETE, UPDATE -> CRUD
app.listen(PORT, "0.0.0.0", () => {
  console.log(`connected at port ${PORT}`);
});
