// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DoNFTV2.sol";


contract DoNFT4907Model is DoNFTV2 {

    function initialize(
        string memory name_,
        string memory symbol_,
        address market_,
        address owner_,
        address admin_) public initializer {
        _initialize(name_, symbol_, market_, owner_, admin_);
    }
   
    function getModelType() public virtual view returns (DoNFTModelType) {
        return DoNFTModelType.ERC4907Model;
    }

    function mintVNft(address originalNftAddress, uint256 originalNftId)
        public
        virtual
        nonReentrant
        returns (uint256 tid)
    {   
    
        require(oid2vid[originalNftAddress][originalNftId] == 0, "already minted");
        require(onlyApprovedOrOwner(msg.sender, originalNftAddress, originalNftId), "only approved or owner");
        address lastOwner = IERC721(originalNftAddress).ownerOf(originalNftId);
        IERC721(originalNftAddress).transferFrom(lastOwner, address(this), originalNftId);
        
        tid = mintDoNft(
            lastOwner,
            originalNftAddress,
            originalNftId,
            uint40(block.timestamp),
            type(uint40).max
        );
        oid2vid[originalNftAddress][originalNftId] = tid;

        IERC4907(originalNftAddress).setUser(originalNftId, lastOwner, type(uint64).max);
    }


    function redeem(uint256 tokenId)
        public
        virtual
        override
    {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );
        require(couldRedeem(tokenId), "cannot redeem");
        DoNftInfoV2 storage info = doNftMapping[tokenId];

        ERC721(info.originalNftAddress).safeTransferFrom(
            address(this),
            ownerOf(tokenId),
            info.originalNftId
        );
        _burnVNft(tokenId);
    
    }

}
