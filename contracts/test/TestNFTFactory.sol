// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "./ITestNFTInit.sol";
import "./ITestNFT1155Init.sol";

contract TestNFTFactory {
    event Deployed(address nft, string name, string symbol, string uri);
    event Deployed1155(address nft, string uri);
    event Deployed(address nft);

    address public test4907;
    address public test721;
    address public test721Enumerable;
    address public test1155;

    constructor(
        address test4907_,
        address test721_,
        address test721Enumerable_,
        address test1155_
    ) {
        test4907 = test4907_;
        test721 = test721_;
        test721Enumerable = test721Enumerable_;
        test1155 = test1155_;
    }

    function deployTest4907(
        string memory name,
        string memory symbol,
        string memory uri
    ) public returns (address nft) {
        nft = Clones.clone(test4907);
        ITestNFTInit(nft).initialize(name, symbol, uri);
        emit Deployed(nft, name, symbol, uri);
    }

    function deployTest721(
        string memory name,
        string memory symbol,
        string memory uri
    ) public returns (address nft) {
        nft = Clones.clone(test721);
        ITestNFTInit(nft).initialize(name, symbol, uri);
        emit Deployed(nft, name, symbol, uri);
    }

    function deployTest721Enumerable(
        string memory name,
        string memory symbol,
        string memory uri
    ) public returns (address nft) {
        nft = Clones.clone(test721Enumerable);
        ITestNFTInit(nft).initialize(name, symbol, uri);
        emit Deployed(nft, name, symbol, uri);
    }

    function deployTest1155(string memory uri) public returns (address nft) {
        nft = Clones.clone(test1155);
        ITestNFT1155Init(nft).initialize(uri);
        emit Deployed1155(nft, uri);
    }

    function clone(address impl) public returns (address nft) {
        nft = Clones.clone(impl);
        emit Deployed(nft);
    }
}
