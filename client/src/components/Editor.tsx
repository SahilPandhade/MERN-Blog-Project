import React from 'react'
import ReactQuill from 'react-quill'
interface editorProps{
    value:string;
    onChange:React.Dispatch<React.SetStateAction<string>>;
}
const Editor = ({value,onChange}:editorProps) => {
    const modules = {
        toolbar: [
          [{ 'header': [1, 2, false] }],
          ['bold', 'italic', 'underline','strike', 'blockquote'],
          [{'list': 'ordered'}, {'list': 'bullet'}, {'indent': '-1'}, {'indent': '+1'}],
          ['link', 'image'],
          ['clean']
        ],
      }   
    const formats = [
        'header',
        'bold', 'italic', 'underline', 'strike', 'blockquote',
        'list', 'bullet', 'indent',
        'link', 'image'
    ];
  return (
    <ReactQuill 
            onChange={onChange}
            modules={modules} 
            formats={formats} 
            value={value}/>
  )
}

export default Editor