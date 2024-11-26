import { getAllPosts, createPost, getPostById, atualizarPost } from "../models/postsModel.js";
import fs from "fs";
import gerarDescricaoComGemini from "../services/gemini.js";

export async function listarPosts(req,res){
    const posts = await getAllPosts();
    res.status(200).json(posts);
    console.log("Requisição realizada em /posts");
};
export async function procurarPost(req,res){
const postId = req.params.id;
    const post = await getPostById(postId);
    if (post) {
        res.json(post);
    } else {
        res.status(404).json({ message: 'Post não encontrado' });
    }
}
export async function criarNovoPost(req,res){
    const content = req.body;
    try{
        const createdPost = await createPost(content);
        res.status(200).json(createdPost);
    }catch(error) {
        console.error(error.message);
        res.status(500).json({"ERRO":"Falha interna"});
    }
}
export async function uploadImage(req,res){
    const content = {
        descricao: "",
        imgUrl: req.file.originalname,
        alt: ""
    };
    try{
        const createdPost = await createPost(content);
        const updatedImage = `uploads/${createdPost.insertedId}.png`;
        fs.renameSync(req.file.path,updatedImage);
        res.status(200).json(createdPost);
    }catch(error) {
        console.error(error.message);
        res.status(500).json({"ERRO":"Falha interna"});
    }
}
export async function updatePost(req,res){
    const id = req.params.id;
    const urlImage = `http://localhost:3000/${id}.png`;
    try{
        const imageBuffer = fs.readFileSync(`uploads/${id}.png`);
        const descricao = await gerarDescricaoComGemini(imageBuffer);
        const updatedPost = {
            imgUrl: urlImage,
            descricao: descricao,
            alt: req.body.alt
        }
        const postAtualizado = await atualizarPost(id, updatedPost);
        
        res.status(200).json(postAtualizado);
    }catch(error) {
        console.error(error.message);
        res.status(500).json({"ERRO":"Falha interna"});
    }
}
