import React from 'react';
import {Button} from 'react-bootstrap';
import ErrorModal from './ErrorModal';

interface IConnectToWeb3ModalProps{
    connectToEth: () => Promise<void>
}

// eslint-disable-next-line require-jsdoc
function ConnectToWeb3Modal(props: IConnectToWeb3ModalProps) {
  return <ErrorModal
    title="Connect Web3 Provider"
    body="Please connect to web 3 via supported provider:"
    footer={[
      <Button key={1}
        variant='primary'
        onClick={() => props.connectToEth()}>Web Browser Provider</Button>]}/>;
}

export default ConnectToWeb3Modal;
