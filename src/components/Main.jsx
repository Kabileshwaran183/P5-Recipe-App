import React from 'react'
export default function Main(){
    // const ingredients = ["chicken","vegnoodles","briyani"]
    const [ingredients,setIngredients] = React.useState([])
    const ingredientListItems =ingredients.map(i=>(
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
            <form onSubmit={handleSubmit} className="add-ingredient-form">
                <input type="text"
                        placeholder="enter ingredient"
                        aria-label="Enter Recipe"
                        name="ingredient" />
                <button >Add Ingredient</button>
            </form>
            <ul>
                {ingredientListItems}
            </ul>
        </main>
        
        </>
    )
}