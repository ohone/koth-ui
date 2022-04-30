import React from 'react';

interface ITokenAmountProps{
    tokenName: string,
    tokenAmount: number,
    tokenDecimals: number,
    places: number | undefined
}

function TokenAmount(props: ITokenAmountProps){
    const tokenNormalised = props.tokenAmount / Math.pow(10, props.tokenDecimals);
    return <div className="tokenAmount">{props.places === undefined 
        ? tokenNormalised 
        : tokenNormalised.toString().slice(0, props.places)} {props.tokenName} </div>
}

export default TokenAmount;