import React from 'react';
import './App.css';
import RoomSelect from './component/RoomSelect';

const App: React.FC = () => {
  return (
    <div className="App">
      <h3>5F app</h3>
      <RoomSelect />
      <footer style={{
        width: '100%',
        position: 'absolute',
        bottom: 0,
        height: '60px',
        lineHeight: '60px',
        backgroundColor: '#f5f5f5'
      }}>
        Copyright © 2020 <a href='https://twitter.com/kdnakt'>kdnakt</a>
      </footer>
    </div>
  );
}

export default App;
