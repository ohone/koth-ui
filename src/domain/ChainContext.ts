import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { abi as factoryABI } from "../KotHFactory.json";
import { ChainInfos } from "../Chains.json";
import { IChainContext } from "./IChainContext";

export class ChainContext implements IChainContext {
  private w3: Web3;

  constructor() {
    this.w3 = new Web3(Web3.givenProvider);
  }
  getBalance: (address: string) => Promise<string> = (address) => {
    return this.w3.eth.getBalance(address);
  };

  getChain: () => Promise<number> = () => {
    return this.w3.eth.getChainId();
  };

  isConnected: () => Promise<boolean> = async () => {
    return (await this.w3.eth.getAccounts()).length > 0;
  };

  requestConnection: () => Promise<string[]> = () => {
    return this.w3.eth.requestAccounts();
  };

  getAccount: () => Promise<string> = async () => {
    return (await this.w3.eth.getAccounts())[0];
  };

  createKoth: (reign: number, tokenAddress: string) => Promise<void> = async (
    reign,
    address
  ) => {
    const chainId = await this.w3.eth.getChainId();
    console.log(chainId);
    console.log(ChainInfos);
    const contract = new this.w3.eth.Contract(
      factoryABI as AbiItem[],
      ChainInfos.filter((o) => o.ChainId == chainId)[0].FactoryAddress
    );
    return await contract.methods
      .CreateKotH(reign, address)
      .send({ from: await this.getAccount() }, (_: any, err: any) =>
        console.log(err)
      );
  };

  getCreations: () => Promise<string[]> = async () => {
    const chainId = await this.w3.eth.getChainId();
    const factoryAddress = ChainInfos.filter((o) => o.ChainId == chainId)[0]
      .FactoryAddress;

    const contract = new this.w3.eth.Contract(
      factoryABI as AbiItem[],
      factoryAddress
    );
    await contract.events.KotHCreated({ fromBlock: 0 });
    const events = await contract.getPastEvents(
      "KotHCreated",
      {
        fromBlock: 0,
      },
      (e, ev) => console.log("event:" + ev + " error:" + e)
    );
    console.log(events);
    return events.map((o) => o.returnValues["koth"] as string);
  };

  supportedChain: (chainId: number) => boolean = (chainId) => {
    return ChainInfos.filter((o) => o.ChainId == chainId).length !== 0;
  };

  getSupportedChains: () => number[] = () => {
    return ChainInfos.map((o) => o.ChainId);
  };

  switchChain: (chainId: number) => Promise<void> = (chainId) => {
    return (window as any).ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: this.w3.utils.toHex(chainId) }],
    });
  };

  switchChainReturn: (chainId: number) => Promise<number> = async (chainId) => {
    await this.switchChain(chainId);
    return await this.getChain();
  };
}
