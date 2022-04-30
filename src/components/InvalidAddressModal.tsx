import React from 'react';
import {Button} from 'react-bootstrap';
import ErrorModal from './ErrorModal';

const handleClose = () =>
  window.location.href='/';

export default function invalidAddressModal() {
  const button = (
    <Button variant="primary" onClick={handleClose}>
      Understood
    </Button>);
  return (
    <ErrorModal
      footer={[button]}
      title="Invalid Address"
      body={`Invalid address.`}/>);
}
