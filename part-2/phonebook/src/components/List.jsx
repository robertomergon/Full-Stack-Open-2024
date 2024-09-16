const List = ({ contacts }) => {
    return (
        <div>
            {contacts.map((contact, index) => (
                <div key={index}>
                    <p>{contact.name} <b>{contact.number}</b></p>
                </div>
            ))}
        </div>
    );
}

export default List;