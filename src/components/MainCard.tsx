import {Tab, Tabs} from 'react-bootstrap';
import Card from 'react-bootstrap/Card';
import './MainCard.css';
import HistoryPage from './HistoryPage';
import React, {useState} from 'react';
import CurrentHill from './CurrentHill';
import {IChainContext} from '../domain/IChainContext';
import Factory from './Factory';
import CreatedHills from './CreatedHillsPage';
import {HillContext} from '../domain/HillContext';
import {useLocation} from 'react-router-dom';
import {isAddress} from 'web3-utils';
import {IHillContext} from '../domain/IHillContext';
import InvalidAddressModal from './InvalidAddressModal';

interface ContentCardProps{
    chainContext: IChainContext,
}

function MainCard(props: ContentCardProps) {
  const address = getAddressState();
  if (address === false) {
    // invalid address modal fires when rendering hill with no address
    return (<InvalidAddressModal/>);
  }
  const addressMissing = address === undefined;
  const [cardState, setCardState] = useState<tabNames>(
      addressMissing ? 'factory' : 'current');

  return (
    <div className='HillCard'>
      <Card style={{width: '32rem', height: '40rem'}} border="secondary">
        <Card.Header>
          <Tabs
            defaultActiveKey={cardState}
            onSelect={(k) => setCardState(k as tabNames)}>
            <Tab
              eventKey="current"
              title="Hill"
              disabled={addressMissing}/>
            <Tab
              eventKey="history"
              title="History"
              disabled={addressMissing}/>
            <Tab
              eventKey="factory"
              title="Factory"/>
            <Tab
              eventKey="hills"
              title="Hills"/>
          </Tabs>
        </Card.Header>
        <div className='cardContent'>
          {getTabContent(getTabProps(cardState, address, props.chainContext))}
        </div>
      </Card>
    </div>
  );
}

type addressResult = validAddressResult | false;
type validAddressResult = string | undefined;

type factoryProps = {
    id: 'factory'
    context: IChainContext
}

type hillsProps = {
    id: 'hills'
    context: IChainContext
}

type historyProps = {
    id: 'history'
    context: IHillContext,
}

type currentProps = {
    id: 'current'
    context: IHillContext
}

type tabProps = factoryProps | hillsProps | historyProps | currentProps;
type tabNames = 'current' | 'history' | 'factory' | 'hills';

function getAddressState() : addressResult {
  const address = useLocation().pathname.slice(1);
  if (address === undefined || address.length === 0) {
    return undefined;
  }
  const valid = address !== undefined && isAddress(address);
  if (!valid) {
    return false;
  }

  return address;
}

function getTabProps(
    tab : tabNames,
    address : validAddressResult,
    context: IChainContext) : tabProps {
  const factory : () => factoryProps = () => {
    return {id: 'factory', context: context};
  };
  const hills : () => hillsProps = () => {
    return {id: 'hills', context: context};
  };
  if (address === undefined) {
    switch (tab) {
      case 'current':
      case 'history':
      case 'factory':
        return factory();
      case 'hills':
        return hills();
    }
  }
  switch (tab) {
    case 'current':
      return {id: 'current', context: new HillContext(address, context)};
    case 'hills':
      return hills();
    case 'factory':
      return factory();
    case 'history':
      return {id: 'history', context: new HillContext(address, context)};
  }
}

function getTabContent(tabProps: tabProps) : JSX.Element {
  switch (tabProps.id) {
    case 'current': {
      return <CurrentHill
        hidden={false}
        hillContext={tabProps.context}/>;
    }
    case 'factory': {
      return <Factory
        hidden={false}
        context={tabProps.context}/>;
    }
    case 'history': {
      return <HistoryPage
        hidden={false}
        context={tabProps.context}/>;
    }
    case 'hills': {
      return <CreatedHills
        hidden={false}
        chainContext={tabProps.context} />;
    }
  }
}

export default MainCard;
