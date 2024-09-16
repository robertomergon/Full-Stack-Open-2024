const List = ({ contacts, deleteContact }) => {
    return (
        <div>
            {contacts.map((contact, index) => (
                <div key={index}>
                    <p>
                        {contact.name}
                        <b>{contact.number}</b>
                        <button onClick={() => deleteContact(contact.id)}>Delete</button>
                    </p>
                </div>
            ))}
        </div>
    );
}

export default List;