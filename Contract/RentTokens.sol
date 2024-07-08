// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import {ERC721} from "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.2.0/contracts/token/ERC721/ERC721.sol";
import {IERC721} from "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/v3.2.0/contracts/token/ERC721/IERC721.sol";

contract RentTokens is ERC721{

    string private baseUri;
    uint256 private immutable TotalSupply;

    constructor (
        string memory _name,
        string memory _symbol,
        string memory _baseURI,
        uint256 _TotalSupply
    ) public ERC721(_name,_symbol){
        baseUri = _baseURI;
        TotalSupply = _TotalSupply;
        for (uint256 i = 0 ; i<_TotalSupply ; i++) 
        {
            _safeMint(tx.origin, i);
        }
    }

    function getTotalSupply() external view returns (uint256){
        return (TotalSupply);
    }

    function getBaseURI() external view returns (string memory){
        return (baseUri);
    }

}