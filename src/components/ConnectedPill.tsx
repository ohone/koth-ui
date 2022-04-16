import React from 'react';
import Web3 from 'web3';

interface ConnectedChainProps{
    ChainId: number | undefined,
    Address: string | undefined,
    BalanceWei: string | undefined
}

function addressReadable(address: string) : string {
    return address.slice(0, 5) + "..." + address.slice(address.length - 5, address.length - 1)
} 

function balanceReadable(balanceWei: string) : string {
    let wei = Web3.utils.fromWei(balanceWei, 'ether');
    return wei.slice(0, 6);
}

function connectedPill(props: ConnectedChainProps){
    if (props.Address === undefined || props.BalanceWei === undefined){
        return(<div></div>);
    }

    return (<div className="connectedPill">
        <div className="pill">
            {balanceReadable(props.BalanceWei)} ETH {addressReadable(props.Address)}
        </div>
    </div>)
}

export default connectedPill;