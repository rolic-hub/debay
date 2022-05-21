import React, { useState, useEffect, useRef } from "react";
import UAuth from "@uauth/js";
import {ethers} from 'ethers'
import {
  Modal,
  ModalOverlay,
  ModalBody,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  Button,
} from "@chakra-ui/react";
import { useMoralis } from "react-moralis";
import { useIntegraContext } from "../utils/integration";
import metamask from '../assets/metamask.png'
import unstoppable from '../assets/unstoppabledomains.webp'
import wallet from '../assets/wallet.png'

const ConnectWallet = ({ connect, setConnect, setUns }) => {
  const [chain, setchain] = useState("");
  const [chainName, setChainName] = useState("");
  const [loading, setLoading] = useState(false);
  const [auth, setAuth] = useState();
  const [user, setUser] = useState();
  const [Switch, setSwitch] = useState("");
  const { getBalance, Tokenbalance, account } = useIntegraContext();
 
    

  const { authenticate, isAuthenticated, chainId, isWeb3Enabled, Moralis } = useMoralis();
  useEffect(() => {
    if (isAuthenticated) {
      if (chainId === "0x4") {
        setchain("ETH");
        setChainName("Rinkeby Testnet");
      } else if (chainId === "0x13881") {
        setchain("MATIC");
        setChainName("Polygon Mumbai Testnet");
      } else if (chainId === "0x61") {
        setchain("BNB");
        setChainName("Bsc Testnet");
      } else {
      }
    }
  }, [chainId, isAuthenticated]);

  

  const login = async () => {
   try {
      if (!isAuthenticated || !isWeb3Enabled) {
        setSwitch("Metamask");
        await authenticate({ signingMessage: "Welcome to DeBay" });
         getBalance(account);
      }
   } catch (error) {
     console.log(error)
     
   }
  };
  const walletlogin = async () => {
   try {
      setSwitch("Wallet Connect");
     await authenticate({
        provider: "walletConnect",
        signingMessage: "Welcome to DeBay",
      });
      getBalance(account);
      
   } catch (error) {
     
   }
  };
  const uauth = new UAuth({
    clientID: process.env.REACT_APP_CLIENT_ID,
    scope: "openid email wallet",
    redirectUri: "https://debayapp.vercel.app/callback",
  });

  const handleLogin = async () => {
    try {
      setConnect(false);
      setSwitch("Unstoppable");
      const authorization = await uauth.loginWithPopup();
      setConnect(true);
      setUns(true);
      setAuth(authorization);
      getBalance(authorization.idToken.wallet_address);
      
    } catch (error) {
      console.error(error);
    }
  };
  const logout = async () => {
    try {
      await Moralis.User.logOut();
      setSwitch("")
      setConnect(false);
    } catch (error) {
      
    }
  }

  // Logout and delete user
  const handleLogout = async () => {
    await uauth.logout({clientID: process.env.REACT_APP_CLIENT_ID,
    scope: "openid email wallet",
    redirectUri: "https://debayapp.vercel.app/callback",})
    setSwitch("")
    setConnect(false)
   
  };

  useEffect(() => {
    setLoading(true);
    uauth
      .user()
      .then(setUser)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const Display = () => {
    switch (Switch) {
      case "":
        return (
          <>
            <strong style={{ marginTop: "-50px" }}>This project is currently configured for Testnet</strong>
            <br />
            <div>
              <Button onClick={login} style={{ margin: "5px" }}>
                <img
                  style={{ marginRight: "10px" }}
                  height="20px"
                  width="20px"
                  src={metamask}
                  alt="metamask"
                />{" "}
                Login with Metamask
              </Button>
            </div>
            <div>
              <Button onClick={() => walletlogin()} style={{ margin: "5px" }}>
                <img
                  style={{ marginRight: "10px" }}
                  height="40px"
                  width="20px"
                  src={wallet}
                  alt="wallet-connect"
                />{" "}
                Login with WalletConnect
              </Button>
            </div>
            <div>
              <Button onClick={() => handleLogin()} style={{ margin: "5px" }}>
                <img
                  style={{ marginRight: "10px" }}
                  height="40px"
                  width="20px"
                  src={unstoppable}
                  alt="unstoppable-domain"
                />{" "}
                Unstoppable Domain
              </Button>
            </div>
          </>
        );
        case "Metamask" :
          return (
            <div>
              <strong>Address: {account}</strong> <br />
              <strong>
                Balance: {Tokenbalance} {chain}
              </strong>
              <br />
              <strong>Network: {chainName}</strong>
              <br />
              <Button style={{ marginLeft: "200px" }} onClick={() => logout()}>
                Logout
              </Button>
            </div>
          );
          case "Wallet Connect" :
            return (
              <div>
                <strong>Address: {account}</strong> <br />
                <strong>
                  Balance: {Tokenbalance} {chain}
                </strong>
                <br />
                <strong>Network: {chainName}</strong>
                <br />
                <Button style={{marginLeft: "200px"}} onClick={() => logout()}>Logout</Button>
              </div>
            );
            case "Unstoppable":
              return (
                <div>
                  <strong>Name: {auth.idToken.sub}</strong>
                  <strong>Email: {auth.idToken.email}</strong>
                  <strong>Address: {auth.idToken.wallet_address}</strong>
                  <strong>Balance: {Tokenbalance}</strong>
                  <Button
                    style={{ marginLeft: "200px" }}
                    onClick={() => handleLogout()}
                  >
                    Logout
                  </Button>
                </div>
              );

      default:
        break;
    }
  };

  return (
   <div style={{marginTop: '-500px'}}>
      <Modal
      bgColor="white"
      onClose={() => setConnect(false)}
      isOpen={connect}
      isCentered
      size="xs"
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>LOGIN</ModalHeader>
        <ModalCloseButton />
        <ModalBody
          style={{
            margin: "5px", marginTop:"-10px"
          }}
        >
          <Display/>
        </ModalBody>
      </ModalContent>
    </Modal>
   </div>
  );
};

export default ConnectWallet;
