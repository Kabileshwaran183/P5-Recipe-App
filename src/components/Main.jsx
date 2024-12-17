import React from 'react'
export default function Main(){
    // const ingredients = ["chicken","vegnoodles","briyani"]
    const [ingredients,setIngredients] = React.useState([])
    const ingredientsListItems =ingredients.map(i=>(
        <li key={i}>{i}</li>
    ))



    function handleSubmit(event){
        event.preventDefault()
        const formEl = event.currentTarget
        const formData = new FormData(formEl)
        const newIngredient = formData.get("ingredient")
        setIngredients(prevIngredients=>[...prevIngredients,newIngredient])
        formEl.reset()
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
            {ingredients.length>0 &&
                                    <section>
                                    <h2>Ingredients on hand:</h2>
                                    <ul className="ingredients-list" aria-live="polite">
                                        {ingredientsListItems}
                                    </ul>
                                    {ingredients.length>3 &&  
                                                            <div className="get-recipe-container">
                                                                <div>
                                                                    <h3>Ready for a recipe?</h3>
                                                                    <p>Generate a recipe from your list of ingredients.</p>
                                                                </div>
                                                                <button>Get a recipe</button>
                                                            </div>
                                    }
                                </section>
            }
        </main>
        
        </>
    )
}