import React, { useEffect, useState } from "react";
import "./NFTmodal.css";
import { ethers } from "ethers";

function NFTmodal({ nft, contract, setSelectedNFT }) {
  const [history, setHistory] = useState([]);
  const [isOwner, setIsOwner] = useState(false);
  const [listed, setListed] = useState(false);
  const [price, setPrice] = useState(null);
  const [volume, setVolume] = useState(0);
  const [creator, setCreator] = useState("");

  useEffect(() => {
    getHistory(nft.tokenId.toString());
    IsOwner(nft.tokenId.toString());
    listStatus(nft.tokenId.toString());
    getVolume(nft.tokenId.toString());
    getTokenCreator(nft.tokenId.toString());
  }, [nft.tokenId]);

  const getTokenCreator = async (tokenId) => {
    const tx = await contract.getCreator(tokenId);
    setCreator(tx);
  };

  const getHistory = async (tokenId) => {
    const tx = await contract.getTokenHistory(tokenId);
    setHistory(tx);
  };

  const getVolume = async (tokenId) => {
    const tx = await contract.getNftVolume(tokenId);
    setVolume(tx);
  };

  const Relist = async () => {
    try {
      let listingPrice = await contract.getListPrice();
      listingPrice = listingPrice.toString();
      const tx = await contract.reListToken(
        nft.tokenId.toString(),
        ethers.utils.parseEther(price),
        { gasLimit: 900000, value: listingPrice }
      );
      await tx.wait();
      window.location.reload();
    } catch (error) {
      console.error("Error relisting token:", error);
    }
  };

  const IsOwner = async (tokenId) => {
    const tx = await contract.addressChecker(tokenId);
    setIsOwner(tx);
  };

  const listStatus = async (tokenId) => {
    const tx = await contract.isCurrentlyListed(tokenId);
    setListed(tx);
  };

  const handleSale = async () => {
    try {
      const tx = await contract.executeSale(nft.tokenId.toString(), {
        value: nft.price.toString(),
        gasPrice: ethers.utils.parseUnits("150", "gwei"),
        gasLimit: 900000,
      });
      await tx.wait();
      window.location.reload();
    } catch (error) {
      console.error("Error executing sale:", error);
    }
  };

  const convertTimestampToDate = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  return (
    <div className="NFTmodal">
      <div className="upperContent">
        <div className="left">
          <img src={`https://ipfs.io/ipfs/${nft.metadata.imageCID}`} alt="" />
        </div>
        <div className="right">
          <p className="title">
            {nft.metadata.name} #{nft.tokenId.toString()}
          </p>

          <p className="address">
            {nft.seller.toString().slice(0, 6) +
              "..." +
              nft.seller.toString().slice(38, 42)}
          </p>
          <hr />

          <div className="column">
            <div className="column1">
              <p className="c1Content">
                Volume: {volume.toString() / 1000000000000000000} MATIC
              </p>
              <p className="c1Content">
                Creator: {creator.slice(0, 6) + "..." + creator.slice(38, 42)}
              </p>
            </div>
            <div className="column2">
              <p className="c2Content">Token Standars: ERC-721</p>
              <p className="c2Content">Token ID: {nft.tokenId.toString()}</p>
            </div>
          </div>
          <div className="buyOrSell relistItems">
            {!isOwner ? (
              <p className="price">
                Price: {nft.price.toString() / 1000000000000000000} MATIC
              </p>
            ) : (
              <></>
            )}
            {isOwner && listed ? (
              <>
                <div className="relistItems">
                  <input
                    className="Price-input"
                    type="number"
                    name=""
                    id=""
                    placeholder="Enter price (in MATIC)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <button
                    onClick={Relist}
                    className="botton-relist update-price"
                  >
                    <strong>Relist</strong>
                  </button>
                </div>
              </>
            ) : isOwner && !listed ? (
              <>
                <div className="relistItems">
                  <input
                    className="Price-input"
                    type="number"
                    name=""
                    id=""
                    placeholder="Enter price (in MATIC)"
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                  />
                  <button onClick={Relist} className="botton-relist">
                    <strong>Sell</strong>
                  </button>
                </div>
              </>
            ) : (
              <button onClick={handleSale} className="botton-buy">
                <strong>BUY</strong>
              </button>
            )}
          </div>
          <hr />
          <p className="description">{nft.metadata.description}</p>
        </div>
      </div>
      <div className="lowerContent">
        <div className="history">
          <table>
            <thead>
              <tr>
                <th>From</th>
                <th>To</th>
                <th>Event</th>
                <th>Time</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history
                  .slice(0)
                  .reverse()
                  .map((historyItem, index) => (
                    <tr key={index}>
                      <td>
                        {historyItem.soldBy.toString().slice(0, 6) +
                          "..." +
                          historyItem.soldBy.toString().slice(38, 42)}
                      </td>
                      <td>
                        {historyItem.soldTo.toString().slice(0, 6) +
                          "..." +
                          historyItem.soldTo.toString().slice(38, 42)}
                      </td>
                      <td>{historyItem.message.toString()}</td>
                      <td>{convertTimestampToDate(historyItem.timeStamp)}</td>
                    </tr>
                  ))
              ) : (
                <tr>
                  <td colSpan="4">No history available</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default NFTmodal;
