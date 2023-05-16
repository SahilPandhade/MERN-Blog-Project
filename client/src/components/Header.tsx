import React, { useContext, useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../context/UserContext';

const Header = () => {
    const {setUserInfo,userInfo,setLoggedIn,loggedIn} = useContext(UserContext);
    useEffect(()=>{
        if(loggedIn){
        fetch('http://localhost:4000/profile',{
            method: 'GET',
            credentials: 'include',
        }).then((response)=>{
            // if(response.status===200){
                response.json().then((userInfo)=>{       
                    setUserInfo(userInfo);
                });
            // }      
        })
    }
    },[setUserInfo,loggedIn]);

  const handleLogOut = ()=>{
    fetch('http://localhost:4000/logout',{
        method: 'POST',
        credentials: 'include'
    }).then(()=>{
        setLoggedIn(false);
        setUserInfo({userName:'',id:''});
        
    })
  }
  return (
    <header>
        <Link to="/" className='logo'>MyBlog</Link>
        <nav>
            {
                userInfo?.userName && 
                (
                    <>
                        <Link to='/create' className='headerBtn'>Create new Post</Link>
                        <a onClick={handleLogOut} className='headerBtn'>Logout ({userInfo?.userName})</a>
                    </>
                )
            }
            {
                !userInfo?.userName && 
                (
                    <>
                        <Link to='/login' className='headerBtn'>Login</Link>
                        <Link to='/register' className='headerBtn'>Register</Link>
                    </>
                )
            }
        </nav>
      </header>
  )
}

export default Header