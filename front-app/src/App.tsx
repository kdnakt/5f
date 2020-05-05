import React from 'react';
import './App.css';
import Footer from './component/Footer';
import RoomSelect from './component/RoomSelect';

const App: React.FC = () => {
  return (
    <div className="App">
      <h3>5F app: ver{process.env.REACT_APP_VERSION}</h3>
      <RoomSelect />
      <Footer />
    </div>
  );
}

export default App;
