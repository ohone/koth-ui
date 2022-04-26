import React, { useEffect, useState } from 'react';
import { Card, ListGroup, Placeholder } from 'react-bootstrap';
import { IChainContext } from '../ChainContext';
import {HistoryItem, HistoryItemProps} from './HistoryItem';

interface HistoryProps{
    hidden: boolean,
    context: IChainContext
}

function History(props: HistoryProps) {

    var [items, setItems] = useState<HistoryItemProps[]>();

    useEffect(() => {
        if (items === undefined){
            props.context.getCaptures().then(s => {setItems(s);});
        }
    });
    
    return (
        <div className='History' hidden={props.hidden}>
            {items !== undefined ? renderItems(items) : loading()}
        </div>
    );
}

function renderItems(items: HistoryItemProps[]){
    return  (<ListGroup className='list' variant="flush">
                {items.map((item,idx) => 
                <ListGroup.Item key={idx}>
                    <HistoryItem 
                        name={item.name} 
                        amount={item.amount} 
                        winning={items[idx + 1] !== undefined && items[idx + 1].amount < item.amount}/>
                </ListGroup.Item>)}
            </ListGroup>);
}

function loading(){
    return (
    <div>
    <Placeholder as={Card.Title} animation="glow">
            <Placeholder xs={6} />
        </Placeholder>
        <Placeholder as={Card.Text} animation="glow">
            <Placeholder xs={7} /> <Placeholder xs={4} /> <Placeholder xs={4} />{' '}
            <Placeholder xs={6} /> <Placeholder xs={8} />
        </Placeholder>
    </div>
        )
}

export default History;
