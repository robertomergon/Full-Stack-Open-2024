const Most = ({ votes, anecdotes }) => {
    const maxVotes = Math.max(...votes)
    const mostVoted = anecdotes[votes.indexOf(maxVotes)]

    return (
        <div>
            <h2>Anecdote with most votes</h2>
            <p>{mostVoted}</p>
            <p>has {maxVotes} votes</p>
        </div>
    )
}

export default Most