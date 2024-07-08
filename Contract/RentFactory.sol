// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import {RentTokens} from "contracts/rent.sol";

contract RentFactory{

    modifier NotRented(address add, uint256 id){
        require(!rented[add][id], "already rented");
        _;
    }

    modifier Rented(address add, uint256 id){
        require(rented[add][id], "not rented");
        _;
    }

    struct RENT{
        address rentedBy;
        uint256 rentedTime;
    }

    address[] private rentTokenContracts;
    mapping (address => mapping (uint256 => bool)) private rented;
    mapping (address => mapping (uint256 => RENT)) private rentRecord;
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
        // require(time > 86399, "time");
        rented[property][id]=true;
        rentRecord[property][id]=RENT(msg.sender, (block.timestamp + time));

        uint256 price = getCalculatedPrice(time);
        require(msg.value >= price, "not enough balance");
        
        address owner = address(RentTokens(property).ownerOf(id));
        (bool sent, ) = payable(owner).call{value: price}("");
        require(sent, "Failed to send Ether");

    }


    function relive(address property, uint256 id) external Rented(property,id) {
        require(msg.sender == address(RentTokens(property).ownerOf(id)),"Not owner");
        require(block.timestamp > rentRecord[property][id].rentedTime, "Not time");
        
        rented[property][id]=false;
        rentRecord[property][id]=(RENT(address(0), 0));
    }

    function getCalculatedPrice(uint256 time)internal pure  returns(uint256){
        uint256 price = (time * EXCHANGE_RATE) / EXCHANGE_Precision;
        return price;
    }

    function getAllProperty() external view returns (address[]memory){
        return rentTokenContracts;        
    }

    function getRentRecord(address property, uint256 id)external view returns (RENT memory){
        return rentRecord[property][id];
    }

}