import React, { useState, useEffect } from "react";
import "./NFTcard.css";

function NFTcard({
  symbol,
  name,
  description,
  img,
  totalSupply,
  address,
  setSelectedNFT,
  nft,
}) {
  const handleClick = () => {
    setSelectedNFT(nft);
  };

  return (
    <div className="NFTcard" onClick={handleClick}>
      <div className="image">
        {/* eslint-disable-next-line */}
        <img src={img} />
      </div>
      <div className="details">
        <div className="left">
          <p className="title">{name}</p>
          <p className="address">
            {address.slice(0, 6) + "..." + address.slice(38, 42)}
          </p>
        </div>
        <div className="right">
          <p className="id">#{symbol}</p>
          <p className="price">{totalSupply} Fractions</p>
        </div>
      </div>
    </div>
  );
}

export default NFTcard;
