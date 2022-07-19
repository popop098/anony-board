import dbConnect from "../../../lib/dbConnect";
import Post from "../../../models/Post";
import Info from "../../../models/Info";
import { getToken} from "next-auth/jwt";

export default async function handler(req, res) {
    const {method} = req;
    const {title, content} = req.body;
    const secret = process.env.SECRET;
    const token = await getToken({req});
    console.log(token);
    if(!token) {
        return res.status(401).json({error: "Unauthorized"});
    }
    await dbConnect();
    switch (method) {
        case "POST":
            const post = new Post({
                title,
                content
            })
            const savePost = await post.save();
            await Info.updateOne({email:token.email}, {$push: {posts: savePost._id}}, {upsert: true});
            return res.status(200).json({post: savePost});
        default:
            return res.status(405).json({error: "Method not allowed"});
    }
}
