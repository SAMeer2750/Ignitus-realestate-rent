import "./App.css";
import { useState, useEffect } from "react";
import UploadNFTForm from "./pages/UploadNFTForm";
import Marketplace from "./pages/Marketplace";
import Navbar from "./components/navbar";
import {
  Sepholia_ContractAddress,
  tokenAbi,
  contractFactoryAbi,
  PolyZkEVM_ContractAddress,
} from "./constant";
import { ethers } from "ethers";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  const [provider, setProvider] = useState(null);
  const [account, setAccount] = useState(null);
  const [signer, setSigner] = useState(null);
  const [contract, setContract] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [network, setNetwork] = useState(null)

  useEffect(() => {
    loadBcData();
    setupAccountChangeHandler();
  }, []);

  // const networks = {
  //   polygon: {
  //     chainId: `0x${Number(80001).toString(16)}`,
  //     chainName: "Polygon Testnet",
  //     nativeCurrency: {
  //       name: "MATIC",
  //       symbol: "MATIC",
  //       decimals: 18,
  //     },
  //     rpcUrls: ["https://rpc-mumbai.maticvigil.com/"],
  //     blockExplorerUrls: ["https://mumbai.polygonscan.com/"],
  //   },
  // };

  async function loadBcData() {
    if (window.ethereum) {
      const provider = new ethers.providers.Web3Provider(
        window.ethereum,
        "any"
      );
      setProvider(provider);
      const signer = provider.getSigner();
      setSigner(signer);
      const { chainId } = await provider.getNetwork();
      let contractInstance;
      if(chainId==11155111){
        contractInstance = new ethers.Contract(
          Sepholia_ContractAddress,
          contractFactoryAbi,
          signer
        );
        setContract(contractInstance);
        setNetwork("Seph");
        console.log("connected to:", chainId, "(Seph)");
        // alert(`You have connected to Sepholia | Chain ID: ${chainId}`);
      }
      else if(chainId==2442){
        contractInstance = new ethers.Contract(
          PolyZkEVM_ContractAddress,
          contractFactoryAbi,
          signer
        );
        setContract(contractInstance);
        setNetwork("PolyZk");
        console.log("connected to:", chainId, "(PolyZkEVM)");
        // alert(`You have connected to Polygon ZkEVM | Chain ID: ${chainId}`);
      }
      else{        
        setNetwork("");
        alert(`Unsupported network with chain ID: ${chainId}. Change the network to Polygon ZkEVM or Sepholia`);
      }
    }
  }

  async function connectWallet() {
    if (window.ethereum) {
      try {
        await window.ethereum.request({ method: "eth_requestAccounts" });
        // if (provider.network.chainId !== networks.polygon.chainId) {
        //   await window.ethereum.request({
        //     method: "wallet_addEthereumChain",
        //     params: [networks.polygon],
        //   });
        // }
        const address = await signer.getAddress();
        console.log("Metamask Connected to " + address);
        setAccount(address);
        setIsConnected(true);
      } catch (err) {
        console.log(err);
      }
    }
  }

  function handleAccountChange(newAccounts) {
    if (newAccounts.length > 0) {
      const address = newAccounts[0];
      console.log("Metamask Connected to " + address);
      setAccount(address);
      setIsConnected(true);
    } else {
      console.log("Metamask Disconnected");
      setAccount(null);
      setIsConnected(false);
    }
  }

  function setupAccountChangeHandler() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", handleAccountChange);
    }
  }

  return (
    <div className="App">
      <Navbar connectWallet={connectWallet} account={account} network={network}/>

      <Routes>
        <Route
          path="/"
          element={
            <Marketplace
              factoryContract={contract}
              tokenAbi={tokenAbi}
              isConnected={isConnected}
              account={account}
              signer={signer}
              provider={provider}
            />
          }
        />
        {/* <Route
          path="/MyNFTs"
          element={
            <MyNFTs
              contract={contract}
              isConnected={isConnected}
              account={account}
            />
          }
        /> */}
        <Route
          path="/UploadNFTForm"
          element={<UploadNFTForm contract={contract} />}
        />
      </Routes>
    </div>
  );
}

export default App;
