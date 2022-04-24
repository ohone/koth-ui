import React from 'react';
import { Badge } from 'react-bootstrap';
import Address from './Address';
import './HistoryItem.css';

export interface HistoryItemProps{
    name: string,
    amount: number,
    winning: boolean
}

export function HistoryItem(props: HistoryItemProps) {
  return (
    <div className='HistoryItem'>
      <div className='addressWrapper'>
        <Address address={props.name}></Address>
      </div>
      {props.winning ? <div>👑</div> : undefined }
      <Badge bg="primary" pill>{props.amount}</Badge>
    </div>
  );
}
