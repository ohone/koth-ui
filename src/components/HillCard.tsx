import { Nav } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import "./HillCard.css";
import History from './History';
import React, { useState } from 'react';
import CurrentHill from './CurrentHill';
import { IChainContext } from '../ContractContext';
import Factory from './Factory';

type cardState = "current" | "history" | "factory";

interface HillCardProps{
    chainContext: IChainContext
}

export interface HillState{
    king: string,
    value: number,
    expiry: number,
    captured: boolean,
    allowance: number
}

function HillCard(props: HillCardProps) {
    
    const [cardState, setCardState] = useState<cardState>('current');

    return (
        <div className='HillCard'>
            <Card style={{ width: '32rem', height:'40rem' }} border="secondary">
            <Card.Header>
                <Nav variant="tabs">
                    <Nav.Item>
                        <Nav.Link onClick={() => setCardState("current")}>Current Hill</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link onClick={() => setCardState("history")}>History</Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                        <Nav.Link onClick={() => setCardState("factory")}>Factory</Nav.Link>
                    </Nav.Item>
                </Nav>
            </Card.Header>
            <div className='cardContent'>
                {cardContent(cardState, props)}
            </div>
            <Card.Footer className="text-muted">Last Captured:</Card.Footer>
            </Card>
        </div>
    );
}

function cardContent(cardState : cardState, props: HillCardProps) : JSX.Element{
    switch (cardState){
        case 'current':{
            return <CurrentHill 
            hidden={cardState !== 'current'} 
            chainContext={props.chainContext} 
            victory={() => props.chainContext.claimVictory()}
            capture={num => props.chainContext.captureHill(num)} 
            approve={num => props.chainContext.approveBalance(num)}/>;
        }
        case 'factory':{
            return <Factory 
                hidden={cardState !== 'factory'} 
                context={props.chainContext}/>;
        }
        case 'history':{
            return <History hidden={cardState !== 'history'} context={props.chainContext}/>
        }
    }
}

export default HillCard;
