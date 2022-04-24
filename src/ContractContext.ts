import Web3 from "web3";
import { HillState } from "./components/HillCard";
import { abi } from "./KotH.json";
import { abi as ERC20Abi } from "./IERC20.json";
import { AbiItem } from "web3-utils";
import { abi as factoryABI } from "./KotHFactory.json";
import { ChainInfos } from "./Chains.json";
import { HistoryItemProps } from "./components/HistoryItem";

export interface IChainContext {
  getHillState: () => Promise<HillState>;
  captureHill: (amount: number) => Promise<void>;
  authorizedBalance: () => Promise<number>;
  approveBalance: (num: number) => Promise<void>;
  claimVictory: () => Promise<void>;
  createKoth: (reignSeconds: number, address: string) => Promise<void>;
  getCaptures: () => Promise<HistoryItemProps[]>;
}

export class ChainContext implements IChainContext {
  private KotHAddress: string;
  private TokenAddress: string | undefined;

  constructor(KotHAddress: string) {
    this.KotHAddress = KotHAddress;
  }

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

  approveBalance: (num: number) => Promise<void> = async (num) => {
    const contract = new new Web3(Web3.givenProvider).eth.Contract(
      ERC20Abi as AbiItem[],
      await this.getTokenAddress()
    );

    return contract.methods
      .approve(this.KotHAddress, num)
      .send({ from: await this.getAccount() });
  };

  getHillState: () => Promise<HillState> = async () => {
    const contract = new new Web3(Web3.givenProvider).eth.Contract(
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
}

const kingString: string = "king";
const amountString: string = "amount";
