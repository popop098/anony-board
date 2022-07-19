import {useSession} from "next-auth/react";
import useSWR from "swr";
import Link from "next/link";
import {useRouter} from "next/router";
import moment from "moment";
export default function Home() {
    const router = useRouter();
    const { data: session } = useSession()
    const {data: post,isValidating,mutate} = useSWR("/api/post", {fetcher: (url) => fetch(url).then(res => res.json())});
    return (
        <div className="container m-auto px-5 space-y-3">
            <div className="flex justify-between items-center mt-10">
                <h1 className=" text-2xl font-bold">익명게시판</h1>
                {
                    session && <button className="btn btn-outline" onClick={()=>router.push("/newpost")}>✏ 글쓰기</button>
                }
            </div>
            <div className="overflow-x-auto">
                <table className="table w-full">
                    <thead>
                    <tr>
                        <th>제목</th>
                        <th>조회수</th>
                        <th>게시일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {
                        isValidating
                            ?   <tr>
                                    <th>불러오는 중입니다.</th><th></th><th></th>
                                </tr>
                            : post.post.length > 0 ? post.post.map((p, i) => (
                                <tr key={i}>
                                    <th>
                                        <Link href={`/posts/${p._id}`} passHref>
                                            <a className="text-blue-600 hover:underline">{p.title}</a>
                                        </Link>
                                    </th>
                                    <th>{p.views}</th>
                                    <th>{moment(p.createdAt).format('LLL')}</th>
                                </tr>
                            )) : <tr>
                                <th>등록된 게시글이 없습니다.</th>
                            </tr>
                    }

                    </tbody>
                </table>
            </div>

        </div>
    )
}
