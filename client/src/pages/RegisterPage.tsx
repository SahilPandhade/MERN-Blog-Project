import React, { FormEvent, useState } from 'react'

const RegisterPage = () => {
  const [userName,setUserName] = useState<string>('');
  const [password,setPassword] = useState<string>('');
  const  handleSubmit = async (e:FormEvent)=>{
    e.preventDefault();
    await fetch('http://localhost:4000/register', {
        method:'POST',
        body:JSON.stringify({userName,password}),
        headers: {'Content-type':'application/json'}
    }).then((response)=>{
        if(response.status === 200){
            alert('Registration Successful!');
        }
        else{
            alert('Registration failed!');
        }
    }).catch((err)=>{
        console.log(err);
    })
  }
  return (
    <form className='register' onSubmit={handleSubmit}>
        <h1>Register</h1>
        <input type='text' value={userName} onChange={(e)=>{setUserName(e.target.value)}} placeholder='Username'/>
        <input type='password' value={password} onChange={(e)=>{setPassword(e.target.value)}} placeholder='Password'/>
        <button>Register</button>
    </form>
  )
}

export default RegisterPage