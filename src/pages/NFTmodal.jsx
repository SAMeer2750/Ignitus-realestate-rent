import React, { useEffect, useState } from "react";
import "./NFTmodal.css";
import { ethers } from "ethers";

function NFTmodal({ nft, factoryContract, setSelectedNFT, account, tokenAbi, signer, provider }) {
  const [isOwner, setIsOwner] = useState(false);
  const [id, setId] = useState();
  const [days, setDays] = useState();
  const [owner, setOwner] = useState("");
  const [rentRecord, setRentRecord] = useState([]);
  const [available, setAvailable] = useState(0);
  const [allRented, setAllRented] = useState(false)
  const [rentalStatus, setRentalStatus] = useState({});
  const [price, setPrice] = useState(0)
  const [ETHvalue, setETHvalue] = useState(0)

  useEffect(() => {
    getOwnerOfCollection(nft.address)
    getRentRecord()
    getLatestPriceOfEthInUsd()
  }, [account]);

  const getTokenInstance = async (tokenAddress)=>{
    const tokenInstance = new ethers.Contract(
        tokenAddress,
        tokenAbi,
        signer
      );
    return tokenInstance;
  }

  const getLatestPriceOfEthInUsd = async () => {
    const oneEthInUds = await factoryContract.getLatestPrice();
    setETHvalue(parseInt(oneEthInUds.toString()));
  }

  const getRentInEth = (e)=>{
    const x = (e * 1e8 * 1e18 )/ ETHvalue
    console.log(Math.round(x))
    return Math.round(x)
  } 

  const getRentRecord = async () => {
  const address = nft.address;
  const Rentrecord = [];
  const totalSupply = nft.metadata.totalSupply;
  let availableToken = 0;
  const rentalStatusTemp = {};

  const block = await provider.getBlock('latest');
  const blockTimestamp = block.timestamp;

  for (let id = 0; id < totalSupply; id++) {
    let data = await factoryContract.getRentRecord(address, id);
    if (data.rentedTime == 0) {
      availableToken++;
    } else {
      Rentrecord.push({ data, id });
      rentalStatusTemp[id] = data.rentedTime <= blockTimestamp ? 'Relist' : 'Rented';
    }
  }
  
  setRentRecord(Rentrecord);
  setRentalStatus(rentalStatusTemp);
  setAvailable(availableToken);
  if (availableToken == 0) {
    setAllRented(true);
  }
};

  const getOwnerOfCollection = async(tokenAddress)=>{
    const tokenInstance = await getTokenInstance(tokenAddress)
    const owner = await tokenInstance.ownerOf(0);
    if(owner === account){
      setIsOwner(true)
    }
    setOwner(owner)
  }

  const Rent = async()=>{
    const time = days * 86400
    const rentAmt = getRentInEth(price)
    console.log(rentAmt);
    const tx = await factoryContract.rent(
      nft.address,
      id,
      time,
      { gasLimit: 900000, value: rentAmt }
    )
    await tx.wait();
    setDays("")
    setId("")
    getRentRecord()
    setPrice(0)
  }

  const Relist = async (id)=>{
    const tx = await factoryContract.relive(nft.address,id)
    await tx.wait();
    getRentRecord();
  }

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
                Owner: {owner.toString().slice(0, 6) + "..." + owner.toString().slice(38, 42)}
              </p>
            </div>
            <div className="column2">
              <p className="c2Content">Token Standars: ERC-721</p>
              <p className="c2Content">Available to rent: {available.toString()}</p>
            </div>
          </div>
          {
            !isOwner && (price!=0) ? (<>
            <p>Price: {(getRentInEth(price)/1e18).toFixed(5)} Ξ | {price} USD</p>
            </>):(<></>)
          }
          <div className="buyOrSell relistItems">
            {!isOwner && !allRented ? (
              <>
                <div className="relistItems">
                  <input
                    className="Price-input"
                    type="number"
                    name=""
                    id=""
                    placeholder="Enter days"
                    value={days}
                    onChange={(e) => {
                      setDays(e.target.value);
                      setPrice((e.target.value)*10)
                    }}
                  />
                  <input
                    className="Price-input"
                    type="number"
                    name=""
                    id=""
                    placeholder="Enter Id"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                  />
                  <button
                    onClick={Rent}
                    className="botton-buy update-price"
                  >
                    <strong>Rent</strong>
                  </button>
                </div>
              </>
            ) : !isOwner && allRented ?(
              <>
              <p className="price">
                All tokens are rented in this collection.
              </p>
              </>
            ):(
              <></>
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
                <th>Token Id</th>
                <th>Rented by</th>
                <th>Vacate date (m/d/y)</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {rentRecord.length > 0 ?(
                rentRecord.slice(0).map((item,index) => (
                  <tr key={index}>
                    <td>
                      {item.id}
                    </td>
                    <td>
                      {item.data.rentedBy.toString().slice(0, 6) +
                      "..." +
                      item.data.rentedBy.toString().slice(38, 42)}
                    </td>
                    <td>{convertTimestampToDate(item.data.rentedTime)}</td>

                    

                    {rentalStatus[item.id] === 'Relist' && isOwner ? (
                      <td>
                        <button onClick={() => Relist(item.id)} className="botton-relist update-price">
                          <strong>Relist</strong>
                        </button> 
                      </td>
                      ) : rentalStatus[item.id] === 'Rented' && isOwner ? (
                      <td>Rented</td>) : (<></>)
                    }
                  </tr>
                ))
              ):(
                <tr>
                  <td colSpan="4">None of the tokens are rented</td>
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
