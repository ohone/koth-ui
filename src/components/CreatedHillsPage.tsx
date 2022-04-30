import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import './CurrentHill.css';
import { IChainContext } from "../domain/IChainContext";
import { HillState } from "../HillState";
import { HillContext } from '../domain/HillContext';

interface CurrentHillProps{
    hidden: boolean,
    chainContext: IChainContext
}

function CreatedHills(props: CurrentHillProps){
    const [state, setState] = useState<HillState[]>();

    useEffect(() => {
        if (state === undefined){
            props.chainContext.getCreations()
                .then(
                    async c => {
                        await Promise.all(c.map(addr => new HillContext(addr, props.chainContext).getHillState()))
                            .then(c => setState(c));
                    })}
        }
    );

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
            {state !== undefined ? state.map(s => (<tr onClick={o => {window.location.href='/' + s.address }}>
                <td>{s.token}</td>
                <td>{s.value}</td>
                <td>{s.expiry}</td>
                </tr>)) : undefined}
            </tbody>
        </Table>
    </div>) 
}

export default CreatedHills;