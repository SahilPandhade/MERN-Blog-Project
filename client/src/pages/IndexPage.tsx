import React, { useEffect, useState } from 'react'
import Post from '../components/Post'
interface postProps{
    _id:string
    title:string,
    summary:string,
    content:string,
    cover:string,
    createdAt:string,
    author:{_id:string,userName:string}
}
const IndexPage = () => {
  const[posts,setPosts] = useState<postProps[] | []>([]);
  useEffect(()=>{
    fetch("http://localhost:4000/post",).then((response)=>{
        response.json().then(posts=>{
            setPosts(posts);
        })
    })
  },[])
  return (
    <>
        {
            (posts && posts.length>0) && posts.map((post:postProps)=>{
                return <Post key={post.createdAt} {...post}/>
            })
        }
    
    </>
  )
}

export default IndexPage