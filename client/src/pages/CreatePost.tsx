import React, { useState } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css';
import { Navigate } from 'react-router-dom';
import Editor from '../components/Editor';
const CreatePost = () => {
    const [title,setTitle] = useState<string>('');
    const [summary,setSummary] = useState<string>('');
    const [content,setContent] = useState<string>('');
    const [file,setFile] = useState<File|undefined>(undefined);
    const [redirect,setRedirect]= useState<boolean>(false);
    const createNewPost = ()=>{
        const data= new FormData();
        data.set('title',title);
        data.set('summary',summary);
        data.set('content',content);
        if(file){
            data.set('file',file);
        }
        fetch('http://localhost:4000/post',{
            method:'POST',
            body: data,
            credentials: 'include'
        }).then((response)=>{
            if(response.ok){
                setRedirect(true);
            }
        })
    }
    
    if(redirect){
        return (
            <Navigate to={'/'}/>
        )
    }
  return (
    <form onSubmit={createNewPost} encType="multipart/form-data">
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

        <button style={{marginTop:'5px'}}>Create Post</button>

    </form>
  )
}

export default CreatePost