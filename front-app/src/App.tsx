import React from 'react';
import './App.css';
import RoomSelect from './component/RoomSelect';
import Footer from './component/Footer';

const App: React.FC = () => {
  return (
    <div className="App">
      <h3>5F app</h3>
      <RoomSelect />
      <Footer />
    </div>
  );
}

export default App;
