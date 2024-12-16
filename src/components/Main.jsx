export default function Main(){
    return(
        <>
        <main>
            <form className="add-ingredient-form">
                <input type="text"
                        placeholder="enter ingredient"
                        aria-label="Enter Recipe"></input>
                <button>Add Ingredient</button>
            </form>
        </main>
        
        </>
    )
}