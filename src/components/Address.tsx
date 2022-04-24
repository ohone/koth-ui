import React from 'react';
import './Address.css'
interface AddressProps{
    address: string
}

function Address(props: AddressProps){
    return <div className='address'>
        {props.address.slice(0,5) + '...' + props.address.slice(props.address.length - 5, props.address.length - 1)}
            </div>
}

export default Address;