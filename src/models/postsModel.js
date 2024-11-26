import conectarAoBanco from "../config/dbconfig.js";
import 'dotenv/config';
import { ObjectId } from 'mongodb';

const conexao = await conectarAoBanco(process.env.STRING_CONEXAO);

export async function getAllPosts(){
    const db = conexao.db("imersao-instabytes");
    const colecao = db.collection("posts");
    return colecao.find().toArray();
}
export async function createPost(content){
    const db = conexao.db("imersao-instabytes");
    const colecao = db.collection("posts");
    return colecao.insertOne(content);
}

export async function getPostById(postId) {
    const db = conexao.db("imersao-instabytes");
    const colecao = db.collection("posts");
    // Construindo o filtro para encontrar o post pelo ID
    const filter = { _id: new ObjectId(postId) };
    // Realizando a busca e retornando o post encontrado
    const post = await colecao.findOne(filter);
    console.log(post);
    return post;
}

export async function atualizarPost(id, novoPost){
    const objectId = ObjectId.createFromHexString(id)
    const db = conexao.db("imersao-instabytes");
    const colecao = db.collection("posts");
    return colecao.updateOne({_id:new ObjectId(objectId)}, {$set: novoPost});
}