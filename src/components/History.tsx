import React, { useEffect, useState } from 'react';
import { ListGroup } from 'react-bootstrap';
import { IChainContext } from '../ContractContext';
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
    return <div className='loading'>loading</div>
}

export default History;
