import React, { useState } from 'react';



function UserListForm({ onClose }) { // Add onClose here
    const [listName, setListName] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch('http://localhost:5002/api/userlist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        list_name: listName
        ,created_at: new Date().toISOString() }),
      credentials: 'include',
    });

    const data = await response.json();

    if (data.status === 'success') {
        onClose();  // Close the form
      } else {
      console.error('Failed to create list');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        List Name:
        <input
          type="text"
          value={listName}
          onChange={(e) => setListName(e.target.value)}
          required
        />
      </label>
      <button type="submit">Create List</button>
      <button type="button" onClick={onClose}>Close</button>
    </form>
  );
}


export default UserListForm;