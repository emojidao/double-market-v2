// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./OwnableContract.sol";
import "../dualRoles/IERC4907.sol";
import "../dualRoles/wrap/IWrapNFTUpgradeable.sol";
import "@openzeppelin/contracts/proxy/Clones.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";

contract DoubleFactory is OwnableContract {
    event DeployWNFT(
        address wNFT,
        string name,
        string symbol,
        address originalAddress
    );

    address public wNFTImpl;

    constructor(
        address owner_,
        address admin_,
        address wNFTImpl_
    ) {
        initOwnableContract(owner_, admin_);
        wNFTImpl = wNFTImpl_;
    }

    function setWNFTImpl(address wNFTImpl_) public onlyAdmin {
        wNFTImpl = wNFTImpl_;
    }

    function deployWNFT(
        string memory name,
        string memory symbol,
        address originalAddress
    ) public returns (address wNFT) {
        require(
            IERC165(originalAddress).supportsInterface(
                type(IERC721).interfaceId
            ),
            "not ERC721"
        );
        require(
            !IERC165(originalAddress).supportsInterface(
                type(IERC4907).interfaceId
            ),
            "the NFT is IERC4907 already"
        );
        wNFT = Clones.clone(wNFTImpl);
        IWrapNFTUpgradeable(wNFT).initialize(name, symbol, originalAddress);
        emit DeployWNFT(address(wNFT), name, symbol, originalAddress);
    }
}
