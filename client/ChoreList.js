import React, { useEffect, useState } from 'react';
import axios from 'axios';

const ChoreList = () => {
  const [chores, setChores] = useState([]);

  useEffect(() => {
    const fetchChores = async () => {
      const response = await axios.get('http://localhost:5500/api/chores');
      setChores(response.data);
    };

    fetchChores();
  }, []);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">Chores List</h1>
      <ul>
        {chores.map(chore => (
          <li key={chore._id} className="border-b p-2">
            {chore.title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ChoreList;
