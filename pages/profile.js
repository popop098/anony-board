import {useSession} from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import useSWR from "swr";
import moment from "moment";
import "moment/locale/ko"

export default function Profile() {
    moment.locale('ko')
    const {data: session, status} = useSession()
    const {data: me, isValidating, mutate} = useSWR("/api/@me", {fetcher: (url) => fetch(url).then(res => res.json())});
    return (
        <div className="container m-auto p-7">
            <div className="w-full bg-slate-500 rounded-lg shadow-lg p-6 text-white divide-y-2">
                <div>
                    <h1 className="text-3xl font-bold">내 정보</h1>
                    {
                        status === "loading"
                            ? <div className="flex items-center">
                                <svg aria-hidden="true"
                                     className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                     viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path
                                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                        fill="currentColor"/>
                                    <path
                                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                        fill="currentFill"/>
                                </svg>
                                <p className="text-xl font-bold">불러오고 있습니다.</p>
                            </div>
                            : session && (
                            <>
                                <div className="mt-3 flex items-center gap-2">
                                    <Image className="rounded-full" width={100} height={100} loading="lazy"
                                           src={`/api/img?url=${session.user.image}`} alt="avatar"/>
                                    <div>
                                        <h3 className="text-xl">🧑 닉네임</h3>
                                        <p>{session.user.name}</p>
                                        <h3 className="text-xl">📧 이메일</h3>
                                        <p>{session.user.email}</p>
                                    </div>
                                </div>
                            </>
                        )
                    }
                </div>
                <div className="mt-7 space-y-4">
                    <h1 className="mt-3 text-3xl font-bold">내 게시물</h1>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                            <tr>
                                <th>제목</th>
                                <th>조회수</th>
                                <th>게시일</th>
                                <th>최근 수정일</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                isValidating ? (
                                    <>
                                        <tr>
                                            <th>
                                                <div className="flex items-center">
                                                    <svg aria-hidden="true"
                                                         className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                                         viewBox="0 0 100 101" fill="none"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                            fill="currentColor"/>
                                                        <path
                                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                            fill="currentFill"/>
                                                    </svg>
                                                    <p className="text-xl font-bold">불러오고 있습니다.</p></div>
                                            </th>
                                            <th></th><th></th><th></th>
                                        </tr>
                                    </>
                                ) : me.posts.length > 0 ? me.posts.map((p, i) => (
                                    <tr key={i}>
                                        <th>
                                            <Link href={`/posts/${p._id}`} passHref>
                                                <a className="text-blue-600 hover:underline">{p.title}</a>
                                            </Link>
                                        </th>
                                        <th>{p.views}</th>
                                        <th>{moment(p.createdAt).format('LLL')}</th>
                                        <th>{moment(p.updatedAt).format('LLL')}</th>
                                    </tr>
                                )) : (
                                    <tr>
                                        <th>등록된 게시글이 없습니다.</th>
                                        <th></th>
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="mt-7 space-y-4">
                    <h1 className="mt-3 text-3xl font-bold">내 댓글</h1>
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                            <tr>
                                <th>게시글 제목</th>
                                <th>내용</th>
                                <th>작성일</th>
                                <th>최근 수정일</th>
                            </tr>
                            </thead>
                            <tbody>
                            {
                                isValidating ? (
                                    <>
                                        <tr>
                                            <th>
                                                <div className="flex items-center">
                                                    <svg aria-hidden="true"
                                                         className="mr-2 w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                                                         viewBox="0 0 100 101" fill="none"
                                                         xmlns="http://www.w3.org/2000/svg">
                                                        <path
                                                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                                                            fill="currentColor"/>
                                                        <path
                                                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                                                            fill="currentFill"/>
                                                    </svg>
                                                    <p className="text-xl font-bold">불러오고 있습니다.</p></div>
                                            </th>
                                            <th></th><th></th><th></th>
                                        </tr>
                                    </>
                                ) : me.comments.length > 0 ? me.comments.map((c, i) => (
                                    <tr key={i}>
                                        <th>
                                            <Link href={`/posts/${c.post.id}`} passHref>
                                                <a className="text-blue-600 hover:underline">{c.post.title}</a>
                                            </Link>
                                        </th>
                                        <th>{c.comment.content}</th>
                                        <th>{moment(c.comment.createdAt).format('LLL')}</th>
                                        <th>{moment(c.comment.updatedAt).format('LLL')}</th>
                                    </tr>
                                )) : (
                                    <tr>
                                        <th>등록된 댓글이 없습니다.</th>
                                        <th></th>
                                    </tr>
                                )
                            }
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    )
}
