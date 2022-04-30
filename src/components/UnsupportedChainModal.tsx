import React from 'react';
import {Button} from 'react-bootstrap';
import ErrorModal from './ErrorModal';

interface IUnsupportedChainModal{
    chainId: number
    supportedChains: number[],
    switchChain: (chainId: number) => void
}

function UnsupportedChainModal(props: IUnsupportedChainModal) {
  const supportedChainButtons = props.supportedChains.map((chain) => {
    return (
      <Button key={1}
        variant='primary'
        onClick={() => props.switchChain(chain)}>chain {chain}</Button>);
  });
  return <ErrorModal
    footer={supportedChainButtons}
    title="Unsupported Chain"
    body={
      // eslint-disable-next-line max-len
      `Chain ${props.chainId} is not supported. Choose a supported chain to switch to.`}/>;
}

export default UnsupportedChainModal;
