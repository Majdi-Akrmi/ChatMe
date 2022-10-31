import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import ChatMe from '../images/chatme.png';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../firebase';

const Login = () => {
  const [err, setErr] = useState(false);

  const navigation = useNavigate();

  const handleSubmit = async (e) =>{
    e.preventDefault()
    const displayEmail = e.target[0].value
    const displayPassword = e.target[1].value

    try{
      await signInWithEmailAndPassword(auth, displayEmail, displayPassword)
      navigation("/")
    } catch(err){
      setErr(true);
    }  
  };

  return (
    <div className='formContainer'>
      <div className='logo'><img src={ChatMe} /></div>
      <div className='formWrapper'>
        <span className='title'>Sign in</span>
        <form onSubmit={handleSubmit}>
          <input type="email" placeholder='Put your email'/>
          <input type="password" placeholder='Enter your password'/>
          <button>SIGN IN</button>
          {err && <span>Something went Wrong</span>}
        </form>
        <p>You don't have an account ?  <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
};

export default Login