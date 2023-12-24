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
                    setLists(data.lists);
                    setSelectedListId(data.lists[0]?.listid); // Set the first list as the default selected list
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
            <h4>User Lists</h4>
            <select onChange={(e) => setSelectedListId(e.target.value)}>
                {lists.map((list, index) => (
                    <option key={index} value={list.listid}>
                        {list.title}
                    </option>
                ))}
            </select>
            {selectedListId && <ShowList listid={selectedListId} />}
        </div>
    );
};

export default UserLists;