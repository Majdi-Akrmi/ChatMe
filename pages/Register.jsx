import React, { useState } from 'react';
import ChatMe from '../images/chatme.png';
import Add from '../images/addAvatar.png';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate, Link } from 'react-router-dom';

const Register = () => {

  const [err, setErr] = useState(false);
  const navigation = useNavigate();

  const handleSubmit = async (e) =>{
    e.preventDefault();
    const displayName = e.target[0].value;
    const displayEmail = e.target[1].value;
    const displayPassword = e.target[2].value;
    const displayFile = e.target[3].files[0];
    try {
      //Create user
      const res = await createUserWithEmailAndPassword(auth, displayEmail, displayPassword);

      //Create a unique image name
      const date = new Date().getTime();
      const storageRef = ref(storage, `${displayName + date}`);

      await uploadBytesResumable(storageRef, displayFile).then(() => {
        getDownloadURL(storageRef).then(async (downloadURL) => {
          try {
            //Update profile
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            //create user on firestore
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              displayEmail,
              photoURL: downloadURL,
            });

            //create empty user chats on firestore
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigation("/");
          } catch (err) {
            console.log(err);
            setErr(true);
          }
        });
      });
    } catch (err) {
      setErr(true);
    }
  };

  return (
    <div className='formContainer'>
      <div className='logo'><img src={ChatMe} /></div>
      <div className='formWrapper'>
        <span className='title'>Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder='Put your name'/>
          <input type="email" placeholder='Put your email'/>
          <input type="password" placeholder='Enter your password'/>
          <input style={{display:"none"}} type="file" id='file'/>
          <label htmlFor='file'>
            <img src={Add} />
            <span>Add an avatar image</span>
          </label>
          <button>SIGN UP</button>
          {err && <span>Something went wrong</span>}
        </form>
        <p>
          You do have an account ?  <Link to="/login">Sign in</Link>
        </p>
      </div>
    </div>
  );
};

export default Register