import React from 'react';
import RecipeSection from './Recipe';
import IngredientForm from './Ingredient';
import { getRecipeFromMistral } from './ai';


export default function Main() {
    const [ingredients, setIngredients] = React.useState([]);
    const [recipe, setRecipe] = React.useState("");
    const [loading, setLoading] = React.useState(false); // New state for loading

    async function getRecipe() {
        setLoading(true); // Set loading to true
        try {
            const recipeMarkdown = await getRecipeFromMistral(ingredients);
            setRecipe(recipeMarkdown);
        } catch (error) {
            console.error("Error fetching recipe:", error);
            setRecipe("Failed to fetch the recipe. Please try again.");
        } finally {
            setLoading(false); // Set loading to false when done
        }
    }

    function handleSubmit(event) {
        event.preventDefault();
        const formEl = event.currentTarget;
        const formData = new FormData(formEl);
        const newIngredient = formData.get("ingredient");
        setIngredients(prevIngredients => [...prevIngredients, newIngredient]);
        formEl.reset();
    }

    return (
        <main>
            <form onSubmit={handleSubmit} className="add-ingredient-form">
                <input type="text"
                    placeholder="enter ingredient"
                    aria-label="Enter Recipe"
                    name="ingredient" required />
                <button >Add Ingredient</button>
            </form>
            {ingredients.length > 0 && (
                <IngredientForm ingredients={ingredients} getRecipe={getRecipe} />
            )}
             {loading ? ( // Show loading state
                    <p>Loading recipe...</p>
                ) : (
                    recipe && <RecipeSection recipe={recipe} />
                )}

        </main>
    );
}
