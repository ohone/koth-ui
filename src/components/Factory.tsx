import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { IChainContext } from '../ContractContext';
import "./Factory.css";

interface FactoryProps{
    hidden: boolean,
    context: IChainContext
}

function Factory(props: FactoryProps) {
    const [reign, setReign] = useState<number>(10);
    const [address, setAddress] = useState<string>();
    return (
        <Form hidden={props.hidden}>
            <Form.Text className="text">
                The factory allows deployment of a new hill. The factory is currently available on the following chains:
            </Form.Text>
            <h4>
            Create a new instance of King of the Hill.
            </h4>
            <Form.Group className="mb-3" controlId="formBasicTokenAddress">
                <Form.Control type="tokenAddress" placeholder="Enter Token Address"onChange={c => setAddress(c.target.value)} />
                <Form.Text className="text-muted">
                Address of the ERC20 that the hill accepts.
                </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Reign: {reign} minutes</Form.Label>
                <Form.Range 
                    min={1} 
                    defaultValue={10} 
                    onChange={r => setReign(Number(r.target.value))}/>
                <Form.Text className="text-muted">
                    How many minutes one must be king before being victorious.
                </Form.Text>
            </Form.Group>
        <div className="d-grid gap-2">
            <Button disabled={reign === undefined || address === undefined} onClick={c => props.context.createKoth(reign * 60, address!)} variant="primary">
                Create
            </Button>
        </div>
        </Form>
        
  );
}

export default Factory;
