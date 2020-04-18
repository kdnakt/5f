import React from 'react';
import './App.css';
import RoomSelect from './component/RoomSelect';

const App: React.FC = () => {
  return (
    <div className="App">
      <h3>5F app</h3>
      <RoomSelect />
    </div>
  );
}

export default App;
