import { HfInference } from '@huggingface/inference';

const hf = new HfInference(import.meta.env.VITE_REACT_APP_HF_ACCESS_TOKEN); // Use the updated VITE_ prefix

const SYSTEM_PROMPT = `
You are an assistant that receives a list of ingredients that a user has and suggests a recipe they could make with some or all of those ingredients. You don't need to use every ingredient they mention in your recipe. The recipe can include additional ingredients they didn't mention, but try not to include too many extra ingredients. Format your response in markdown to make it easier to render to a web page.
`;

export async function getRecipeFromMistral(ingredientsArr) {
    const ingredientsString = ingredientsArr.join(", ");
    console.log("Ingredients provided:", ingredientsString); // Log the ingredients

    try {
        const response = await hf.chatCompletion({
            model: "mistralai/Mixtral-8x7B-Instruct-v0.1", // Ensure this is the correct model name
            messages: [
                { role: "system", content: SYSTEM_PROMPT },
                { role: "user", content: `I have ${ingredientsString}. Please give me a recipe you'd recommend I make!` },
            ],
            max_tokens: 1024,
        });

        console.log("API Response:", response); 
        if (response.choices && response.choices.length > 0) {
            return response.choices[0].message.content;
        } else {
            throw new Error("No valid recipe found in the API response.");
        }
    } catch (err) {
        console.error("Error in getRecipeFromMistral:", err.message);
        throw err; 
    }
}
