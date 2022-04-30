import React, {useState, useEffect} from 'react';
import MainCard from './components/MainCard';
import './App.css';
import Web3 from 'web3';
import ConnectedPill from './components/ConnectedPill';
import {ChainContext} from './domain/ChainContext';
import {IChainContext} from './domain/IChainContext';
import NotConnectedPill from './components/NotConnectedPill';
import UnsupportedChainModal from './components/UnsupportedChainModal';
import IncompatibleBrowserModal from './components/IncompatibleBrowserModal';

const context = new ChainContext();

function App() {
  const [account, setAccount] = useState<string>();
  const [chainId, setChainId] = useState<number>();
  const [balance, setBalance] = useState<string>();
  const [compatibleBrowser, setCompatibleBrowser] = useState<boolean>(false);

  if (Web3.givenProvider !== null && compatibleBrowser === false) {
    setCompatibleBrowser(true);
  }

  useEffect(() => {
    if (compatibleBrowser) {
      const getBalance : (acc:string) => Promise<string> =
      (acc) => context.getBalance(acc);

      if (!account) {
        context.getAccount().then((account) => {
          if (account) {
            setAccount(account);
            getBalance(account).then((b) => setBalance(b));
          }
        },
        );
      }

      context.getChain().then((cId) => {
        console.log('chain:'+cId);
        if (cId !== undefined && cId !== chainId) {
          setChainId(cId);
        }
      });
    }
  });

  const pill = chainId !== undefined &&
   account !== undefined && balance !== undefined ?
    (<ConnectedPill
      ChainId={chainId} Address={account} BalanceWei={balance}/>) :
    (<NotConnectedPill/>);
  const header = (
    <header className="App-header">
      {pill}
      <div className='App-header-title'>
    King of the Hill
      </div>
    </header>);

  const errorModal = getErrorModal(
      compatibleBrowser,
      chainId,
      setChainId,
      context);

  return (
    <div className="App">
      {errorModal}
      {header}
      {compatibleBrowser ?
        <MainCard chainContext={new ChainContext()} /> :
        undefined}
    </div>
  );
}

function getErrorModal(
    compatible: boolean | undefined,
    chainId: number | undefined,
    setChain: (newChain: number) => void,
    context: IChainContext) {
  if (!compatible) {
    return (<IncompatibleBrowserModal/>);
  }

  if (chainId !== undefined && !context.supportedChain(chainId)) {
    return (<UnsupportedChainModal
      chainId={chainId}
      switchChain={
        (c) => context.switchChainReturn(c)
            .then((newChain) => setChain(newChain))}
      supportedChains={context.getSupportedChains()}/>);
  }
}

export default App;
