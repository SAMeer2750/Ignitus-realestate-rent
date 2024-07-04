// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract RentTokens is ERC721{

    string private baseUri;
    uint256 private immutable totalSupply;

    constructor(
        string memory _name,
        string memory _symbol,
        string memory _baseURI,
        uint256 _totalSupply
    )ERC721(_name,_symbol){
        baseUri = _baseURI;
        totalSupply = _totalSupply;
        for (uint256 i = 0 ; i<_totalSupply ; i++) 
        {
            _safeMint(tx.origin, i);
        }
    }

    function getTotalSupply() external view returns (uint256){
        return (totalSupply);
    }

    function getBaseURI() external view returns (string memory){
        return (baseUri);
    }

}