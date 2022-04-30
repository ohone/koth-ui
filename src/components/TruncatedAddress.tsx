import React from 'react';
import './TruncatedAddress.css';
interface AddressProps{
    address: string
}

function TruncatedAddress(props: AddressProps): JSX.Element {
  return <div className='address'>
    {props.address.slice(0, 5) + '...' +
    props.address.slice(props.address.length - 5, props.address.length - 1)}
  </div>;
}

export default TruncatedAddress;
