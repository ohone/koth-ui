export interface IChainContext {
  createKoth: (reignSeconds: number, address: string) => Promise<void>;
  getCreations: () => Promise<string[]>;
  supportedChain: (chainId: number) => boolean;
  getSupportedChains: () => {id: number, name: string}[];
  getBalance: (address: string) => Promise<string>;
  switchChain: (chainId: number) => void;
  switchChainReturn: (chainId: number) => Promise<number>;
  getAccount: () => Promise<string>;
  requestConnection: () => Promise<string[]>;
  isConnected: () => Promise<boolean>;
  getChain: () => Promise<number>;
}
