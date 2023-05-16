import React, { useContext, useState } from 'react'
import { Navigate } from 'react-router-dom';
import { UserContext } from '../context/UserContext';

const LoginPage = () => {
  const [userName,setUserName] = useState<string>('');
  const [password,setPassword] = useState<string>('');
  const [redirect,setRedirect] = useState<boolean>(false);
  const {setUserInfo,setLoggedIn} = useContext(UserContext);
  const  handleLogin =  async (e:React.FormEvent<HTMLFormElement>)=>{
    e.preventDefault();
    await fetch('http://localhost:4000/login', {
        method:'POST',
        body:JSON.stringify({userName,password}),
        headers: {'Content-type':'application/json'},
        credentials: 'include',
    }).then((response)=>{
        if (response.ok) {
            response.json().then(userInfo => {
                setLoggedIn(true);
                setUserInfo(userInfo); 
                setRedirect(true);
            });
          } else {
            alert('wrong credentials');
          }
    }).catch((err)=>{
        console.log(err);
    })
  }

  if(redirect){
   return  <Navigate to={'/'}/>
  }
  return (
    <form className='login' onSubmit={handleLogin}>
        <h1>Login</h1>
        <input type='text' value={userName} onChange={(e)=>setUserName(e.target.value)} placeholder='Username' />
        <input type='password'  value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='Password'/>
        <button>Login</button>
    </form>
  )
}

export default LoginPage