import ReactMarkdown from "react-markdown"

export default function RecipeSection(props) {
    return (
        <section className="suggested-recipe-container">
            <h1>Recipe App Recommends:</h1>
            <ReactMarkdown>{props.recipe}</ReactMarkdown>
        </section>
    )
} 