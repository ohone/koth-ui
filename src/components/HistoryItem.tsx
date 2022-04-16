import React from 'react';
import { Badge } from 'react-bootstrap';

export interface HistoryItemProps{
    name: string,
    amount: number
}

export function HistoryItem(props: HistoryItemProps) {
  return (
    <div className='HistoryItem'>
      <a>{props.name}</a>
      <Badge bg="primary" pill>{props.amount}</Badge>
    </div>
  );
}
