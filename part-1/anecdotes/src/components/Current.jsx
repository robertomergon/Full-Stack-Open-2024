const Current = ({ current, points, selected }) => {

    function getDate() {
        const date = new Date();
        return date.toDateString();
    }

    return (
        <div>
            <h2>Anecdote of the day: {getDate()}</h2>
            <p>{current}</p>
            <p>has {points[selected]} votes</p>
        </div>
    );
}

export default Current;