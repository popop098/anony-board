import 'tui-color-picker/dist/tui-color-picker.css'
import '@toast-ui/editor-plugin-color-syntax/dist/toastui-editor-plugin-color-syntax.css'
import '@toast-ui/editor/dist/toastui-editor-viewer.css';
import { Editor,Viewer } from '@toast-ui/react-editor'
import colorSyntax from '@toast-ui/editor-plugin-color-syntax'
import { useRef,useState,useEffect} from 'react'
import { toast,Slide } from "react-toastify";
import {useRouter} from "next/router";
import {useSession} from "next-auth/react";
import moment from "moment";
import "moment/locale/ko"
import Image from "next/image";
import useSWR from "swr";
import {fetcher} from "../utils/Fetch";
import CTE from "react-click-to-edit";
import CommentEditModal from "./CommentEditModal";
const WysiwygEditor = ({initialValue="",title="",viewmode=false,uploadtime,edittime,
                        likes,dislikes,comments,viewcount,refresh,editable}) => {
    const {data:session} = useSession()
    const router = useRouter();
    const editorRef = useRef(null);
    const curtoast = useRef(null)
    const [Preview,setPreview] = useState(false);
    const [isEditable, setIsEditable] = useState(false);
    const [PreviewValue,setPreviewValue] = useState("");
    const toolbarItems = [ ['bold', 'italic', 'strike'], ['hr'], ['link']]
    const postId = router.query.postid;
    const {data:reactionData,mutate,isValidating} = useSWR(postId ? `/api/post/${postId}/reaction`:null,fetcher)
    moment.locale("ko");
    async function save(){
        const editorIns = editorRef.current.getInstance();
        const title = document.getElementById("title").value
        const content = editorIns.getMarkdown();
        if(!title || !content){
            toast.error("무언가 누락되었어요.",{transition:Slide})
            return
        }
        curtoast.current = toast("저장중...",{transition:Slide,type:"info"})
        const resp = await fetch("/api/post/new",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                title:title,
                content:content
            })
        })
        if(resp.ok){
            const data = await resp.json()
            toast.update(curtoast.current, {type:"success",render:"저장되었어요.",transition:Slide,autoClose:5000})
            return await router.push(`/posts/${data.post._id}`)
        }else {
            return toast.update(curtoast.current, {type:"error",render:"저장에 실패했어요.",transition:Slide,autoClose:5000})
        }
    }
    async function editPost(){
        const editorIns = editorRef.current.getInstance();
        const title = document.getElementById("title").value
        const content = editorIns.getMarkdown();
        if(!title || !content){
            toast.error("무언가 누락되었어요.",{transition:Slide})
            return
        }
        curtoast.current = toast("저장중...",{transition:Slide,type:"info"})
        const resp = await fetch(`/api/post/${router.query.postid}`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                title:title,
                content:content
            })
        })
        if(resp.ok){
            toast.update(curtoast.current, {type:"success",render:"저장되었어요.",transition:Slide,autoClose:5000})
            return window.location.replace(`/posts/${router.query.postid}`)
        }else {
            return toast.update(curtoast.current, {type:"error",render:"저장에 실패했어요.",transition:Slide,autoClose:5000})
        }
    }
    async function CommentSave(){
        const commentValue = document.getElementById("comment").value
        if(!commentValue){
            toast.error("무언가 누락되었어요.",{transition:Slide})
            return
        }
        curtoast.current = toast("저장중...",{transition:Slide,type:"info"})
        const resp = await fetch(`/api/post/${router.query.postid}/comment`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                content:commentValue
            })
        })
        if(resp.ok){
            toast.update(curtoast.current, {type:"success",render:"저장되었어요.",transition:Slide,autoClose:5000})
            return refresh()
        }else {
            return toast.update(curtoast.current, {type:"error",render:"저장에 실패했어요.",transition:Slide,autoClose:5000})
        }
    }
    async function CommentDelete(id){
        curtoast.current = toast("저장중...",{transition:Slide,type:"info"})
        const resp = await fetch(`/api/post/${router.query.postid}/comment`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                id:id
            })
        })
        if(resp.ok){
            toast.update(curtoast.current, {type:"success",render:"저장되었어요.",transition:Slide,autoClose:5000})
            return refresh()
        }else {
            return toast.update(curtoast.current, {type:"error",render:"저장에 실패했어요.",transition:Slide,autoClose:5000})
        }
    }
    async function CommentUpdate(id,value){
        curtoast.current = toast("저장중...",{transition:Slide,type:"info"})
        const resp = await fetch(`/api/post/${router.query.postid}/comment`,{
            method:"PUT",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                id:id,
                value:value
            })
        })
        if(resp.ok){
            toast.update(curtoast.current, {type:"success",render:"저장되었어요.",transition:Slide,autoClose:5000})
            return refresh()
        }else {
            return toast.update(curtoast.current, {type:"error",render:"저장에 실패했어요.",transition:Slide,autoClose:5000})
        }
    }
    async function reactionAdd(type){
        curtoast.current = toast("저장중...",{transition:Slide,type:"info"})
        const resp = await fetch(`/api/post/${router.query.postid}/reaction`,{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                type:type
            })
        })
        if(resp.ok){
            toast.update(curtoast.current, {type:"success",render:"저장되었어요.",transition:Slide,autoClose:5000})
            return refresh()
        }else {
            return toast.update(curtoast.current, {type:"error",render:"저장에 실패했어요.",transition:Slide,autoClose:5000})
        }
    }
    async function reactionDelete(type){
        curtoast.current = toast("저장중...",{transition:Slide,type:"info"})
        const resp = await fetch(`/api/post/${router.query.postid}/reaction`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                type:type
            })
        })
        if(resp.ok){
            toast.update(curtoast.current, {type:"success",render:"저장되었어요.",transition:Slide,autoClose:5000})
            return refresh()
        }else {
            return toast.update(curtoast.current, {type:"error",render:"저장에 실패했어요.",transition:Slide,autoClose:5000})
        }
    }
    async function postDelete(){
        curtoast.current = toast("삭제중...",{transition:Slide,type:"info"})
        const resp = await fetch(`/api/post/${router.query.postid}`,{
            method:"DELETE",
            headers:{
                "Content-Type":"application/json"
            },
        })
        if(resp.ok){
            toast.update(curtoast.current, {type:"success",render:"삭제되었어요.",transition:Slide,autoClose:5000})
            return await router.push("/")
        }else {
            return toast.update(curtoast.current, {type:"error",render:"삭제를 실패했어요.",transition:Slide,autoClose:5000})
        }
    }
    const reactionD = reactionData?.data
    return(
        <>
            {
                !viewmode ? (
                    <>
                        <input type="text"
                               id="title"
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                               placeholder="글 제목"
                                defaultValue={title}/>
                        <Editor ref={editorRef} initialValue={initialValue} // 글 수정 시 사용
                                initialEditType='wysiwyg' // wysiwyg & markdown
                                hideModeSwitch={true}
                                height='500px'
                                usageStatistics={false}
                                toolbarItems={toolbarItems}
                                plugins={[colorSyntax, ]}
                                previewStyle="tab"/>
                        <div className="flex justify-between items-center mt-5">
                            <p className="text-lg font-bold">🛠 작업</p>
                            <div>
                                <button type="button"
                                        onClick={()=>router.back()}
                                        className="text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700">
                                    취소
                                </button>
                                {
                                    Preview ? (
                                        <button type="button"
                                                onClick={()=>setPreview(false)}
                                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                            미리보기 닫기
                                        </button>
                                    ) : (
                                        <button type="button"
                                                onClick={()=>{
                                                    const editorIns = editorRef.current.getInstance();
                                                    const contentMark = editorIns.getHTML();
                                                    setPreviewValue(contentMark)
                                                    setPreview(true)
                                                }}
                                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                            미리보기
                                        </button>
                                    )
                                }
                                {
                                    Preview && <button type="button"
                                                       onClick={()=>
                                                           {
                                                               const editorIns = editorRef.current.getInstance();
                                                               const contentMark = editorIns.getHTML();
                                                               setPreviewValue(contentMark)
                                                           }
                                                       }
                                                       className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                        미리보기 새로고침
                                    </button>
                                }
                                {
                                    editable ? (
                                        <button type="button"
                                                onClick={editPost}
                                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                            수정하기
                                        </button>
                                    ) : (
                                        <button type="button"
                                                onClick={save}
                                                className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                            저장
                                        </button>
                                    )
                                }
                            </div>
                        </div>
                        {
                            Preview && (
                                <>
                                <div className="divider"/>
                                    <h1 className="text-2xl font-bold">미리보기</h1>
                                <div className="w-full p-5 bg-white rounded-md" dangerouslySetInnerHTML={{__html:PreviewValue}}>
                                </div></>)
                        }
                    </>
                ) : (
                    <>
                        <h1 className="text-2xl font-bold">{title}</h1>
                        <p className="text-lg">게시일: {moment(uploadtime).format('LLL')}</p>
                        <p className="text-lg">최근 수정일: {moment(edittime).format('LLL')}({moment(edittime).calendar()})</p>
                        <p className="text-lg">조회수: {viewcount}</p>
                        {
                            editable && (
                                <div className="w-full flex justify-end gap-2">
                                    <button type="button"
                                            onClick={()=>router.push(`/posts/${router.query.postid}/edit`)}
                                            className="btn btn-outline btn-ghost">
                                        수정
                                    </button>
                                    <button type="button"
                                            onClick={postDelete}
                                            className="btn btn-outline btn-error">
                                        삭제
                                    </button>
                                </div>
                            )
                        }
                        <div className="w-full p-5 bg-white rounded-md" dangerouslySetInnerHTML={{__html:initialValue}}>
                        </div>
                        <div className="w-full flex justify-end">
                            {
                                !isValidating && (
                                    <>
                                        <button type="button"
                                                onClick={()=>!reactionD.likes ? reactionAdd("like") : reactionDelete("like")}
                                                className="btn btn-ghost gap-2">
                                            {
                                                !reactionD.likes
                                                    ? <Image src="/svg/heartNo.svg" width="20px" height="20px"/>
                                                    : <Image src="/svg/heartYes.svg" width="20px" height="20px"/>
                                            }
                                            {likes.length}
                                        </button>
                                        <button type="button"
                                                onClick={()=>!reactionD.dislikes ? reactionAdd("dislike") : reactionDelete("dislike")}
                                                className="btn btn-ghost gap-2">
                                            {
                                                !reactionD.dislikes
                                                    ? <Image src="/svg/dislikeNo.svg" width="20px" height="20px"/>
                                                    : <Image src="/svg/dislikeYes.svg" width="20px" height="20px"/>
                                            }
                                            {dislikes}
                                        </button>
                                    </>
                                )
                            }
                        </div>
                        <input type="text"
                               id="comment"
                               className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                               placeholder="댓글 작성"
                        />
                        <div className="w-full flex justify-end">
                            <button type="button"
                                    onClick={CommentSave}
                                    className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none dark:focus:ring-blue-800">
                                저장
                            </button>
                        </div>

                        <div className="border border-slate-700 rounded-lg p-5 mt-5">
                            <h1 className="text-2xl font-bold">댓글 • {comments.length}개</h1>
                            <div className="divider"/>
                            {
                                comments.length > 0 ? comments.map((comment, index) => (
                                        <div key={index} id={index} value={index} className="mb-2 flex items-center justify-between">
                                            <CommentEditModal comment={comment} id={comment.id}/>
                                            <div>
                                                <p className="text-xl font-bold">{comment.name} • {moment(comment.createdAt).fromNow()}</p>
                                                {
                                                    isEditable ? <input type="text"
                                                                        defaultValue={comment.content}
                                                                        className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                                                        placeholder="댓글 수정"
                                                                        onKeyDown={async (e)=> {
                                                                            if(e.key === "Enter") {
                                                                                await CommentUpdate(comment.id, e.target.value)
                                                                                return setIsEditable(false)
                                                                            }
                                                                        }}
                                                    /> : <><p className="text-lg" onClick={()=>setIsEditable(true)}>{comment.content}</p>{(comment.updatedAt - comment.createdAt) > 1000  &&<p className="text-sm italic">(수정됨)</p>}</>
                                                }
                                                {/*<CTE textClass="text-lg text-white" wrapperClass="p-1" initialValue={"dad"} endEditing={async (value)=>await CommentUpdate(comment.id, value)}/>*/}
                                            </div>
                                            {
                                                comment.email === session.user.email && (
                                                    <div className="flex gap-1">
                                                        <button type="button"
                                                                onClick={async ()=> await CommentDelete(comment.id)}
                                                                className="btn btn-ghost">
                                                            삭제
                                                        </button>
                                                    </div>
                                                )
                                            }

                                        </div>
                                    )): (
                                        <p>댓글이 없습니다.</p>
                                )

                            }
                        </div>
                    </>
                )
            }

        </>
    )

}

export default WysiwygEditor
