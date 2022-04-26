import Web3 from "web3";
import { HillState } from "./components/HillCard";
import { abi } from "./KotH.json";
import { abi as ERC20Abi } from "./IERC20.json";
import { AbiItem } from "web3-utils";
import { abi as factoryABI } from "./KotHFactory.json";
import { ChainInfos } from "./Chains.json";
import { HistoryItemProps } from "./components/HistoryItem";

export interface IChainContext {
  getHillState: (address: string) => Promise<HillState>;
  captureHill: (amount: number) => Promise<void>;
  authorizedBalance: () => Promise<number>;
  approveBalance: (num: number, address: string) => Promise<void>;
  claimVictory: () => Promise<void>;
  createKoth: (reignSeconds: number, address: string) => Promise<void>;
  getCaptures: () => Promise<HistoryItemProps[]>;
  isValid: () => boolean;
  getCreations: () => Promise<string[]>;
  supportedChain: (chainId: number) => boolean;
  getSupportedChains: () => number[];
  switchChain: (chainId: number) => void;
}

export class ChainContext implements IChainContext {
  private KotHAddress: string;
  private TokenAddress: string | undefined;

  constructor(KotHAddress: string) {
    this.KotHAddress = KotHAddress;
    this.isValid = () => KotHAddress.length > 0;
  }

  isValid: () => boolean;

  getAccount: () => Promise<string> = async () => {
    return (await new Web3(Web3.givenProvider).eth.getAccounts())[0];
  };

  captureHill: (amount: number) => Promise<void> = async (amount) => {
    const w3 = new Web3(Web3.givenProvider);
    const contract = new w3.eth.Contract(abi as AbiItem[], this.KotHAddress);

    const account = (await w3.eth.getAccounts())[0];
    await contract.methods.capture(amount).send({ from: account });
  };

  authorizedBalance: () => Promise<number> = async () => {
    const tokenAddress = await this.getTokenAddress();
    const tokenContract = new new Web3(Web3.givenProvider).eth.Contract(
      ERC20Abi as AbiItem[],
      tokenAddress
    );

    const user = (await new Web3(Web3.givenProvider).eth.getAccounts())[0];

    const allowance = await tokenContract.methods
      .allowance(user, this.KotHAddress)
      .call();
    return allowance as number;
  };

  createKoth: (reign: number, tokenAddress: string) => Promise<void> = async (
    reign,
    address
  ) => {
    const w3 = new Web3(Web3.givenProvider);
    const chainId = await w3.eth.getChainId();
    const contract = new w3.eth.Contract(
      factoryABI as AbiItem[],
      ChainInfos.filter((o) => o.ChainId == chainId)[0].FactoryAddress
    );
    return await contract.methods
      .CreateKotH(reign, address)
      .send({ from: await this.getAccount() });
  };

  claimVictory: () => Promise<void> = async () => {
    const contract = new new Web3(Web3.givenProvider).eth.Contract(
      abi as AbiItem[],
      this.KotHAddress
    );
    const account = await this.getAccount();
    return await contract.methods.claimVictory(account).send({ from: account });
  };

  getTokenAddress: () => Promise<string> = () => {
    if (this.TokenAddress !== undefined) {
      return this.TokenAddress;
    }
    const contract = new new Web3(Web3.givenProvider).eth.Contract(
      abi as AbiItem[],
      this.KotHAddress
    );

    return contract.methods.getTokenAddress().call();
  };

  approveBalance: (num: number, address: string) => Promise<void> = async (
    num,
    address
  ) => {
    const contract = new new Web3(Web3.givenProvider).eth.Contract(
      ERC20Abi as AbiItem[],
      await this.getTokenAddress()
    );

    return contract.methods
      .approve(address, num)
      .send({ from: await this.getAccount() });
  };

  getHillState: (address: string) => Promise<HillState> = async (address) => {
    const contract = new new Web3(Web3.givenProvider).eth.Contract(
      abi as AbiItem[],
      address
    );
    const king = await contract.methods.king().call();
    return {
      king: king,
      value: await contract.methods.currentAmount().call(),
      expiry: await contract.methods.expires().call(),
      captured: (await this.getAccount()) === king,
      allowance: await this.authorizedBalance(),
      token: await contract.methods.tokenAddress().call(),
      address: address,
    };
  };

  getCreations: () => Promise<string[]> = async () => {
    const w3 = new Web3(Web3.givenProvider);
    const chainId = await w3.eth.getChainId();
    const contract = new w3.eth.Contract(
      factoryABI as AbiItem[],
      ChainInfos.filter((o) => o.ChainId == chainId)[0].FactoryAddress
    );

    const events = await contract.getPastEvents("KotHCreated", {
      fromBlock: 0,
      toBlock: "latest",
    });
    console.log(events);
    return events.map((o) => o.returnValues["koth"] as string);
  };

  getCaptures: () => Promise<HistoryItemProps[]> = async () => {
    const contract = new new Web3(Web3.givenProvider).eth.Contract(
      abi as AbiItem[],
      this.KotHAddress
    );

    const data = await contract.getPastEvents("Captured", {
      fromBlock: 0,
      toBlock: "latest",
    });

    return data.map((d, idx) => {
      var contractVals = {
        name: d.returnValues[kingString] as string,
        amount: d.returnValues[amountString] as number,
      };
      return {
        ...contractVals,
        winning:
          data[idx + 1] !== undefined &&
          (data[idx + 1].returnValues[amountString] as number) <=
            contractVals.amount,
      };
    });
  };

  supportedChain: (chainId: number) => boolean = (chainId) => {
    return ChainInfos.filter((o) => o.ChainId == chainId).length !== 0;
  };

  getSupportedChains: () => number[] = () => {
    return ChainInfos.map((o) => o.ChainId);
  };

  switchChain: (chainId: number) => void = (chainId) => {
    (window as any).ethereum.request({
      method: "wallet_switchEthereumChain",
      params: [{ chainId: new Web3(Web3.givenProvider).utils.toHex(chainId) }],
    });
  };
}

const kingString: string = "king";
const amountString: string = "amount";
