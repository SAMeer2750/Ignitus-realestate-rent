import "./App.css";
import { useState, useEffect } from "react";
import UploadNFTForm from "./pages/UploadNFTForm";
import Marketplace from "./pages/Marketplace";
import Navbar from "./components/navbar";
import {
  Sepholia_ContractAddress,
  tokenAbi,
  contractFactoryAbi,
  PloyAmoy_ContractAddress,
  PolyZkEVM_ContractAddress,
  networks,
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
  const [showModal, setShowModal] = useState(false);
  const [selectedNetwork, setSelectedNetwork] = useState(null);

  useEffect(() => {
    loadBcData();
    setupAccountChangeHandler();
  }, []);

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
      else if (chainId == 80002) {
        contractInstance = new ethers.Contract(
          PloyAmoy_ContractAddress,
          contractFactoryAbi,
          signer
        );
        setContract(contractInstance);
        setNetwork("Poly Amoy");
        console.log("connected to:", chainId, "(Polygon Amoy)");
        // alert(`You have connected to Polygon ZkEVM | Chain ID: ${chainId}`);
      } else {
        setNetwork("");
        setShowModal(true);
        // alert(
        //   `Unsupported network with chain ID: ${chainId}. Change the network to Polygon ZkEVM or Sepholia`
        // );
      }
    }
  }

  async function switchNetwork(networkKey) {
    const networkData = networks[networkKey];
    try {
      await window.ethereum.request({
        method: "wallet_addEthereumChain",
        params: [networkData],
      });
      setShowModal(false); // Hide modal after network switch
      loadBcData(); // Reload blockchain data after network switch
    } catch (error) {
      console.log("Failed to switch network", error);
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
      <Navbar
        connectWallet={connectWallet}
        account={account}
        network={network}
      />

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
        <Route
          path="/UploadNFTForm"
          element={<UploadNFTForm contract={contract} />}
        />
      </Routes>
      {showModal && (
        <div className="modal">
          <div className="modal-content">
            <h2>Unsupported Network</h2>
            <p>Please switch to a supported network:</p>
            <button onClick={() => switchNetwork("sepholia")}>
              Switch to Sepholia
            </button>
            <button onClick={() => switchNetwork("polygonAmoy")}>
              Switch to Polygon Amoy
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
