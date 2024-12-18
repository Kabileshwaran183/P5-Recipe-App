import React from 'react'
import RecipeSection from './recipeSection'
import IngredientForm from './ingredientForm'
export default function Main(){
    // const ingredients = ["chicken","vegnoodles","briyani"]
    const [ingredients,setIngredients] = React.useState([])


    const [recipeShown,setRecipeShown] = React.useState(false)


    function handleSubmit(event){
        event.preventDefault()
        const formEl = event.currentTarget
        const formData = new FormData(formEl)
        const newIngredient = formData.get("ingredient")
        setIngredients(prevIngredients=>[...prevIngredients,newIngredient])
        formEl.reset()
    }

    function handleRecipeShown(){
        setRecipeShown(prevShown=>!prevShown)
    }

/*----action = {handleSubmit} its not working
    function handleSubmit(formData){
        const newIngredient = formData.get("ingredient")
        setIngredients(prevIngredients=>[...prevIngredients,newIngredient])
        formEl.reset()
    }
*/
    return(
        <>
        <main>
            <form onSubmit={handleSubmit} className="add-ingredient-form" >
                <input type="text"
                        placeholder="enter ingredient"
                        aria-label="Enter Recipe"
                        name="ingredient"  required/>
                <button >Add Ingredient</button>
            </form>
            {ingredients.length>0 && <IngredientForm ingredients={ingredients}
                                                        handleRecipeShown={handleRecipeShown}/>}
            {recipeShown && <RecipeSection />}
        </main>
        
        </>
    )
}