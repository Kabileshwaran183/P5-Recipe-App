import { HfInference } from '@huggingface/inference';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables

const hf = new HfInference(process.env.REACT_APP_HF_ACCESS_TOKEN);

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients and suggests a recipe they could make.
Format your response in markdown.
`;

async function testAPI() {
    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1",
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: "I have chicken, rice, and onions. What recipe can I make?" },
            ],
            max_tokens: 1024,
        });

        console.log("API Response:", response.choices[0].message.content);
    } catch (err) {
        console.error("Error testing Hugging Face API:", err.message);
    }
}

testAPI();
