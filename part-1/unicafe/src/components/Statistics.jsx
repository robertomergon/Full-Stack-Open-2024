import StatisticLine from './StatisticLine'

const Statistics = (props) => {

    const average = (props.good - props.bad) / (props.good + props.neutral + props.bad) || 0
    const total = props.good + props.neutral + props.bad
    const positive = (props.good / total) * 100 || 0

    return (
        total === 0 ? <div><h1>statistics</h1><p>No feedback given</p></div> :
            < div >
                <h1>statistics</h1>
                <table>
                    <thead>
                        <tr>
                            <th>Statistics</th>
                            <th>Value</th>
                        </tr>
                    </thead>
                    <tbody>
                        <StatisticLine text="good" value={props.good} />
                        <StatisticLine text="neutral" value={props.neutral} />
                        <StatisticLine text="bad" value={props.bad} />
                        <StatisticLine text="all" value={total} />
                        <StatisticLine text="average" value={average} />
                        <StatisticLine text="positive" value={positive + "%"} />
                    </tbody>
                </table>
            </div >
    )
}

export default Statistics