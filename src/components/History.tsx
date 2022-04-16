import React from 'react';
import { ListGroup } from 'react-bootstrap';
import {HistoryItem, HistoryItemProps} from './HistoryItem';

interface HistoryProps{
    hidden: boolean,
    items: HistoryItemProps[]
}

function History(props: HistoryProps) {
  return (
    <div className='History' hidden={props.hidden}>
    <ListGroup variant="flush">
        {props.items.map(item => 
            <ListGroup.Item key={item.amount + item.name}>
                <HistoryItem name={item.name} amount={item.amount}/>
            </ListGroup.Item>)}
    </ListGroup>
    </div>
  );
}

export default History;
