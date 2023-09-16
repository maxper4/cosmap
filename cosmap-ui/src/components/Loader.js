import "./Loader.css";

function Loader({title}) {
    return (
        <>
        <div className="ring"></div>
        <h1>{title}</h1>
        </>
    );
}

export default Loader;