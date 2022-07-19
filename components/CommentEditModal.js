import {useRef, useState} from "react";
import {Slide, toast} from "react-toastify";

export default function CommentEditModal({comment,id}) {
    const curtoast = useRef(null)
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
    return (
        <div className="modal" id={id}>
            <div className="modal-box">
                <h3 className="font-bold text-lg">Congratulations random Internet user!</h3>
                <p className="py-4">You've been selected for a chance to get one year of subscription to use Wikipedia for
                    free!</p>
                <div className="modal-action">
                    <a href="#" className="btn">Yay!</a>
                </div>
            </div>
        </div>
    )
}
