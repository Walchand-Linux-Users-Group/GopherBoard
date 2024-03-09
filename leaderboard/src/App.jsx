import { useEffect, useState } from 'react'
import './App.css'
import axios from "axios"

function extractTimeFromUTC(utcString) {
  const utcDate = new Date(utcString);
  
  if (isNaN(utcDate.getTime())) {
    return "Invalid date";
  }

  const hours = utcDate.getUTCHours();
  const minutes = utcDate.getUTCMinutes();
  const seconds = utcDate.getUTCSeconds();

  const formattedTime = `${addLeadingZero(hours)}:${addLeadingZero(minutes)}:${addLeadingZero(seconds)}`;
  return formattedTime;
}

function convertTo12HrsFormat(timeString) {
  const [hours, minutes, seconds] = timeString.split(":");
  let formattedTime = '';

  if (hours >= 12) {
    formattedTime += `${hours % 12 || 12}:${addLeadingZero(minutes)}:${addLeadingZero(seconds)} PM`;
  } else {
    formattedTime += `${hours}:${addLeadingZero(minutes)}:${addLeadingZero(seconds)} AM`;
  }

  return formattedTime;
}

function addLeadingZero(number) {
  return number < 10 ? `0${number}` : number;
}



function App() {
  const [currentData, setCurrentData] = useState([]);
  const [searchInput, setSearchInput] = useState('');


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
            return !(new Date(b.submission_timestamp) - new Date(a.submission_timestamp));
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


  // Set up an interval to call the function every 30 seconds
  const fetchDataInterval = setInterval(() => {
    fetchData();
  }, 30000);

  const handleSearch = () => {
    // Filter the leaderboard based on the search input
    const filteredData = currentData.filter(item => item.github_username.includes(searchInput));

    // Update the state with the filtered data
    setCurrentData(filteredData);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
    <div className='nav'>
      <div className='Logo'>
        <img src='https://res.cloudinary.com/dcglxmssd/image/upload/v1710003005/image_oisati.png' alt='wlug'/>
      </div>
      <div className='Single'>
        <img src='https://res.cloudinary.com/dcglxmssd/image/upload/v1710006581/Group_6_2_icsj5b.png' alt='gopherboard'/> 
      </div>
    </div>
    <div id='middle' className='wrapper'>
        <div className='Search'>
          <p>Search Your Rank</p>
          <input
            type='text'
            value={searchInput}
            placeholder='Enter your github ID'
            onChange={(e) => setSearchInput(e.target.value)}
          />
          <button onClick={handleSearch}>search</button>
        </div>
      </div>
    <div className='wrapper'>
      <div className='Leaderboard'>
        <div className='Heads'>
          <div className='InfoContainer'>
            <h3>Rank</h3>
          </div>
          <div className='InfoContainer'>
            <h3>Username</h3>
          </div>
          <div className='InfoContainer'>
            <h3>Points</h3>
          </div>
          <div className='InfoContainer'>
            <h3>Timestamp</h3>
          </div>
        </div>
        <div className='container'>    
        {currentData[0]==undefined?"Data Not Found!":""}      
          {currentData.map((item, idx) => (
            <div className='Heads' key={idx}>
               <div className='InfoContainer'>
                  <ph3>{idx + 1}</ph3>
                </div>
               <div className='InfoContainer'>
                  <p>{item.github_username}</p>
                </div>
               <div className='InfoContainer'>
                  <p>🪙 {item.points_awarded} </p>
                </div>
               <div className='InfoContainer'>
                  <p>{extractTimeFromUTC(item.submission_timestamp)}</p>
                </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </>
  );
}

export default App;
