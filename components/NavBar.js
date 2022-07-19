import Image from "next/image";
import {useSession,signIn,signOut} from "next-auth/react";
import Link from "next/link";
export default function (){
    const {data:session} = useSession()
    return(
        <div className="navbar bg-base-300 relative sticky top-0 z-50 shadow-2xl">
            <div className="flex-1">
                <Link href="/" passHref><a className="btn btn-ghost normal-case text-xl">익명게시판</a></Link>
            </div>
            <div className="flex-none gap-2 pr-2">
                {
                    session ? (
                        <div className="dropdown dropdown-end">
                            <label tabIndex="0" className="btn btn-ghost btn-circle avatar">
                                <span className="w-10">
                                    <Image className="rounded-full" layout="fill" loading="lazy" src={`/api/img?url=${session.user.image}`} alt="avatar"/>
                                </span>
                            </label>
                            <ul tabIndex="0"
                                className="mt-3 p-2 shadow menu menu-compact dropdown-content bg-base-200 rounded-box w-52">
                                <li className="menu-title">
                                    <span>{session.user.name}님</span>
                                </li>
                                <li>
                                    <Link href="/profile" passHref><a>
                                        Profile
                                    </a></Link>
                                </li>
                                <li onClick={()=>signOut()}><a className="text-red-500">Logout</a></li>
                            </ul>
                        </div>
                    ) : (
                        <button className="btn btn-outline btn-info no-animation" onClick={()=>signIn('google')}>로그인</button>
                    )
                }

            </div>
        </div>
    )
}
