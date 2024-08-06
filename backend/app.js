import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";
import cors from "cors";

dotenv.config();

//?initialize express app
const PORT = process.env.PORT || 9090;
const app = express();

//? CORS options for allowing requests from specific origins
const corsOptions = {
    origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    credentials: true, // Important for cookies
  };

//? enable CORS middleware
app.use(cors(corsOptions));


//? middleware
app.use(express.json());

//?authenticate with openai using api key
const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_SECRET_KEY,
});


//?global variables
let conversationHistory = [{
    role: "system", content: "Hello, how can I help you today?"}];

//?routes
app.post("/ask", async(req, res) => {
    const userMessage = req.body.message;
    //?update conversation history with user message
    conversationHistory.push({role: "user", content: userMessage});
    try {
        const completion = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: conversationHistory
        });
            const botResponse = completion.choices[0].message.content;
             // Update conversation history with the assistant's response
            conversationHistory.push({ role: "assistant", content: botResponse });
            res.json({message: botResponse});
    } catch (error) {
        console.error("Error calling OpenAI: ", error);
        res.status(500).send("An error occurred. Please try again later.");
    }
});





app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
