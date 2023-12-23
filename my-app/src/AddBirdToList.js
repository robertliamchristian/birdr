// AddBirdToList.js
import React, { useState } from 'react';

const AddBirdToList = ({ listid, onAddBird }) => {
    const [birdName, setBirdName] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await fetch('http://localhost:5002/api/sightings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    birdname: birdName,
                    listid: listid,  // Include listid in the request body
                }),
                credentials: 'include',
            });
            if (response.ok) {
                const newSighting = await response.json();
                console.log('New sighting added:', newSighting);
                setBirdName('');  // Clear the input field
                onAddBird();  // Call the callback function
            } else {
                console.error('Failed to add sighting');
            }
        } catch (error) {
            console.error('Error adding bird to list:', error);
        }
        
    };

    

    return (
        <form onSubmit={handleSubmit}>
            <label>
                Bird name:
                <input type="text" value={birdName} onChange={(e) => setBirdName(e.target.value)} required />
            </label>
            <button type="submit">Add Bird</button>
        </form>
    );
};

export default AddBirdToList;