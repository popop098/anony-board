import {useSession,signIn} from "next-auth/react";
import dynamic from "next/dynamic";
const WysiwygEditor = dynamic(()=> import('../components/editor'), { ssr : false } )
export default function NewPost() {
    const {data:session,status} = useSession()
    if(status === "unauthenticated"){
        return signIn('google')
    }
    return (
        <div className="mt-10 container m-auto px-5 space-y-2">
            <h1 className="text-2xl font-bold">새 글 작성</h1>
            <WysiwygEditor/>
            {/*<button className="btn btn-outline" onClick={getValue}>getValue</button>*/}
        </div>
    )
}
