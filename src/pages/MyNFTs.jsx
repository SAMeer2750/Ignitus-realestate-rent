import React from "react";
import "./MyNFTs.css";
import { useState, useEffect } from "react";
import NFTcard from "../components/NFTcard";
import NFTmodal from "./NFTmodal";

import axios from "axios";

function MyNFTs({ contract, isConnected, account }) {
  const [nfts, setNfts] = useState([]);
  const [selectedNFT, setSelectedNFT] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (contract && isConnected) {
      getMyNFTs();
    }
  }, [contract, isConnected, account]);

  const getMyNFTs = async () => {
    setIsLoading(true);
    const tx = await contract.getMyNFTs();
    setNfts(tx);
    setIsLoading(false);
  };

  const fetchNFTMetadata = async (tokenURI) => {
    try {
      const response = await axios.get(`https://ipfs.io/ipfs/${tokenURI}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching NFT metadata:", error);
      return null;
    }
  };

  useEffect(() => {
    const fetchNFTDetails = async () => {
      setIsLoading(true);
      const updatedNFTs = await Promise.all(
        nfts.map(async (nft) => {
          const uri = await contract.tokenURI(nft.tokenId);
          const metadata = await fetchNFTMetadata(uri);
          console.log("Metadata for tokenId", nft.tokenId, ":", metadata);
          return { ...nft, metadata };
        })
      );
      console.log("Updated NFTs:", updatedNFTs);
      setNfts(updatedNFTs);
      setIsLoading(false);
    };

    const fetchNFTs = async () => {
      if (nfts.length > 0 && !nfts[0].metadata) {
        await fetchNFTDetails();
      }
    };

    fetchNFTs();
  }, [nfts]); // Wrap `nfts` in a function

  return (
    <div className="MyNFTs">
      {(isConnected && !isLoading && nfts.length > 0) ?(
        <p className="MyNft">Your NFTs 🤖</p>
      ):(null)}
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
                .map((nft) => (
                  <React.Fragment key={nft.tokenId}>
                    {isConnected && nft.metadata ? (
                      <NFTcard
                        id={nft.tokenId.toString()}
                        title={nft.metadata.name}
                        description={nft.metadata.description}
                        img={`https://ipfs.io/ipfs/${nft.metadata.imageCID}`}
                        price={nft.price.toString()}
                        seller={nft.seller.toString()}
                        setSelectedNFT={setSelectedNFT}
                        nft={nft}
                      />
                    ) : null}
                  </React.Fragment>
                ))
            )}
          </>
        ) : (
          <p className="noNft">You do not have any NFT. Buy now from Marketplace or mint your own.</p>
        )}
      </div>
      <div>
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
    </div>
  );
}

export default MyNFTs;
