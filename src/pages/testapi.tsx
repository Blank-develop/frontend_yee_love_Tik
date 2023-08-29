import React, { useState, useEffect } from 'react';

type Character = {
  id: number;
  description: string;
  animal: string;
};

function TestApi() {
  const [apiData, setApiData] = useState<Character[]>([]);

  useEffect(() => {
    // Fetch data from the API endpoint
    fetch('https://characterapi.ticwoc.repl.co/api/choice') // Make sure this URL matches your server
      .then(response => response.json())
      .then(data => {
        setApiData(data);
      })
      .catch(error => {
        console.error('Error fetching data:', error);
      });
  }, []);

  return (
    <div>
      <h2>API Data:</h2>
      <ul>
        {apiData.map(character => (
          <li key={character.id}>
            ID: {character.id}, Description: {character.description}, Animal: {character.animal}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TestApi;
