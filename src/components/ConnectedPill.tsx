import React from 'react';
import TokenAmount from './TokenAmount';
import TruncatedAddress from './TruncatedAddress';
import './ConnectedPill.css';

interface ConnectedPillProps{
    ChainId: number,
    Address: string,
    BalanceWei: string
}

function ConnectedPill(props: ConnectedPillProps){
    if (props.Address === undefined || props.BalanceWei === undefined){
        return(<div></div>);
    }

    return (
        <div className="pill">
            <TokenAmount tokenName='ETH' tokenAmount={Number(props.BalanceWei)} tokenDecimals={18} places={6} />
            <TruncatedAddress address={props.Address} />
        </div>)
}

export default ConnectedPill;