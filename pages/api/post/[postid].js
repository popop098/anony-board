import dbConnect from "../../../lib/dbConnect";
import Post from "../../../models/Post";
import Info from "../../../models/Info";
import {getToken} from "next-auth/jwt";
import {ObjectId} from "mongodb";

export default async function handler(req, res) {
    const {method} = req;
    const token = await getToken({req});
    if(!token) {
        return res.status(401).json({error: "Unauthorized"});
    }
    await dbConnect()
    switch (method) {
        case "GET":
            let newData = {}
            const post = await Post.findById({_id:req.query.postid});
            const info = await Info.findOne({email:token.email});
            newData={...post._doc};
            newData.edit = !!info.posts.includes(req.query.postid);
            newData.dislikes = post.dislikes.length;
            await Post.findByIdAndUpdate({_id:req.query.postid}, {$inc: {views: 1}});
            console.log(newData);
            return res.status(200).json({post: newData});
        case "DELETE":
            await Post.findByIdAndDelete({_id:req.query.postid});
            await Info.findOneAndUpdate({email:token.email}, {$pull: {posts: ObjectId(req.query.postid)}});
            await Info.updateMany({}, {$pull: {comments: {post:req.query.postid},likes:req.query.postid,dislikes:req.query.postid}});
            return res.status(200).json({message: "Post deleted"});
        case "PUT":
            await Post.findByIdAndUpdate({_id:req.query.postid}, {$set: {title: req.body.title, content: req.body.content,updatedAt: Date.now()}});
            return res.status(200).json({message: "Post updated"});
        default:
            return res.status(405).json({error: "Method not allowed"});
    }
}
