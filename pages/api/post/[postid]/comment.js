import dbConnect from "../../../../lib/dbConnect";
import Post from "../../../../models/Post";
import Info from "../../../../models/Info";
import {getToken} from "next-auth/jwt";

export default async function handler(req, res) {
    const {method} = req;
    const token = await getToken({req});
    if(!token) {
        return res.status(401).json({error: "Unauthorized"});
    }
    await dbConnect()
    switch (method) {
        case "POST":
            const commentId = Math.random().toString(36).substr(2,11);
            await Post.findByIdAndUpdate({_id:req.query.postid}, {$push: {comments: {id:commentId,content:req.body.content,name:token.name,email:token.email,createdAt:Date.now(),updatedAt:Date.now()}}});
            await Info.findOneAndUpdate({email:token.email}, {$push: {comments: {id:commentId,post:req.query.postid}}}, {upsert: true});
            return res.status(200).json({message: "Comment added"});
        case "DELETE":
            await Post.findByIdAndUpdate({_id:req.query.postid}, {$pull: {comments: {id:req.body.id}}});
            await Info.findOneAndUpdate({email:token.email}, {$pull: {comments: {id:req.body.id}}}, {upsert: true});
            return res.status(200).json({message: "Comment deleted"});
        case "PUT":
            await Post.findOneAndUpdate({"comments.id":req.body.id}, {$set: {"comments.$.content": req.body.value, "comments.$.updatedAt": Date.now()}});
            return res.status(200).json({message: "Comment updated"});
        default:
            return res.status(405).json({error: "Method not allowed"});
    }
}
