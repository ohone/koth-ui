import React from 'react';
import { Button, Form } from 'react-bootstrap';
import { HillState } from './HillCard';
import hill from '../hill.png';
import './CurrentHill.css';

interface CurrentHillProps{
    hill: HillState | undefined,
    hidden: boolean,
    capture: (num: number) => Promise<void>,
    approve: (num: number) => Promise<void>,
    victory: () => Promise<void>
}

function CurrentHill(props: CurrentHillProps){

    const expiry = (expiryTimestamp : number) => {
        const expiryDate = new Date(expiryTimestamp / 1000);
        return (<div className="Expiry">Expiry: {expiryDate.getMinutes()} minutes</div>);
    }

    const view = props.hill === undefined ? <div>error</div> : (
        <div className='HillDetail'>
            <div className="CurrentAmount">{props.hill.value}</div>
            <div className="CurrentAmountTitle">Current Amount</div>
            <img className='hill' src={hill} alt="fireSpot"/>
            <div className="King">👑 {props.hill.king === '0x0000000000000000000000000000000000000000' ? <a>unclaimed</a> : props.hill.king}</div>
            {expiry(props.hill.expiry)}
        </div>)

    const buttons = renderButtons(props);

    return(<div className="CurrentHill" hidden={props.hidden}>
        {view}
        <div className="d-grid gap-2">
            {buttons}
        </div>
    </div>) 
}

function renderButtons(props : CurrentHillProps) : JSX.Element{
    if (props.hill === undefined){
        return (<Button disabled={true}>Loading...</Button>)
    }

    if (props.hill.captured){
        return (<Button disabled={!props.hill.captured || props.hill.captured && new Date(props.hill.expiry / 1000) > new Date()} onClick={() => props.victory()}>Claim Victory</Button>)
    }

    const value = props.hill.value;
    if (props.hill.allowance <= props.hill.value){
        return (<Button onClick={(_) => props.approve(value + 1)}>Approve Tokens</Button>)
    }
    return <Button disabled={props.hill.captured} onClick={(_) => props.capture(value + 1)}>Capture Hill</Button>
}

export default CurrentHill;