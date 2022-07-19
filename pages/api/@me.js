import dbConnect from "../../lib/dbConnect";
import Info from "../../models/Info";
import {getToken} from "next-auth/jwt";
import Post from "../../models/Post";

export default async function handler(req, res) {
    const {method} = req;
    const token = await getToken({req});
    if(!token) {
        return res.status(401).json({error: "Unauthorized"});
    }
    await dbConnect()
    switch (method) {
        case "GET":
            let newData = []
            let comments = [];
            const info = await Info.findOne({email:token.email});
            const post = await Post.find({});
            post.filter(post => {
                if(info.posts.includes(post._id)) {
                    return newData.push(post._doc);
                }
            })
            for (const comment of info.comments) {
                const temp = await Post.find({"comments.id": comment.id})
                comments.push({post: {id:temp[0]._id,title:temp[0].title},comment:temp[0].comments.find(comment => comment.id === comment.id)});
            }
            const map = new Map(); // 맵
            for(const character of comments){
                map.set(JSON.stringify(character), character); // name, company가 모두 같은 객체 요소는 제외한 맵 생성
            }
            const arrUnique = [...map.values()];
            return res.status(200).json({posts: newData, comments:arrUnique});
        default:
            return res.status(405).json({error: "Method not allowed"});

    }
}
