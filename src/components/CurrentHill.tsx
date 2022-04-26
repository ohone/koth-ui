import React, { useEffect, useState } from 'react';
import { Button, Placeholder } from 'react-bootstrap';
import { HillState } from './HillCard';
import hill from '../hill.png';
import './CurrentHill.css';
import { IChainContext } from '../ChainContext';

interface CurrentHillProps{
    hidden: boolean,
    chainContext: IChainContext,
    contract: string,
    capture: (num: number) => Promise<void>,
    approve: (num: number) => Promise<void>,
    victory: () => Promise<void>
}

function CurrentHill(props: CurrentHillProps){
    const [hillState, setHillState] = useState<HillState>();
    useEffect(() => {
        if (hillState === undefined){
            props.chainContext.getHillState(props.contract).then(s => setHillState(s));
        }
    });

    const view = (<div className='HillDetail'>
            <div className="CurrentAmount">
                {hillState === undefined ? (
                <Placeholder animation='glow'>
                    <Placeholder xs='6'/>
                </Placeholder>) : hillState.value}
            </div>
            <div className="CurrentAmountTitle">Current Amount</div>
            <img className='hill' src={hill}/>
            <div className="King">👑 {hillState === undefined 
                ? <Placeholder animation='glow'><Placeholder xs='20'/></Placeholder>  
                : hillState.king === '0x0000000000000000000000000000000000000000' 
                    ? <a>unclaimed</a> 
                    : hillState.king}</div>
            {hillState === undefined 
            ? (<Placeholder animation='glow'><Placeholder xs='12'/></Placeholder>) 
            : expiry(hillState.expiry)}
        </div>)

    return(<div className="CurrentHill" hidden={props.hidden}>
        {view}
        <div className="d-grid gap-2">
            {buttons(props, hillState)}
        </div>
    </div>) 
}

function buttons(props : CurrentHillProps, hill : HillState | undefined) : JSX.Element{
    if (hill === undefined){
        return (<Button disabled={true}>Loading...</Button>)
    }

    if (hill.captured){
        return (<Button 
                disabled={!hill.captured || hill.captured && new Date(hill.expiry / 1000) <= new Date()} 
                onClick={() => props.victory()}>
                    Claim Victory
            </Button>)
    }

    const value = hill.value;
    if (hill.allowance <= hill.value){
        return (<Button onClick={(_) => props.approve(value + 1)}>Approve Tokens</Button>)
    }
    return (<Button 
        disabled={hill.captured} 
        onClick={(_) => props.capture(value + 1)}>
            Capture Hill
        </Button>)
}

function expiry(timestamp: number){
    const expiryDate = new Date(timestamp * 1000);
    return (<div className="Expiry">Expires: {expiryDate.toString()}</div>);
}

export default CurrentHill;