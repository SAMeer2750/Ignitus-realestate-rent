import React, { useState, useEffect } from "react";
import NFTcard from "../components/NFTcard";
import "./Marketplace.css";
import NFTmodal from "./NFTmodal";
import axios from "axios";
import { ethers } from "ethers";

function Marketplace({ contract, tokenAbi, isConnected, account, signer }) {
  const [nfts, setNfts] = useState([]);
  const [collections, setCollections] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (contract) {
      getAllTokenContracts();
    }
  }, [contract, isConnected, account]);

  useEffect(() => {
    fetchNFTs();
  }, [collections]);

  const getAllTokenContracts = async () => {
    setIsLoading(true);
    const tx = await contract.getAllProperty();
    setCollections(tx);
    setIsLoading(false);
  };

  const getTokenInstance= async (tokenAddress)=>{
    const tokenInstance = new ethers.Contract(
        tokenAddress,
        tokenAbi,
        signer
      );
    return tokenInstance;
  }

  const fetchNFTMetadata = async (tokenURI) => {
    try {
      const response = await axios.get(`https://ipfs.io/ipfs/${tokenURI}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching NFT metadata:", error);
      return null;
    }
  };

  const fetchNFTs = async () => {
    if (collections.length > 0 ) {
      await fetchNFTDetails();
    }
  };

  const fetchNFTDetails = async () => {
    setIsLoading(true);

    const updatedNFTs = await Promise.all(
      collections.map(async (address,index)=>{
          const tokenInstance = await getTokenInstance(address)
          const uri = await tokenInstance.getBaseURI();
          console.log(uri);
          const metadata = await fetchNFTMetadata(uri);
          return {metadata,address};
      })
    )

    console.log("Updated NFTs:", updatedNFTs);
    setNfts(updatedNFTs);
    setIsLoading(false);
  };

  const getOwnerOfCollection = async(tokenAddress)=>{
    const tokenInstance = await getTokenInstance(tokenAddress)
    const owner = await tokenInstance.ownerOf(0);
    console.log(owner);
    return owner;
  }

  return (
    <>
      <div className="Marketplace">
        {isConnected && !isLoading && nfts.length > 0 ? (
          <p className="trending">Trending NFTs 🔥</p>
        ) : null}
        <div className="NFTitems">
          {isConnected && nfts.length > 0 ? (
            <>
              {isLoading ? (
                <>
                  <div className="spinner">
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </div>
                  <div className="overlay"></div>
                </>
              ) : (
                nfts
                  .slice(0)
                  .reverse()
                  .map((nft,index) => (
                    <React.Fragment key={index}>
                      {isConnected && nft.metadata ? (
                        <NFTcard
                          symbol={nft.metadata.symbol.toString()}
                          name={nft.metadata.name.toString()}
                          description={nft.metadata.description.toString()}
                          img={`https://ipfs.io/ipfs/${nft.metadata.imageCID}`}
                          totalSupply={nft.metadata.totalSupply.toString()}
                          address={nft.address.toString()}
                          setSelectedNFT={setSelectedNFT}
                          getOwnerOfCollection={getOwnerOfCollection}
                          nft={nft}
                        />
                      ) : null}
                    </React.Fragment>
                  ))
              )}
            </>
          ) : (
            <>
              <div className="pageTitle">
                <p className="heading">
                  "Step into the captivating realm of RealEstate Rent, where breathtaking real-estate NFTs awaits you to rent them." 
                </p>
              </div>
              <p className="connectWalletMsg">
                Connect your wallet in order to see listed real-estate NFTs.
              </p>
            </>
          )}
        </div>
        {selectedNFT && (
          <>
            <NFTmodal
              nft={selectedNFT}
              contract={contract}
              setSelectedNFT={setSelectedNFT}
            />
            <div className="overlay" onClick={() => setSelectedNFT(null)}></div>
          </>
        )}
      </div>
    </>
  );
}

export default Marketplace;
