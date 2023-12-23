import React, { useEffect, useState } from 'react';
import ShowList from './ShowList';

const UserLists = ({ userid }) => {
    const [lists, setLists] = useState([]);
    const [selectedListId, setSelectedListId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUserLists = async () => {
            try {
                const response = await fetch(`http://localhost:5002/api/userlist`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });
                const data = await response.json();
                if (Array.isArray(data.lists)) {
                    setLists(data.lists); // Assuming data.lists is an array of objects with title and listid
                } else {
                    setError('Invalid data format received from API');
                }
            } catch (error) {
                console.error('Error fetching user lists:', error);
                setError(error.message);
            }
        };
    
        fetchUserLists();
    }, [userid]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>User Lists</h2>
            {lists.map((list, index) => (
                <div key={index} onClick={() => setSelectedListId(list.listid)}>
                    <p>{list.title}</p>
                </div>
            ))}
            {selectedListId && <ShowList listid={selectedListId} />}
        </div>
    );
};

export default UserLists;