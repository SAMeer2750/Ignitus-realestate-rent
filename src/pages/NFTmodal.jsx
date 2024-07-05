import React, { useEffect, useState } from "react";
import "./NFTmodal.css";
import { ethers } from "ethers";

function NFTmodal({ nft, contract, setSelectedNFT }) {
  // const [history, setHistory] = useState([]);
  // const [isOwner, setIsOwner] = useState(false);
  // const [listed, setListed] = useState(false);
  // const [price, setPrice] = useState(null);
  // const [volume, setVolume] = useState(0);
  const [creator, setCreator] = useState("");

  useEffect(() => {
    // getHistory(nft.tokenId.toString());
    // IsOwner(nft.tokenId.toString());
    // listStatus(nft.tokenId.toString());
    // getVolume(nft.tokenId.toString());
    // getTokenCreator(nft.tokenId.toString());
  }, [nft.tokenId]);


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
            {nft.metadata.name.toString()} #{nft.metadata.symbol.toString()}
          </p>

          <p className="address">Collection: 
            {nft.address.toString().slice(0, 6) +
              "..." +
              nft.address.toString().slice(38, 42)}
          </p>
          <hr />

          <div className="column">
            <div className="column1">
              <p className="c1Content">
                Total Supply: {nft.metadata.totalSupply.toString()} Fractions
              </p>
              <p className="c1Content">
                Creator: {nft.address.toString().slice(0, 6) + "..." + nft.address.toString().slice(38, 42)}
              </p>
            </div>
            <div className="column2">
              <p className="c2Content">Token Standars: ERC-721</p>
              <p className="c2Content">Available: {nft.metadata.totalSupply.toString()}</p>
              {/* <p className="c2Content">Token ID: {nft.tokenId.toString()}</p> */}
            </div>
          </div>
          {/* <div className="buyOrSell relistItems">
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
          </div> */}
          <hr />
          <p className="description">{nft.metadata.description}</p>
        </div>
      </div>
      {/* <div className="lowerContent">
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
      </div> */}
    </div>
  );
}

export default NFTmodal;
