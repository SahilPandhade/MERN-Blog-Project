import { format, formatISO9075 } from 'date-fns'
import React from 'react'
import { Link } from 'react-router-dom'
interface postProps{
    _id:string
    title:string,
    summary:string,
    content:string,
    cover:string,
    createdAt:string,
    author: {_id:string,userName:string}
}
const Post = ({_id,title,summary,cover,content,createdAt,author}:postProps) => {
  return (
    <div className="post">
        <div className="image">
            <Link to={`/post/${_id}`}>
                <img src={`http://localhost:4000/${cover}`} alt='Article source'></img>
            </Link>
        </div> 
        <div className="texts">
            <Link to={`/post/${_id}`}>
                <h2>{title}</h2>
            </Link>
            <p className="info">
                <a href="" className="author">{author.userName} </a>  
            </p>
            <time style={{fontSize:'10px'}}>{formatISO9075(new Date(createdAt))} </time>
            <p className='summary'>{summary}</p>
        </div>
      </div>
  )
}

export default Post