import React, { useState, useCallback, FormEvent, createRef, RefObject, useEffect } from 'react';
import {
  Button, FormGroup, FormControl, Form, FormLabel, Row, Col,
} from 'react-bootstrap';
import axios from 'axios';
import { FingerType, Session } from '../App';

function validateRoomId(roomIdInput: string) {
  if (isNaN(Number(roomIdInput))) {
    return 'Only digits allowed.';
  } else if (roomIdInput.length < 6) {
    return '6 digits needed.';
  } else {
    return '';
  }
}

type Props = {
  setSession: (s: Session) => void
}

const RoomSelect: React.FC<Props> = ({setSession}) => {
  const [nickName, setNickName] = useState('');
  const [roomIdInput, setRoomIdInput] = useState('');
  const [roomNotExists, setRoomNotExists] = useState(false);
  const [fingerType, setFingerType] = useState<FingerType>('finger');

  const create = useCallback(() => {
    axios.post(`${process.env.REACT_APP_API_URL}/api/rooms/new`, {
      type: fingerType,
    }).then(res => setSession({
      roomId: res.data.roomId,
      sessionId: res.data.sessionId,
      fingerType: res.data.type,
      nickName: nickName,
    }));
  }, [fingerType, nickName, setSession]);
  const enter = useCallback(() => {
    axios.get(`${process.env.REACT_APP_API_URL}/api/rooms?id=${roomIdInput}`).then(res => setSession({
      roomId: res.data.roomId,
      sessionId: res.data.sessionId,
      fingerType: res.data.type,
      nickName: nickName,
    })).catch(_ => setRoomNotExists(true));
  }, [roomIdInput, nickName, setSession]);
  const [roomIdFeedback, setRoomIdFeedback] = useState('');
  const roomIdRef = createRef<HTMLInputElement>();
  useEffect(() => {
    if (roomIdRef.current) {
      const result = roomNotExists ? `Room ${roomIdInput} doesn't exist.`
        : validateRoomId(roomIdInput);
      setRoomIdFeedback(result);
      roomIdRef.current!.setCustomValidity(result);
    }
  }, [roomIdInput, roomIdRef, roomNotExists]);

  return (
    <div style={{
      width: '80%',
      margin: '0 auto',
    }}>
      <Form validated>
        <FormGroup style={{width: '160px', margin: '8px auto'}}>
          <FormLabel>Enter Your NickName</FormLabel>
          <FormControl value={nickName}
            style={{
              textAlign: 'center'
            }}
            onChange={(e: FormEvent<HTMLInputElement>) => {
              setNickName(e.currentTarget.value);
            }}
            required
            maxLength={10}
          />
          <FormControl.Feedback type='invalid'>
            Required
          </FormControl.Feedback>
        </FormGroup>
      </Form>
      <hr />
      <Form style={{
          width: '160px',
          margin: '16px auto',
        }}
        validated={!!roomIdInput}
      >
        <FormGroup>
          <FormLabel>Enter Room ID</FormLabel>
          <FormControl value={roomIdInput}
            style={{
              textAlign: 'center'
            }}
            ref={roomIdRef as RefObject<any>}
            onChange={(e: FormEvent<HTMLInputElement>) => {
              setRoomIdInput(e.currentTarget.value);
              if (roomNotExists) setRoomNotExists(false);
            }}
            placeholder='123456'
            pattern='[0-9]{6}'
            maxLength={6}
          />
          <FormControl.Feedback type='invalid'>
            {roomIdFeedback}
          </FormControl.Feedback>
        </FormGroup>
        <Button variant='outline-primary'
          onClick={enter}
          disabled={!roomIdInput || roomNotExists || !nickName}
        >
          Enter the Room
        </Button>
      </Form>
      <Form style={{
          width: '160px',
          margin: '0 auto',
          padding: '16px 0',
        }}
      >
        <FormGroup as={Row}>
          <Col sm={10}>
            <Form.Check value={fingerType}
              type='radio' custom
              checked={fingerType === 'finger'}
              onChange={() => setFingerType('finger')}
              name='finger-type'
              id='finger-type-finger'
              style={{float: 'left', margin: '0 8px'}}
              label='Finger 🖐'
            />
            <Form.Check value={fingerType}
              type='radio' custom
              checked={fingerType === 'like'}
              onChange={() => setFingerType('like')}
              name='finger-type'
              id='finger-type-like'
              style={{float: 'left', margin: '0 8px'}}
              label='Like ❤️'
            />
          </Col>
        </FormGroup>
        <Button style={{
            margin: '16px auto',
            width: '160px',
          }}
          variant='outline-primary' onClick={create}
          disabled={!nickName}
        >
          Create New Room
        </Button>
      </Form>
    </div>
  );
};

export default RoomSelect;
