import express from "express";
import "dotenv/config";
import mongoose from "mongoose";
import contact_router from "./routes/contactRoutes.js";
import cors from "cors";

const app = express();
const port = process.env.PORT;
const urlDB = process.env.DBURL;

app.use(cors());
app.use(contact_router);

//SERVER AND DB CONNECTION
await mongoose.connect(urlDB).then(() => {
    console.log("DB Connected!");
    app.listen(port, () => {
        console.log(`Server running in port : ${port}`);
    });
});
