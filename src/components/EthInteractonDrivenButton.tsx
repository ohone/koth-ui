import {Button} from 'react-bootstrap';
import './MainCard.css';
import React, {useEffect, useState} from 'react';
import {EthInteraction} from './EthInteraction';

interface EthInteractionDrivenButtonProps{
    interaction: EthInteraction
}

function EthInteractionDrivenButton(props: EthInteractionDrivenButtonProps) {
  const [currentInteraction, setCurrent] =
    useState<{label: string, action:() => Promise<any>}>();

  useEffect(() => {
    if (currentInteraction === undefined) {
      props.interaction
          .next()
          .then((c) => setCurrent(c));
    }
  });

  if (currentInteraction !== undefined) {
    return (
      <Button onClick={
        () => currentInteraction
            .action()
            .then(() => props.interaction.next().then((s) => setCurrent(s)))}>
        {currentInteraction.label}
      </Button>
    );
  }
  return (<div></div>);
}

export default EthInteractionDrivenButton;
