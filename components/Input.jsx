import { arrayUnion, doc, serverTimestamp, Timestamp, updateDoc } from 'firebase/firestore';
import React, { useContext, useState} from 'react';
import { AuthContext } from '../context/AuthContext';
import { ChatContext } from '../context/ChatContext';
import Attach from '../images/attach.png';
import Image from '../images/img.png';
import { db, storage } from "../firebase";
import { v4 as uuid } from "uuid";
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';


const Input = () => {
  const [text, setText] = useState("");
  const [image, setImage] = useState(null);

  const {currentUser} = useContext(AuthContext);
  const {data} = useContext(ChatContext);

  const handleSend = async () => {
    if (image){

      const storagRef = ref(storage, uuid());

      const uploadTask = uploadBytesResumable(storagRef, image);

      uploadTask.on( 
        (error) => {
          // Handle unsuccessful uploads
        }, 
        () => {
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateDoc(doc(db, "chats", data.chatId), {
              messages: arrayUnion({
                id: uuid(),
                text,
                senderId: currentUser.uid,
                date: Timestamp.now(),
                image: downloadURL,
              }),
            });
          });  
        }
      );

    } else{
      await updateDoc(doc(db, "chats", data.chatId), {
        messages: arrayUnion({
          id: uuid(),
          text,
          senderId: currentUser.uid,
          date: Timestamp.now(),
        }),
      });
    }

    await updateDoc(doc(db, "userChats", currentUser.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    await updateDoc(doc(db, "userChats", data.user.uid), {
      [data.chatId + ".lastMessage"]: {
        text,
      },
      [data.chatId + ".date"]: serverTimestamp(),
    });

    setText("");
    setImage(null);
  };

  return (
    <div className='input'>
      <input 
        type="text"
        placeholder='Type something...' 
        onChange={(e) => setText(e.target.value)}
        value={text}
      />
      <div className="send">
        <img src={Attach} alt="" />
        <input 
          type="file" 
          style={{ display: "none" }}  
          id="file" 
          onChange={(e) => setImage(e.target.files[0])}
        />
        <label htmlFor="file">
          <img src={Image} alt="" />
        </label>
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};

export default Input