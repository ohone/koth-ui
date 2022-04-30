import Web3 from 'web3';
import {AbiItem} from 'web3-utils';
import {abi as factoryABI} from '../KotHFactory.json';
import {ChainInfos} from '../Chains.json';
import {IChainContext} from './IChainContext';

export class ChainContext implements IChainContext {
  private w3: Web3;

  constructor() {
    this.w3 = new Web3(Web3.givenProvider);
  }

  getBalance(address: string) : Promise<string> {
    return this.w3.eth.getBalance(address);
  }

  getChain() {
    return this.w3.eth.getChainId();
  };

  async isConnected() : Promise<boolean> {
    return (await this.w3.eth.getAccounts()).length > 0;
  };

  requestConnection() : Promise<string[]> {
    return this.w3.eth.requestAccounts();
  };

  async getAccount() :Promise<string> {
    return (await this.w3.eth.getAccounts())[0];
  };

  async createKoth(reign: number, address: string): Promise<void> {
    const chainId = await this.w3.eth.getChainId();
    console.log(chainId);
    console.log(ChainInfos);
    const contract = new this.w3.eth.Contract(
      factoryABI as AbiItem[],
      ChainInfos.filter((o) => o.ChainId == chainId)[0].FactoryAddress,
    );
    return await contract.methods
        // eslint-disable-next-line new-cap
        .CreateKotH(reign, address)
        .send({from: await this.getAccount()}, (_: any, err: any) =>
          console.log(err),
        );
  };

  async getCreations() : Promise<string[]> {
    const chainId = await this.w3.eth.getChainId();
    const factoryAddress = ChainInfos.filter((o) => o.ChainId == chainId)[0]
        .FactoryAddress;

    const contract = new this.w3.eth.Contract(
      factoryABI as AbiItem[],
      factoryAddress,
    );
    await contract.events
        // eslint-disable-next-line new-cap
        .KotHCreated({fromBlock: 0});
    const events = await contract.getPastEvents(
        'KotHCreated',
        {
          fromBlock: 0,
        },
        (e, ev) => console.log('event:' + ev + ' error:' + e),
    );
    console.log(events);
    return events.map((o) => o.returnValues['koth'] as string);
  };

  supportedChain: (chainId: number) => boolean = (chainId) => {
    return ChainInfos.filter((o) => o.ChainId == chainId).length !== 0;
  };

  getSupportedChains() : {id: number, name: string}[] {
    return ChainInfos.map((o) => {
      return {id: o.ChainId, name: o.Name};
    });
  };

  switchChain(chainId: number) :Promise<void> {
    return (window as any).ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{chainId: this.w3.utils.toHex(chainId)}],
    });
  };

  async switchChainReturn(chainId: number) : Promise<number> {
    await this.switchChain(chainId);
    return await this.getChain();
  };
}
