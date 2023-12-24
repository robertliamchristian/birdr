// ShowList.js
import React, { useEffect, useState } from 'react';
import AddBirdToList from './AddBirdToList';

const ShowList = ({ listid }) => {
    const [birds, setBirds] = useState([]);
    const [error, setError] = useState(null);
    const [refresh, setRefresh] = useState(false);  // Add this line

    const fetchBirds = async () => {
        try {
            const response = await fetch(`http://localhost:5002/api/user_sighting?listid=${listid}`, {
                method: 'GET',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            if (Array.isArray(data.birds)) {
                setBirds(data.birds);
            } else {
                setError('Invalid data format received from API');
            }
        } catch (error) {
            console.error('Error fetching birds:', error);
            setError(error.message);
        }
    };

    useEffect(() => {
        fetchBirds();
    }, [listid, refresh]);  // Add refresh to the dependency array

    const handleAddBird = () => {
        setRefresh(!refresh);  // Toggle refresh state when a new bird is added
    };

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <AddBirdToList listid={listid} onAddBird={handleAddBird} />

            {birds.map((bird, index) => (
                <div key={index}>
                    <p>{bird}</p>
                </div>
            ))}
        </div>
    );
};

export default ShowList;