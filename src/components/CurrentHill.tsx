import React, {useEffect, useState} from 'react';
import {Placeholder} from 'react-bootstrap';
import {HillState} from '../HillState';
import hill from '../hill.png';
import './CurrentHill.css';
import {IHillContext} from '../domain/IHillContext';
import {EthInteraction} from './EthInteraction';
import EthInteractionDrivenButton from './EthInteractonDrivenButton';

interface CurrentHillProps{
    hidden: boolean,
    hillContext: IHillContext,
}

function CurrentHill(props: CurrentHillProps) {
  const [hillState, setHillState] = useState<HillState>();

  useEffect(() => {
    if (hillState === undefined) {
      props.hillContext.getHillState().then((s) => setHillState(s));
    }
  });

  const view = (
    <div className='HillDetail'>
      <div className="CurrentAmount">
        {hillState === undefined ? (
                <Placeholder animation='glow'>
                  <Placeholder xs='6'/>
                </Placeholder>) : hillState.value}
      </div>
      <div className="CurrentAmountTitle">Current Amount</div>
      <img className='hill' src={hill}/>
      <div className="King">👑 {hillState === undefined ?
                <Placeholder animation='glow'>
                  <Placeholder xs='20'/>
                </Placeholder> :
            hillState.king === '0x0000000000000000000000000000000000000000' ?
                    <a>unclaimed</a> :
                    hillState.king}</div>
      {hillState === undefined ?
            (<Placeholder animation='glow'>
              <Placeholder xs='12'/>
            </Placeholder>) :
            expiry(hillState.expiry)}
    </div>);

  return (<div className="CurrentHill" hidden={props.hidden}>
    {view}
    <div className="d-grid gap-2">
      {buttons(props, hillState)}
    </div>
  </div>);
}

function buttons(
    props : CurrentHillProps,
    hill : HillState | undefined) : JSX.Element {
  const chainContext = props.hillContext.getChainContext();

  const interactions = new EthInteraction(
      [
        {
          label: 'connect to ethereum',
          action: () => chainContext.requestConnection(),
          applicable: () => chainContext.isConnected().then((o) => !o),
        },
        {
          label: 'switch chain',
          action: () => chainContext.requestConnection(),
          applicable: () => chainContext.getChain()
              .then((chainId) => !chainContext.supportedChain(chainId)),
        },
        {
          label: 'claim victory',
          action: () => props.hillContext.claimVictory(),
          applicable:
            () => Promise.resolve(hill !== undefined && hill.captured),
        },
        {
          label: 'approve tokens',
          action: () => props.hillContext.approveBalance(hill!.value + 1),
          applicable: async () => {
            if (hill === undefined || !hill.captured) {
              return false;
            }
            return await props.hillContext.authorizedBalance().then((b) => {
              console.log(hill);
              return b <= hill.value;
            });
          },
        },
        {
          label: 'capture hill',
          action: async () => await props.hillContext.captureHill(
              await props.hillContext.authorizedBalance()),
          applicable:
            () => Promise.resolve(hill !== undefined && !hill.captured),
        },
      ]);

  return <EthInteractionDrivenButton interaction={interactions} />;
}

function expiry(timestamp: number) {
  const expiryDate = new Date(timestamp * 1000);
  if (isNaN(expiryDate.valueOf())) {
    return undefined;
  }
  return (<div className="Expiry">Expires: {expiryDate.toString()}</div>);
}

export default CurrentHill;
