const Total = (props) => {
    return (
        <b>Total of {
            props.parts.reduce((carry, part) => carry + part.exercises, 0)
        }
            &nbsp;exercises
        </b>
    )
}

export default Total