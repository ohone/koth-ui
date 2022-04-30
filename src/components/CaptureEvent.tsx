import React from 'react';
import { Badge } from 'react-bootstrap';
import TruncatedAddress from './TruncatedAddress';
import './CaptureEvent.css';

export interface CaptureEvent{
    name: string,
    amount: number,
    winning: boolean
}

export function CaptureEvent(props: CaptureEvent) {
  return (
    <div className='CaptureItem'>
      <div className='addressWrapper'>
        <TruncatedAddress address={props.name}></TruncatedAddress>
      </div>
      {props.winning ? <div>👑</div> : undefined }
      <Badge bg="primary" pill>{props.amount}</Badge>
    </div>
  );
}
