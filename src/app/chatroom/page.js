"use client";
import React, { useEffect, useRef, useState } from 'react';
import styles from "./page.module.css";
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { disconnectSocket, initiateSocket } from '../../../utlis/socket';


function ChatRoom(props) {
    let socket = useRef();
    
    const[sentMessage , setSentMessage] = useState("");
    const[messages , setMessages] = useState([]);

    const handleChange=(e)=>{
        setSentMessage(e.target.value);
    }
    const session = useSession({
        required: true,
        onUnauthenticated() {
          redirect("/signin");
        },
    });

    useEffect(()=>{
         socket.current = initiateSocket();

         socket.current.on("recieveMessage" , (data)=>{
            console.log("RECIEVED MESSAGE : " , data);
            setMessages((prev)=>{
                return [...prev , data]
            });

         })

         return ()=> {
            disconnectSocket(); 
         }
    },[]);

    const handleSend=()=>{
        socket.current.emit("sendMessage" , sentMessage);
        setMessages((prev)=>{
            return [...prev , sentMessage]
        });
    }


     
    return (
        <div className={styles.chatContainer}>
            { messages.map((message)=> <div key={Math.random()}>
              <div className={styles.message}>
                <h3 >[user] : </h3> 
                 <h4>{message}</h4>
              </div>
              </div>
)}
              <div className={styles.input}>
              <input style={{outline:"none" , border:"none" , backgroundColor:"transparent" , borderBottom:"1px solid gray"}} 
              type='text' placeholder='send a message' value={sentMessage} onChange={handleChange}/>
              <button onClick={handleSend} >Send</button>
              </div>
        </div>
    );
}

export default ChatRoom;