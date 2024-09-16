const App = () => {
  const course = {
    name: 'Half Stack application development',
    parts: [
      {
        name: 'Fundamentals of React',
        exercises: 10
      },
      {
        name: 'Using props to pass data',
        exercises: 7
      },
      {
        name: 'State of a component',
        exercises: 14
      }
    ]
  }

  const Header = (props) => {
    console.log(props)
    return (
      <h1>{props.course}</h1>
    )
  }

  const Content = (props) => {
    const Part = (props) => {
      console.log(props)
      return (
        <p>
          {props.part.name} {props.part.exercises}
        </p>
      )
    }

    return (
      <div>
        {
          props.parts.map(part => <Part part={part} />)
        }
      </div>
    )
  }

  const Total = (props) => {
    return (
      <p>Number of exercises {
        props.parts.reduce((carry, part) => carry + part.exercises, 0)
      }</p>
    )
  }

  return (
    <div>
      <Header course={course.name} />
      <Content parts={course.parts} />
      <Total parts={course.parts} />
    </div>
  )
}

export default App