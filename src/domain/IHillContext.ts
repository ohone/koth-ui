import {CaptureEvent} from '../components/CaptureEvent';
import {HillState} from '../HillState';
import {IChainContext} from './IChainContext';

export interface IHillContext {
  getAddress: () => string;
  getHillState: () => Promise<HillState>;
  captureHill: (amount: number) => Promise<void>;
  authorizedBalance: () => Promise<number>;
  approveBalance: (num: number) => Promise<void>;
  claimVictory: () => Promise<void>;
  getCaptures: () => Promise<CaptureEvent[]>;
  getChainContext: () => IChainContext;
}
