import React, { useState, useEffect } from 'react';
import './App.css';
import axios from 'axios';

const App: React.FC = () => {
  const [room, setRoom] = useState('');
  useEffect(() => {
    axios.get('/room').then(res => {
      setRoom(res.data);
    });
  });
  return (
    <div className="App">
      <h3>5F app</h3>
      <h5>{room}</h5>
    </div>
  );
}

export default App;
