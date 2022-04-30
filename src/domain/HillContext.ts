import Web3 from "web3";
import { CaptureEvent } from "../components/CaptureEvent";
import { HillState } from "../HillState";
import { abi } from "../KotH.json";
import { AbiItem } from "web3-utils";
import { abi as ERC20Abi } from "../IERC20.json";
import { IChainContext } from "./IChainContext";
import { IHillContext } from "./IHillContext";

export class HillContext implements IHillContext {
  private web3: Web3;
  private address: string;
  private chainContext: IChainContext;
  private tokenAddress: string | undefined;

  constructor(address: string, chainContext: IChainContext) {
    this.address = address;
    this.chainContext = chainContext;
    this.web3 = new Web3(Web3.givenProvider);
  }

  getChainContext: () => IChainContext = () => this.chainContext;

  getAddress: () => string = () => this.address;

  getHillState: () => Promise<HillState> = async () => {
    const contract = new this.web3.eth.Contract(abi as AbiItem[], this.address);
    const king = await contract.methods.king().call();
    return {
      king: king,
      value: await contract.methods.currentAmount().call(),
      expiry: await contract.methods.expires().call(),
      captured: (await this.chainContext.getAccount()) === king,
      allowance: await this.authorizedBalance(),
      token: await contract.methods.tokenAddress().call(),
      address: this.address,
    };
  };

  captureHill: (amount: number) => Promise<void> = async (amount) => {
    console.log(amount);
    const contract = new this.web3.eth.Contract(abi as AbiItem[], this.address);

    const account = await this.getChainContext().getAccount();
    await contract.methods.capture(amount).send({ from: account });
  };

  getTokenAddress: () => Promise<string> = () => {
    if (this.tokenAddress !== undefined) {
      return this.tokenAddress;
    }
    const contract = new this.web3.eth.Contract(abi as AbiItem[], this.address);

    return contract.methods.getTokenAddress().call();
  };

  authorizedBalance: () => Promise<number> = async () => {
    const tokenAddress = await this.getTokenAddress();
    const tokenContract = new this.web3.eth.Contract(
      ERC20Abi as AbiItem[],
      tokenAddress
    );

    const user = (await this.web3.eth.getAccounts())[0];

    const allowance = await tokenContract.methods
      .allowance(user, this.address)
      .call();

    return allowance as number;
  };

  approveBalance: (num: number) => Promise<void> = async (num) => {
    const contract = new this.web3.eth.Contract(
      ERC20Abi as AbiItem[],
      await this.getTokenAddress()
    );
    return contract.methods
      .approve(await this.getTokenAddress(), num)
      .send({ from: await this.chainContext.getAccount() });
  };

  claimVictory: () => Promise<void> = async () => {
    const contract = new this.web3.eth.Contract(abi as AbiItem[], this.address);
    const account = await this.chainContext.getAccount();
    return await contract.methods.claimVictory(account).send({ from: account });
  };

  getCaptures: () => Promise<CaptureEvent[]> = async () => {
    const contract = new this.web3.eth.Contract(abi as AbiItem[], this.address);
    const data = await contract.getPastEvents("Captured", {
      fromBlock: 0,
      toBlock: "latest",
    });
    console.log(data);
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
