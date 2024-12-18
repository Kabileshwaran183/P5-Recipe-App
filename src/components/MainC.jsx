import React from 'react';
import RecipeSection from './recipeSection';
import IngredientForm from './ingredientForm';
import { getRecipeFromMistral } from './ai';


export default function Main() {
    const [ingredients, setIngredients] = React.useState([]);
    const [recipe, setRecipe] = React.useState("");

    async function getRecipe() {
            const recipeMarkdown = await getRecipeFromMistral(ingredients);
            setRecipe(recipeMarkdown);
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
            {recipe && <RecipeSection recipe={recipe} />}

        </main>
    );
}
