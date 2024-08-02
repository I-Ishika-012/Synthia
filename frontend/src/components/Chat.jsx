import { useMutation } from '@tanstack/react-query'
import React from 'react'
import axios from 'axios'
import {getImageUrl} from '../utils'

//function to send message
const sendMsgAPI = async (msg) => {
    const res = await axios.post('http://localhost:9090/ask', msg)
    return res.data
}


const Chat = () => {
    const [message, setMessage] = useState('')
    const [isTyping, setIsTyping] = useState(false)
    const [conversation, setConversation] = useState([{role: 'assistant', content: 'Hello, how can I help you today?'}])

    //useMutation hook to send message
    const mutation = useMutation({
        mutationFn: sendMsgAPI, 
        mutationKey: ['chatbot'],
        onSuccess: (data) => {
            setConversation((prevConversation) => [...prevConversation, {role: 'assistant', content: data.message}])
            setMessage('')
            setIsTyping(false)
        }
    })

    //handle submit
    const handleSubmitMsg = (e) => {
        e.preventDefault()
        const currentMsg = message.trim()
        if(!currentMsg) {alert('Please enter a message'); return}
        setConversation((prevConversation) => [...prevConversation, {role: 'user', content: currentMsg}])
        setIsTyping(true)
        setMessage('')
        mutation.mutate({message: currentMsg})
    }

  return (
    <>
        <div className="header">
        <img src={getImageUrl("/frontend/public/synthia.png")} alt="Synthia" />
            <h1 className="title">AI Chatbot</h1>
            <p className="description">Enter your message in the input below to chat with the Synthia AI.</p>
            <div className="data-container">
                <div className="conversation">
                    {conversation.map((entry, index) => (
                        <div className={`message ${entry.role}`} key={index}>
                            <strong>{entry.role === 'user' ? 'You: ' : 'Synthia: '}
                                {entry.content}
                            </strong>
                        </div>
                    ))}
                </div>
            </div>

        </div>
    </>
  )
}

export default Chat
