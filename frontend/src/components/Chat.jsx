import { useMutation } from '@tanstack/react-query'
import React, { useState } from 'react'
import axios from 'axios'
import "./Chatbot.css"
import Synthia from "../assets/synthia.png"
// import {getImageUrl} from '../utils'


//function to send message
const sendMsgAPI = async (msg) => {
    const res = await axios.post('http://localhost:9090/ask',{ msg})
    return res.data
}


const Chat = () => {
    const [message, setMessage] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [conversation, setConversation] = useState([{role: 'assistant', content: 'Hello, how can I help you today?',},]);

    //useMutation hook to send message
    const mutation = useMutation({
        mutationFn: sendMsgAPI,
        mutationKey: ['chatbot'],
        onSuccess: (data) => {
          setIsAITyping(false); // Stop showing AI typing when response arrives
          setConversation((prevConversation) => [
            ...prevConversation,
            { role: "assistant", content: data.message },
          ]);
        },
      });

    //handle submit
    const handleSubmitMsg = (e) => {
        e.preventDefault()
        const currentMsg = message.trim()
        if(!currentMsg) {alert('Please enter a message'); return;}
        setConversation((prevConversation) => [...prevConversation, {role: 'user', content: currentMsg}]);
        setIsTyping(true);
        mutation.mutate({message: currentMsg});
        setMessage('');
        
    }

  return (
    <>
        <div className="header">
            <img src={Synthia} alt="Synthia" width={400} />
            <h1 className="title">AI Chatbot</h1>
            <p className="description">Enter your message in the input below to chat with the Synthia AI.</p>
            <div className="chat-container">
                <div className="conversation">
                    {conversation.map((entry, index) => (
                        <div className={`message ${entry.role}`} key={index}>
                            <strong>{entry.role === 'user' ? 'You: ' : 'Synthia: '}
                            </strong>
                            {entry.content}
                        </div>
                    ))}
                    {isTyping && (
                        <div className="message assistant">
                            <h1>Synthia</h1>
                            <strong>Synthia is typing...</strong>
                        </div>
                    )}
                </div>
                <div className="input-area">
                    <input type="text" placeholder="Enter message here" value={message} onChange={(e) => setMessage(e.target.value)} />
                    <button onClick={handleSubmitMsg}>Send</button>
                </div>
            </div>

        </div>
    </>
  )
}

export default Chat;
