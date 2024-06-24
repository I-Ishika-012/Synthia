import dotenv from "dotenv";
import express from "express";
import OpenAI from "openai";

dotenv.config();

//?authenticate with openai using api key
const openai = new OpenAI({
    apiKey: process.env.OPEN_AI_SECRET_KEY,
});

//?initialize express app
const PORT = process.env.PORT || 9090;
const app = express();

//? middleware
app.use(express.json());

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
        }).then((res) => {
            const botResponse = completion.choices[0].message.content;
            res.json({message: botResponse});
        });
    } catch (error) {
        res.status(500).send("An error occurred. Please try again later.");
    }
});





app.listen(PORT, () => console.log(`Listening on port ${PORT}`));