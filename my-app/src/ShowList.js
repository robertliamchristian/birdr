import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ShowList = ({ listid }) => {
    console.log('Rendering ShowList with listid:', listid); // Add this line

    const [birds, setBirds] = useState([]);
    const [error, setError] = useState(null);

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
    }, [listid]);

    if (error) {
        return <div>Error: {error}</div>;
    }

    return (
        <div>
            <h2>Birds in List {listid}</h2>
            {birds.map((bird, index) => (
                <div key={index}>
                    <p>{bird}</p>
                </div>
            ))}
        </div>
    );
};

export default ShowList;