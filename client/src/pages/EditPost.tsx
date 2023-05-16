import React, { FormEvent, useEffect, useState } from 'react'
import ReactQuill from 'react-quill';
import { Navigate, useParams } from 'react-router-dom';
import Editor from '../components/Editor';
import { response } from 'express';

const EditPost = () => {
    const {id} = useParams()
    const [title,setTitle] = useState<string>('');
    const [summary,setSummary] = useState<string>('');
    const [content,setContent] = useState<string>('');
    const [file,setFile] = useState<File|undefined>(undefined);
    const [redirect,setRedirect]= useState<boolean>(false);
    useEffect(()=>{
        if(typeof id==='string' && id!=='undefined'){
            fetch("http://localhost:4000/post/"+id)
            .then(response=>{
                response.json().then(postInfo=>{
                    setTitle(postInfo.title)
                    setSummary(postInfo.summary)
                    setContent(postInfo.content)
                })
            })
        }
        
    },[id])
    const updatePost = async (e:FormEvent)=>{
        e.preventDefault();
        const data = new FormData();
        if(typeof id==='string' && id!=='undefined'){
            data.set('id',id)
            data.set('title',title);
            data.set('summary',summary);
            data.set('content',content);
            
        }  
        if(file){
            data.set('file',file)
        }
        const response = await fetch("http://localhost:4000/post/",{
            method:'PUT',
            body:data,
            credentials:'include'
        })
        if(response.ok){
            setRedirect(true);
        }
        


    }
    if(redirect){
        return (
            id ? <Navigate to={'/post/'+id}/>
            : <Navigate to={'/'}/>
        )
    }
    return (
    <form onSubmit={updatePost}>
        <input type='text' 
            value={title} 
            onChange={(e)=>{setTitle(e.target.value)}} 
            placeholder='Title'/>

        <input type='text' 
            value={summary} 
            onChange={(e)=>{setSummary(e.target.value)}} 
            placeholder='summary'/>

        <input type='file'
            onChange={(e)=>{
                setFile(e.target.files?.[0])
            }}/>
        <Editor value={content} onChange={setContent}/>
        <button style={{marginTop:'5px'}}>Update Post</button>

    </form>
)
}

export default EditPost