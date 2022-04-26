import { Nav, Tab, Tabs } from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import "./HillCard.css";
import History from './History';
import React, { useState } from 'react';
import CurrentHill from './CurrentHill';
import { IChainContext } from '../ChainContext';
import Factory from './Factory';
import CreatedHills from './CreatedHills';

type cardState = "current" | "history" | "factory" | "hills";

interface HillCardProps{
    chainContext: IChainContext,
    contract: string
}

export interface HillState{
    king: string,
    value: number,
    expiry: number,
    captured: boolean,
    allowance: number,
    token: string,
    address: string
}

function HillCard(props: HillCardProps) {

    const [cardState, setCardState] = useState<cardState>(props.chainContext.isValid() ? 'current' : 'factory');

    return (
        <div className='HillCard'>
            <Card style={{ width: '32rem', height:'40rem' }} border="secondary">
            <Card.Header>
                <Tabs defaultActiveKey={cardState} onSelect={k => setCardState(k as cardState)}>
                    <Tab 
                        eventKey="current"
                        title="Hill" 
                        disabled={!props.chainContext.isValid()}/>
                    <Tab 
                        eventKey="history"
                        title="History"
                        disabled={!props.chainContext.isValid()}/>
                    <Tab 
                        eventKey="factory"
                        title="Factory"/>
                    <Tab 
                        eventKey="hills"
                        title="Hills"/>
                </Tabs>
            </Card.Header>
            <div className='cardContent'>
                {cardContent(cardState, props)}
            </div>
            </Card>
        </div>
    );
}

function cardContent(cardState : cardState, props: HillCardProps) : JSX.Element{
    switch (cardState){
        case 'current':{
            return <CurrentHill 
            contract={props.contract}
            hidden={cardState !== 'current'} 
            chainContext={props.chainContext} 
            victory={() => props.chainContext.claimVictory()}
            capture={num => props.chainContext.captureHill(num)} 
            approve={num => props.chainContext.approveBalance(num, props.contract)}/>;
        }
        case 'factory':{
            return <Factory 
                hidden={cardState !== 'factory'} 
                context={props.chainContext}/>;
        }
        case 'history':{
            return <History hidden={cardState !== 'history'} context={props.chainContext}/>
        }
        case 'hills':{
            return <CreatedHills hidden={false} chainContext={props.chainContext} />
        }
    }
}

export default HillCard;
