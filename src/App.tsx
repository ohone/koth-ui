import React, { useState, useEffect } from 'react';
import HillCard from './components/HillCard';
import "./App.css";
import Web3 from 'web3'
import ConnectedPill from './components/ConnectedPill';
import { ChainContext } from './ContractContext';

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
  })

  const contractContext = new ChainContext(web3, '0xdCa675164Ff44fE1BB5FB7e7E2A953Df174d8083');

  return (
    <div className="App">
      <header className="App-header">
        <ConnectedPill ChainId={chainId} Address={account} BalanceWei={balance}/>
        <div className='App-header-title'>
          King of the Hill
        </div>
      </header>
      {account !== undefined ? <HillCard contractContext={contractContext}/> : undefined}
    </div>
  );
}

export default App;
