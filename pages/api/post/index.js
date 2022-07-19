import dbConnect from "../../../lib/dbConnect";
import Post from "../../../models/Post";

export default async function handler(req, res) {
    const {method} = req;
    await dbConnect();
    switch (method) {
        case "GET":
            const post = await Post.find({});
            return res.status(200).json({post: post});
        default:
            return res.status(405).json({error: "Method not allowed"});
    }
}
