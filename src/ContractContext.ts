import Web3 from "web3";
import { HillState } from "./components/HillCard";
import { abi } from "./KotH.json";
import { abi as ERC20Abi } from "./IERC20.json";
import { AbiItem } from "web3-utils";
import { abi as factoryABI } from "./KotHFactory.json";
import { ChainInfos } from "./Chains.json";

export interface IChainContext {
  getHillState: () => Promise<HillState>;
  captureHill: (amount: number) => Promise<void>;
  authorizedBalance: () => Promise<number>;
  approveBalance: (num: number) => Promise<void>;
  claimVictory: () => Promise<void>;
  createKoth: (reignSeconds: number, address: string) => Promise<void>;
}

export class ChainContext implements IChainContext {
  private Instance: Web3;
  private KotHAddress: string;
  private TokenAddress: string | undefined;

  constructor(instance: Web3, KotHAddress: string) {
    this.Instance = instance;
    this.KotHAddress = KotHAddress;
  }

  getAccount: () => Promise<string> = async () => {
    return (await this.Instance.eth.getAccounts())[0];
  };

  captureHill: (amount: number) => Promise<void> = async (amount) => {
    const contract = new this.Instance.eth.Contract(
      abi as AbiItem[],
      this.KotHAddress
    );

    const account = (await this.Instance.eth.getAccounts())[0];
    await contract.methods.capture(amount).send({ from: account });
  };

  authorizedBalance: () => Promise<number> = async () => {
    const tokenAddress = await this.getTokenAddress();
    const tokenContract = new this.Instance.eth.Contract(
      ERC20Abi as AbiItem[],
      tokenAddress
    );

    const user = (await this.Instance.eth.getAccounts())[0];

    const allowance = await tokenContract.methods
      .allowance(user, this.KotHAddress)
      .call();
    return allowance as number;
  };

  createKoth: (reign: number, tokenAddress: string) => Promise<void> = async (
    reign,
    address
  ) => {
    const chainId = await this.Instance.eth.getChainId();
    const contract = new this.Instance.eth.Contract(
      factoryABI as AbiItem[],
      ChainInfos.filter((o) => o.ChainId == chainId)[0].FactoryAddress
    );
    return await contract.methods
      .CreateKotH(reign, address)
      .send({ from: await this.getAccount() });
  };

  claimVictory: () => Promise<void> = async () => {
    const contract = new this.Instance.eth.Contract(
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
    const contract = new this.Instance.eth.Contract(
      abi as AbiItem[],
      this.KotHAddress
    );

    return contract.methods.getTokenAddress().call();
  };

  approveBalance: (num: number) => Promise<void> = async (num) => {
    const contract = new this.Instance.eth.Contract(
      ERC20Abi as AbiItem[],
      await this.getTokenAddress()
    );

    return contract.methods
      .approve(this.KotHAddress, num)
      .send({ from: await this.getAccount() });
  };

  getHillState: () => Promise<HillState> = async () => {
    const contract = new this.Instance.eth.Contract(
      abi as AbiItem[],
      this.KotHAddress
    );
    const king = await contract.methods.king().call();
    const currentValue = await contract.methods.currentAmount().call();
    const expires = await contract.methods.expires().call();
    return {
      king: king,
      value: currentValue,
      expiry: expires,
      captured: (await this.getAccount()) === king,
      allowance: await this.authorizedBalance(),
    };
  };
}
