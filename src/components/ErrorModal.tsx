import React from 'react';
import {Modal} from 'react-bootstrap';

interface IErrorModal{
    title: string,
    body: string,
    footer: JSX.Element[],
}

function ErrorModal(props: IErrorModal) {
  return (<Modal
    show={true}
    backdrop="static"
    keyboard={false}
  >
    <Modal.Header closeButton>
      <Modal.Title>{props.title}</Modal.Title>
    </Modal.Header>
    <Modal.Body>
      {props.body}
    </Modal.Body>
    <Modal.Footer>
      {props.footer}
    </Modal.Footer>
  </Modal>);
}

export default ErrorModal;
