import React from 'react';
import RecipeSection from './Recipe';
import IngredientForm from './Ingredient';
import { getRecipeFromMistral } from './ai';

export default function Main() {
    const [ingredients, setIngredients] = React.useState([]);
    const [recipe, setRecipe] = React.useState("");
    const [loading, setLoading] = React.useState(false);
    const [progress, setProgress] = React.useState(0);

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
                    <div className="progress-bar">
                        <div
                            className="progress-bar-fill"
                            style={{ width: `${progress}%` }}
                        ></div>
                    </div>
                    <p>Preparing Recipe... {progress}%</p>
                </div>
            ) : (
                recipe && <RecipeSection recipe={recipe} />
            )}
        </main>
    );
}
