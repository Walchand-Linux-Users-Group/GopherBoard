import { useEffect, useState } from 'react'
import './App.css'
import axios from "axios"

function App() {
  const [currentData, setCurrentData] = useState([])

  const fetchData = () => {
    const apiUrl = 'https://api.github.com/assignments/553687/grades';

    const headers = {
      'Accept': 'application/vnd.github+json',
      'Authorization': 'Bearer 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',
      'X-GitHub-Api-Version': '2022-11-28',
    };

    axios.get(apiUrl, { headers })
      .then(response => {
        // Handle the response data here
        const sortedArray = response.data.sort((a, b) => {
          // Compare points_awarded first
          const pointsComparison = parseInt(b.points_awarded) - parseInt(a.points_awarded);

          // If points_awarded is the same, compare submission_timestamp
          if (pointsComparison === 0) {
            return new Date(b.submission_timestamp) - new Date(a.submission_timestamp);
          }

          return pointsComparison;
        });

        setCurrentData(sortedArray.slice(0, 10)); // Show only the top 10 items
        console.log("got it");
      })
      .catch(error => {
        // Handle errors here
        console.error(error);
      });
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Set up an interval to call the function every 30 seconds
  const fetchDataInterval = setInterval(() => {
    fetchData();
  }, 30000);

  return (
    <>
      <div className='Leaderboard'>
        <h2>GopherBoard</h2>
        <div className='Heads'>
          <h3>Rank</h3>
          <h3>UserName</h3>
          <h3>Points</h3>
        </div>
        <div>
          {currentData.map((item, idx) => (
            <div className='Heads' key={idx}>
              <p>{idx + 1}</p>
              <p>{item.github_username}</p>
              <p>{item.points_awarded}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

export default App;
