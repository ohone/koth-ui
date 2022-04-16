import { Nav } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import "./HillCard.css";
import History from './History';
import React, { useEffect, useState } from 'react';
import CurrentHill from './CurrentHill';
import { IChainContext } from '../ContractContext';
import Factory from './Factory';

type cardState = "current" | "history" | "factory";

interface HillCardProps{
    contractContext: IChainContext
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
    const [hillState, setHillState] = useState<HillState>();

    useEffect(() => {
        props.contractContext.getHillState().then(s => setHillState(s));
    })

    return (
        <div className='HillCard'>
            <Card style={{ width: '32rem', height:'40rem' }} border="secondary">
            <Card.Header>
                <Nav variant="tabs" defaultActiveKey="#first">
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
                <History hidden={cardState !== 'history'} items={[{name:"eoghan", amount:12}]}/>
                <CurrentHill 
                    hidden={cardState !== 'current'} 
                    hill={hillState} 
                    victory={() => props.contractContext.claimVictory()}
                    capture={num => props.contractContext.captureHill(num)} 
                    approve={num => props.contractContext.approveBalance(num)}/>
                <Factory hidden={cardState !== 'factory'} context={props.contractContext}/>
            </div>
            <Card.Footer className="text-muted">Last Captured:</Card.Footer>
            </Card>
        </div>
    );
}

export default HillCard;
