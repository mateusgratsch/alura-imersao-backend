import multer from "multer";
import express from "express";
import { criarNovoPost, listarPosts, procurarPost, uploadImage, updatePost } from "../controller/postsController.js";
import cors from "cors";
//import { procurarPost } from "../models/postsModel.js";
const corsOptions = {
    origin: "http://localhost:8000",
    optionsSuccessStatus: 200
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
})

const upload = multer({ dest: "./uploads" , storage})

const routes = (app) =>{
    //use
    app.use(express.json());
    app.use(cors(corsOptions));
    //get
    app.get("/posts", listarPosts);
    app.get("/posts/:id", procurarPost);
    //post
    app.post("/posts", criarNovoPost);
    app.post("/upload", upload.single("image"), uploadImage)
    //put
    app.put("/upload/:id", updatePost);
    
}

export default routes;