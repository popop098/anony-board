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
        case "GET":
            const post = await Post.findById({_id:req.query.postid});
            let data = {}
            data.dislikes = !!post.dislikes.includes(token.email);
            data.likes = !!post.likes.includes(token.email);
            return res.status(200).json({data: data});
        case "POST":
            if(req.body.type === "like") {
                await Post.findByIdAndUpdate({_id:req.query.postid}, {$push: {likes: token.email}},{upsert: true});
                await Info.findOneAndUpdate({email:token.email}, {$push: {likes: req.query.postid}}, {upsert: true});
                await Post.findByIdAndUpdate({_id:req.query.postid}, {$pull: {dislikes: token.email}},{upsert: true});
                await Info.findOneAndUpdate({email:token.email}, {$pull: {dislikes: req.query.postid}}, {upsert: true});
            } else {
                await Post.findByIdAndUpdate({_id:req.query.postid}, {$push: {dislikes: token.email}},{upsert: true});
                await Info.findOneAndUpdate({email:token.email}, {$push: {dislikes: req.query.postid}}, {upsert: true});
                await Post.findByIdAndUpdate({_id:req.query.postid}, {$pull: {likes: token.email}},{upsert: true});
                await Info.findOneAndUpdate({email:token.email}, {$pull: {likes: req.query.postid}}, {upsert: true});
            }
            return res.status(200).json({message: "Reaction added"});
        case "DELETE":
            if(req.body.type === "like") {
                await Post.findByIdAndUpdate({_id:req.query.postid}, {$pull: {likes: token.email}},{upsert: true});
                await Info.findOneAndUpdate({email:token.email}, {$pull: {likes: req.query.postid}}, {upsert: true});
            } else {
                await Post.findByIdAndUpdate({_id:req.query.postid}, {$pull: {dislikes: token.email}},{upsert: true});
                await Info.findOneAndUpdate({email:token.email}, {$pull: {dislikes: req.query.postid}}, {upsert: true});
            }
            return res.status(200).json({message: "Reaction deleted"});
    }
}
