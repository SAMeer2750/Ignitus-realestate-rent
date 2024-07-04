// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;

import {RentTokens} from "contracts/rent.sol";
import {IERC721} from "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract RentFactory{

    modifier NotRented(address add, uint256 id){
        require(!rented[add][id], "already rented");
        _;
    }

    address[] private rentTokenContracts;
    mapping (address => mapping (uint256 => bool)) private rented;
    mapping (address => mapping (uint256 => uint256)) private rentedTime;
    uint256 constant EXCHANGE_RATE = 2;
    uint256 constant EXCHANGE_Precision = 1e2;

    function addProperty(string memory _name,
        string memory _symbol,
        string memory _baseURI,
        uint256 _totalSupply)external {
            RentTokens token = new RentTokens(_name, _symbol, _baseURI, _totalSupply);
            rentTokenContracts.push(address(token));
    }

    function rent(address property, uint256 id, uint256 time) external payable  NotRented(property,id) {
        rented[property][id]=true;
        rentedTime[property][id]=block.timestamp + time;
        address owner = address(RentTokens(property).ownerOf(id));
        uint256 price = (time * EXCHANGE_RATE) / EXCHANGE_Precision;
        (bool sent, ) = payable(owner).call{value: price}("");
        require(sent, "Failed to send Ether");

    }

    function getAllProperty() external view returns (address[]memory){
        return rentTokenContracts;        
    }

}