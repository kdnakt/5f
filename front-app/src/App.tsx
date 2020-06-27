import React, { useState } from 'react';
import './App.css';
import Footer from './component/Footer';
import RoomSelect from './component/RoomSelect';
import Room from './component/Room';
import AppTitle from './component/AppTitle';
import { FingerType } from './data/Fingers';

export type Session = {
  roomId: string,
  sessionId: string,
  fingerType: FingerType,
  nickName: string,
}

const initialSession: Session = {
  roomId: '',
  sessionId: '',
  fingerType: 'finger',
  nickName: '',
}

const App: React.FC = () => {
  const [session, setSession] = useState<Session>(initialSession);
  return (
    <div className="App">
      <AppTitle />
      {session.roomId && session.sessionId ?
        <Room session={session} /> :
        <RoomSelect setSession={setSession} />}
      <Footer />
    </div>
  );
}

export default App;
