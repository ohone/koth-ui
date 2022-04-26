import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import './CurrentHill.css';
import { IChainContext } from '../ChainContext';
import { HillState } from './HillCard';

interface CurrentHillProps{
    hidden: boolean,
    chainContext: IChainContext
}

function CreatedHills(props: CurrentHillProps){
    const [state, setState] = useState<HillState[]>([]);

    useEffect(() => {
        props.chainContext.getCreations()
            .then(
                async c => {
                    await Promise.all(c.map(addr => props.chainContext.getHillState(addr)))
                        .then(c => setState(c));
                })});

    return(<div className="CurrentHill" hidden={props.hidden}>
        <Table striped bordered hover>
            <thead>
                <tr>
                <th>Token</th>
                <th>Current Amout</th>
                <th>Time Remaining</th>
                </tr>
            </thead>
            <tbody>
            {state.map(s => (<tr>
                <td>{s.token}</td>
                <td>{s.value}</td>
                <td>{s.expiry}</td>
                </tr>))}
            </tbody>
        </Table>
    </div>) 
}

export default CreatedHills;