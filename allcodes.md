
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(

    <App />
)

App.jsx
import Header from "./components/Header"
import MainC from "./components/MainC"
function App() {
  return (
    <>
      <Header />
      <MainC />
    </>
  )
}

export default App
//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
//access token  ^


header.jsx 
export default function Header(){
    return (
        <header className="header">
            <img src="/assets/logo"></img>
            <h1>Recipe App</h1>
        </header>
            
        
    )
}

ingredient.jsx 
export default function IngredientForm(props) {
    const ingredientsListItems = props.ingredients.map(i => (
        <li key={i}>{i}</li>
    ));

    return (
        <section>
            <h2>Ingredients on hand:</h2>
            <ul className="ingredients-list" aria-live="polite">
                {ingredientsListItems}
            </ul>
            {props.ingredients.length > 3 &&
                <div  className="get-recipe-container">
                    <div   >
                        <h3>Ready for a recipe?</h3>
                        <p>Generate a recipe from your list of ingredients.</p>
                    </div>
                    <button onClick={props.getRecipe}>Get a recipe</button>
                </div>
            }
        </section>
    );
}

MainC.jsx 
import React from 'react';
import RecipeSection from './Recipe';
import IngredientForm from './Ingredient';
import { getRecipeFromMistral } from './ai';

export default function Main() {
    const [ingredients, setIngredients] = React.useState([]);
    const [recipe, setRecipe] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [progress, setProgress] = React.useState(0);
    const recipeSection = React.useRef(null); // Ref to scroll to
    const loadingSectiion = React.useRef(null);

    React.useEffect(() => {
        if (recipe !== "" && recipeSection.current !== null) {
            recipeSection.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [recipe]); // This effect runs when the `recipe` is updated

    React.useEffect(() => {
        if (loading) {
            loadingSectiion.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [loading]);
    
    async function getRecipe() {
        setLoading(true);
        setProgress(0);
        try {
            const interval = setInterval(() => {
                setProgress((prev) => {
                    const newProgress = prev + 2.82;
                    return newProgress < 90 ? parseFloat(newProgress.toFixed(2)) : 90;
                });
            }, 300);

            const recipeMarkdown = await getRecipeFromMistral(ingredients);

            clearInterval(interval);
            setProgress(100);
            setRecipe(recipeMarkdown);
        } catch (error) {
            console.error("Error fetching recipe:", error);
            setRecipe("Failed to fetch the recipe. Please try again.");
        } finally {
            setLoading(false);
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        const formEl = event.currentTarget;
        const formData = new FormData(formEl);
        const newIngredient = formData.get("ingredient");
        setIngredients((prevIngredients) => [...prevIngredients, newIngredient]);
        formEl.reset();
    }

    return (
        <main>
            <form onSubmit={handleSubmit} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="Enter ingredient"
                    aria-label="Enter Recipe"
                    name="ingredient"
                    required
                />
                <button>Add Ingredient</button>
            </form>
            {ingredients.length > 0 && (
                <IngredientForm ingredients={ingredients} getRecipe={getRecipe} />
            )}

            {loading ? (
                <div className="loading-indicator">
                    <div className="progress-bar" ref={loadingSectiion}>
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p>Preparing Recipe... {progress}%</p>
                </div>
            ) : (
                recipe && (
                    <div ref={recipeSection}>
                        <RecipeSection recipe={recipe} />
                    </div>
                )
            )}
        </main>
    );
}

Recipe.jsx 
import ReactMarkdown from "react-markdown"

export default function RecipeSection(props) {
    return (
        <section className="suggested-recipe-container">
            <h1>Recipe App Recommends:</h1>
            <ReactMarkdown>{props.recipe}</ReactMarkdown>
        </section>
    )
} 

ai.js 
import { HfInference } from '@huggingface/inference';

const hf = new HfInference(process.env.REACT_APP_HF_ACCESS_TOKEN); // Make sure .env is correctly configured

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

.env 
REACT_APP_HF_ACCESS_TOKEN=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

package.json
{
    "name": "recipe",
    "private": true,
    "version": "0.0.0",
    "type": "module",
    "scripts": {
      "dev": "vite",
      "build": "vite build",
      "lint": "eslint .",
      "preview": "vite preview"
    },
    "dependencies": {
      "@huggingface/inference": "^2.8.1",
      "dotenv": "^16.4.7",
      "react": "^18.3.1",
      "react-dom": "^18.3.1",
      "react-markdown": "^9.0.1"
    },
    "devDependencies": {
      "@eslint/js": "^9.15.0",
      "@types/react": "^18.3.12",
      "@types/react-dom": "^18.3.1",
      "@vitejs/plugin-react": "^4.3.4",
      "eslint": "^9.15.0",
      "eslint-plugin-react": "^7.37.2",
      "eslint-plugin-react-hooks": "^5.0.0",
      "eslint-plugin-react-refresh": "^0.4.14",
      "globals": "^15.12.0",
      "vite": "^6.0.1"
    }
  }
  index.css 
  * {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

body {
  font-family: 'Inter', sans-serif;
  background-color: #f5f7fa;
  color: #333;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  line-height: 1.6;
}

header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 40px;
  background-color: #ffffff;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  width: 100%;
  position: sticky;
  top: 0;
  z-index: 10;
}

header > img {
  width: 50px;
  transition: transform 0.3s ease-in-out;
}

header > img:hover {
  transform: scale(1.1) rotate(10deg);
}

header > h1 {
  font-size: 2rem;
  font-weight: bold;
  color: #2c3e50;
  text-transform: uppercase;
  flex-grow: 1;
  text-align: center;
}

main {
  width: 100%;
  max-width: 900px;
  padding: 20px;
  margin: 20px auto;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

main > section {
  margin: 20px 0;
}

main > section > ul {
  list-style: none;
  padding: 0;
}

main > section > ul > li {
  margin-bottom: 10px;
  font-size: 1rem;
  color: #555;
  padding: 10px;
  background-color: #f9f9f9;
  border-radius: 6px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
}

.add-ingredient-form {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-top: 30px;
  justify-content: center;
}

.add-ingredient-form > input {
  flex: 1;
  min-width: 480px;
  max-width: 600px;
  padding: 12px 15px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  transition: all 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.add-ingredient-form > input:focus {
  border-color: #4a90e2;
  box-shadow: 0 0 10px rgba(74, 144, 226, 0.4);
  outline: none;
}

.add-ingredient-form > button {
  background-color: #4a90e2;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 12px 20px;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s ease-in-out, background-color 0.3s ease;
}

.add-ingredient-form > button:hover {
  background-color: #357ab9;
  transform: translateY(-2px);
}

.get-recipe-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background-color: #ffe4d4;
  border-radius: 8px;
  padding: 15px 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin-top: 30px;
  animation: fadeIn 0.6s ease-out;
}

.get-recipe-container > button {
  background-color: #e36e2a;
  color: #fff;
  border: none;
  border-radius: 6px;
  padding: 10px 15px;
  font-size: 1rem;
  cursor: pointer;
  transition: transform 0.3s ease, background-color 0.3s ease;
}

.get-recipe-container > button:hover {
  background-color: #bf5c1e;
  transform: translateY(-2px);
}

.suggested-recipe-container {
  max-width: 600px;
  background-color: #ffffff;
  padding: 20px 30px;
  border-radius: 10px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  overflow-wrap: break-word;
  word-wrap: break-word;
  word-break: break-word;
  color: #333;
  line-height: 1.8;
  font-size: 1.125rem;
  margin-top: 20px;
  animation: fadeInUp 0.5s ease-in-out;
  border: 1px solid #ececec;
}

.recipe-title {
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 15px;
  color: #007bff;
  text-align: center;
  border-bottom: 2px solid #ececec;
  padding-bottom: 10px;
}

.recipe-content {
  margin-top: 15px;
  color: #495057;
  font-size: 1.1rem;
}

.recipe-content p {
  margin-bottom: 12px;
  line-height: 1.6;
}

.recipe-content ul {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  padding: 0;
  margin-top: 10px;
}

.recipe-content ul li {
  background-color: #e8f5e9;
  color: #2e7d32;
  padding: 8px 12px;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  list-style: none;
  font-size: 1rem;
}

.recipe-content strong {
  font-weight: bold;
  color: #333;
}

.recipe-content em {
  font-style: italic;
  color: #555;
}

@keyframes fadeInUp {
  from {
      opacity: 0;
      transform: translateY(20px);
  }
  to {
      opacity: 1;
      transform: translateY(0);
  }
}

@keyframes fadeIn {
  from {
      opacity: 0;
      transform: translateY(20px);
  }
  to {
      opacity: 1;
      transform: translateY(0);
  }
}

.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 6px solid #e0e0e0;
  border-top-color: #007bff;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

.loading-text {
  margin-top: 10px;
  font-size: 1rem;
  color: #555;
  font-weight: 500;
}

@keyframes spin {
  from {
      transform: rotate(0deg);
  }
  to {
      transform: rotate(360deg);
  }
}

@media (max-width: 768px) {
  header {
      padding: 15px 20px;
  }

  header > h1 {
      font-size: 1.5rem;
  }

  .add-ingredient-form {
      flex-direction: column;
      align-items: stretch;
  }

  .add-ingredient-form > button {
      max-width: 100%;
  }
}
.loading-indicator {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin: 20px 0;
  width: 100%;
}

.progress-bar {
  width: 80%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
  margin-bottom: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.progress-bar-fill {
  height: 100%;
  background-color: #007bff;
  transition: width 0.3s ease;
  border-radius: 5px;
}

.loading-indicator p {
  margin-top: 10px;
  font-size: 1rem;
  color: #555;
  font-weight: 500;
}

