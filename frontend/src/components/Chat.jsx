import { useMutation } from '@tanstack/react-query'
import React from 'react'
import axios from 'axios'

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
        mutationKey: 'chatbot',
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
            <h1 className="title">AI Chatbot</h1>
        </div>
    </>
  )
}

export default Chat