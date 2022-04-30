import React, {useEffect, useState} from 'react';
import {Card, ListGroup, Placeholder} from 'react-bootstrap';
import {IHillContext} from '../domain/IHillContext';
import {CaptureEvent} from './CaptureEvent';

interface IHistoryPageProps{
    hidden: boolean,
    context: IHillContext
}

function HistoryPage(props: IHistoryPageProps) {
  const [items, setItems] = useState<CaptureEvent[]>();

  useEffect(() => {
    if (items === undefined) {
      props.context.getCaptures().then((s) => {
        setItems(s);
      });
    }
  });

  return (
    <div className='History' hidden={props.hidden}>
      {items !== undefined ? renderItems(items) : loadingPlaceholder()}
    </div>
  );
}

function renderItems(items: CaptureEvent[]) {
  return (<ListGroup className='list' variant="flush">
    {items.map((item, idx) =>
      <ListGroup.Item key={idx}>
        <CaptureEvent
          name={item.name}
          amount={item.amount}
          winning={
            items[idx + 1] !== undefined &&
            items[idx + 1].amount < item.amount}/>
      </ListGroup.Item>)}
  </ListGroup>);
}

function loadingPlaceholder() {
  return (
    <div>
      <Placeholder as={Card.Title} animation="glow">
        <Placeholder xs={6} />
      </Placeholder>
      <Placeholder as={Card.Text} animation="glow">
        <Placeholder xs={7} />
        <Placeholder xs={4} />
        <Placeholder xs={4} />{' '}
        <Placeholder xs={6} /> <Placeholder xs={8} />
      </Placeholder>
    </div>
  );
}

export default HistoryPage;
