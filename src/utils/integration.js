import React, { createContext, useContext, useState, useEffect } from "react";
import { useMoralis, useMoralisWeb3Api } from "react-moralis";
import { ethers } from "ethers";
import { pAbi, EAbi, bAbi, DeAbi } from "./contracts";
import {
  BsccontractAddress,
  EthcontractAddress,
  PolcontractAddress,
  EthNftAddress,
  PolNftAdress,
  BscNftAddress,
} from "./contracts";
import { useApiContext } from "./ApiCode";

const IntegrationContext = createContext();

const { ethereum } = window;

const getContract = (contractAddress, Abi) => {
  const provider = new ethers.providers.Web3Provider(ethereum);
  const signer = provider.getSigner();
  const transactionContract = new ethers.Contract(contractAddress, Abi, signer);
  return transactionContract;
};

export const Integration = ({ children }) => {
  const [dataFeed, setdataFeed] = useState(0);
  const [Delivery, setDelivery] = useState("");

  const [balance, setBalance] = useState([]);
  const [Tokenbalance, setTokenBalance] = useState(0);
  const [Account, setAccount] = useState("");
  const [contract, setContract] = useState();
  const [total, setTotal] = useState(0);
  const [bar, setBar] = useState(0);

  const { isAuthenticated, chainId, Moralis, account } = useMoralis();
  const { cartPage, setCartPage } = useApiContext();

  const Web3Api = useMoralisWeb3Api();
  const [options, setOptions] = useState({
    chain: "0x4",
    format: "decimal",
    address: account,
    token_address: EthNftAddress,
  });
  let balanceOfNft = [];
  let progressBar = [];

  const ChainPrice = async (Address, abi) => {
    const feed = await getContract(Address, abi);
    const data = await feed.getLatestPrice();
    const dataFe = (data / 10 ** 8).toFixed(2);
    setdataFeed(dataFe);
  };
  const getNft = async () => {
    if (isAuthenticated) {
      if (chainId === "0x4") {
        setOptions({
          chain: "0x4",
          format: "decimal",
          address: account,
          token_address: EthNftAddress,
        });
      } else if (chainId === "0x13881") {
        setOptions({
          chain: "0x13881",
          format: "decimal",
          address: account,
          token_address: PolNftAdress,
        });
      } else if (chainId === "0x61") {
        setOptions({
          chain: "0x61",
          format: "decimal",
          address: account,
          token_address: BscNftAddress,
        });
      }
      const nftData = await Web3Api.Web3API.account.getNFTsForContract(options);
      const result = nftData.result;

      if (result.length > 0) {
        result.forEach((element) => {
          balanceOfNft.push(
            element.token_uri.replace("https://ipfs.moralis.io:2053/", "")
          );
          const number = element.token_id * 30 * element.amount;
          progressBar.push(number);
        });
        balanceOfNft.forEach(async (element) => {
          const response = await fetch(element);
          const data = await response.json();

          setBalance(data);
        });
        const reducer = (accumulator, curr) => accumulator + curr;
        const value = progressBar.reduce(reducer);
        setBar(value);
      }
    }
  };
  const condition = async () => {
    try {
      if (chainId === "0x4") {
        const deploy = await getContract(EthNftAddress, DeAbi);
        setContract(deploy);
      } else if (chainId === "0x13881") {
        const deploy = await getContract(PolNftAdress, DeAbi);
        setContract(deploy);
      } else if (chainId === "0x61") {
        const deploy = await getContract(BscNftAddress, DeAbi);
        setContract(deploy);
      } else return;
    } catch (error) {
      console.log(error);
    }
  };
  const mintNft = async (id, amount) => {
    try {
      if (chainId === "0x4") {
        const deploy = await getContract(EthNftAddress, DeAbi);
        const minting = await deploy.mint(account, id, amount, []);
        await minting.wait();
        console.log(await minting.hash());
      } else if (chainId === "0x13881") {
        const deploy = await getContract(PolNftAdress, DeAbi);
        const minting = await deploy.mint(account, id, amount, []);
        await minting.wait();
      } else if (chainId === "0x61") {
        const deploy = await getContract(BscNftAddress, DeAbi);
        const minting = await deploy.mint(account, id, amount, []);
        await minting.wait();
      } else return unsupported();
    } catch (error) {
      console.error(error);
    }
  };
  
  const getBalance = async (account) => {
    await Moralis.start({
      serverUrl: process.env.REACT_APP_MORALIS_SERVER,
      appId: process.env.REACT_APP_MORALIS_APPID,
    });
     const bOptions = {
       chain: chainId,
       address: account,
     };
    const get = await Web3Api.Web3API.account.getNativeBalance(bOptions);
    const result = get.balance;
    const convert = Moralis.Units.FromWei(result);
    
    setTokenBalance(convert);
  };

  const burn = async (address, id, value) => {
    try {
      condition();
      const burnNft = await contract.burn(address, id, value);
      await burnNft.wait();
      console.log(await burnNft.hash());
    } catch (error) {}
  };

  const unsupported = () => {
    return <p>Chain unsupported</p>;
  };
  useEffect(() => {
    if (isAuthenticated) {
      console.log(chainId);
      if (chainId === "0x4") {
        ChainPrice(EthcontractAddress, EAbi);
        getNft();
      } else if (chainId === "0x13881") {
        ChainPrice(PolcontractAddress, pAbi);
        getNft();
      } else if (chainId === "0x61") {
        ChainPrice(BsccontractAddress, bAbi);
      } else {
        setdataFeed(1);
        console.log("Chain unsupported");
        unsupported();
      }
    }
  }, [chainId, isAuthenticated]);

  const totalPrice = (price, delivery) => {
    const sum = price + delivery;
    setTotal(sum);
  };
  const DisplayByChain = (price, name) => {
    switch (chainId) {
      case "0x4":
        return (
          <p>
            {name}: {price} Eth
          </p>
        );
      case "0x13881":
        return (
          <p>
            {name}: {price} MATIC
          </p>
        );
      case "0x61":
        return (
          <p>
            {name}: {price} BNB
          </p>
        );

      default:
        break;
    }
  };

  const handleOk = async (product) => {
    try {
      if (cartPage.length > 0) {
        const price = total / dataFeed;

        const options = {
          type: "native",
          amount: Moralis.Units.ETH(price.toFixed(18)),
          receiver: "0x9353CdB9598937A9a9DD1D792A4D822EE8415E8D",
        };

        const result = await Moralis.transfer(options);
        const reciept = await result.wait();
        console.log(result.hash);

        //Save Transaction Details to DB
        const Transaction = Moralis.Object.extend("Transaction");
        const transaction = new Transaction();

        transaction.set("Customer", account);
        transaction.set("Delivery", Delivery);
        transaction.set("Product", product?.title);
        transaction.set("ProductImage", product?.image);

        transaction.save();
        setCartPage([]);
        await mintNft();
        await getNft();
      }
    } catch (error) {
      console.log(error);
    }
    // Send eth to book store owenr address
  };

  return (
    <IntegrationContext.Provider
      value={{
        dataFeed,
        Account,
        chainId,
        isAuthenticated,
        handleOk,
        setDelivery,
        totalPrice,
        total,
        account,
        balance,
        Price: DisplayByChain,
        bar,
        getBalance,
        Tokenbalance,
      }}
    >
      {children}
    </IntegrationContext.Provider>
  );
};

export const useIntegraContext = () => useContext(IntegrationContext);
