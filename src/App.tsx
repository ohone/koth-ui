import React, { useState, useEffect } from 'react';
import HillCard from './components/HillCard';
import "./App.css";
import Web3 from 'web3'
import ConnectedPill from './components/ConnectedPill';
import { ChainContext } from './ChainContext';
import { useLocation } from 'react-router-dom'
import { Button, Modal } from 'react-bootstrap';

function App() {
  const [account, setAccount] = useState<string | undefined>(undefined);
  const [chainId, setChainId] = useState<number | undefined>(undefined);
  const [balance, setBalance] = useState<string | undefined>(undefined);

  const web3 = new Web3(Web3.givenProvider);
  useEffect(() => {
    web3.eth.getAccounts()
      .then(a => {
        setAccount(a[0]);
        return web3.eth.getBalance(a[0])
          .then(setBalance)
          .catch(console.log)
      })
      .catch(a => console.log(a));

    web3.eth.getChainId()
      .then(setChainId)
      .catch(a => console.log(a));
  });

  const address = useLocation().pathname.slice(1);
  const addressSpecified = address.length !== 0;

  const invalidAddressAlertModal = addressSpecified 
    ? invalidAddressAlert(web3, address) 
    : undefined;

  console.log(invalidAddressAlertModal);
  return (
    <div className="App">
      {invalidAddressAlertModal}
      <header className="App-header">
        <ConnectedPill ChainId={chainId} Address={account} BalanceWei={balance}/>
        <div className='App-header-title'>
          King of the Hill
        </div>
      </header>
      {account !== undefined && invalidAddressAlertModal === undefined
        ? <HillCard chainContext={new ChainContext(address)} contract={address}/> 
        : undefined}
    </div>
  );
}

function invalidAddressAlert(web3: Web3, address : string) {
  if (address.length === 0){
    return undefined;
  }
  const validAddress = web3.utils.isAddress(address);
  if (validAddress){
    return undefined;
  }
  const handleClose = () => {
    console.log('handle');
    window.location.href='/';
  };

  return (<Modal
    show={true}
    onHide={handleClose}
    backdrop="static"
    keyboard={false}
  >
    <Modal.Header closeButton>
      <Modal.Title>Invalid Address</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      Invalid address.
    </Modal.Body>
    <Modal.Footer>
      <Button variant="primary" onClick={handleClose}>
        Understood
      </Button>
    </Modal.Footer>
  </Modal>)
}

export default App;
