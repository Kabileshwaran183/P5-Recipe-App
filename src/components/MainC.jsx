import React from 'react';
import RecipeSection from './Recipe';
import IngredientForm from './Ingredient';
import { getRecipeFromMistral } from './ai';

export default function Main() {
    const [ingredients, setIngredients] = React.useState([]);
    const [recipe, setRecipe] = React.useState("");
    const [loading, setLoading] = React.useState(false);

    async function getRecipe() {
        setLoading(true);
        try {
            const recipeMarkdown = await getRecipeFromMistral(ingredients);
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
        if (newIngredient.trim()) {
            setIngredients((prevIngredients) => [...prevIngredients, newIngredient.trim()]);
        }
        formEl.reset();
    }

    return (
        <main className="main-container">
            {/* Ingredient Form */}
            <form onSubmit={handleSubmit} className="add-ingredient-form">
                <input
                    type="text"
                    placeholder="Enter ingredient (e.g., chicken)"
                    aria-label="Enter Ingredient"
                    name="ingredient"
                    required
                    className="ingredient-input"
                />
                <button className="add-button">Add Ingredient</button>
            </form>

            {/* Ingredient List & Recipe Button */}
            {ingredients.length > 0 && (
                <IngredientForm ingredients={ingredients} getRecipe={getRecipe} />
            )}

            {/* Loading State or Recipe */}
            {loading ? (
                <div className="loading-indicator">
                    <div className="spinner"></div>
                    <p className="loading-text">Fetching your recipe...</p>
                </div>
            ) : (
                recipe && <RecipeSection recipe={recipe} />
            )}
        </main>
    );
}
