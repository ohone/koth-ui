interface ITokenAmountProps{
    tokenName: string,
    tokenAmount: number,
    tokenDecimals: number
}

function TokenAmount(props: ITokenAmountProps){
    return <div className="tokenAmount">{props.tokenAmount / Math.pow(10, props.tokenDecimals)} {props.tokenName}</div>
}

export default TokenAmount;