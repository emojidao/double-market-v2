// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DoNFTV2.sol";
import "../dualRoles/wrap/IWrapNFT.sol";

contract DoNFTWrapModel is DoNFTV2 {
    function initialize(
        string memory name_,
        string memory symbol_,
        address market_,
        address owner_,
        address admin_
    ) public initializer {
        _initialize(name_, symbol_, market_, owner_, admin_);
    }

    function getModelType() public view virtual returns (DoNFTModelType) {
        return DoNFTModelType.WrapModel;
    }

    function mintVNft(address wrapNftAddress, uint256 originalNftId)
        public
        virtual
        nonReentrant
        returns (uint256 tid)
    {
        require(oid2vid[wrapNftAddress][originalNftId] == 0, "already minted");
        address oNFTAddress = IWrapNFT(wrapNftAddress).originalAddress();
        address lastOwner = IERC721(oNFTAddress).ownerOf(originalNftId);
        require(
            onlyApprovedOrOwner(msg.sender, oNFTAddress, originalNftId),
            "only approved or owner"
        );
        IERC721(oNFTAddress).transferFrom(
            lastOwner,
            address(this),
            originalNftId
        );
        IERC721(oNFTAddress).approve(wrapNftAddress, originalNftId);
        uint256 wNftId = IWrapNFT(wrapNftAddress).stake(originalNftId);

        tid = mintDoNft(
            lastOwner,
            wrapNftAddress,
            wNftId,
            uint40(block.timestamp),
            type(uint40).max
        );
        oid2vid[wrapNftAddress][wNftId] = tid;
        IERC4907(wrapNftAddress).setUser(
            originalNftId,
            lastOwner,
            type(uint64).max
        );
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

        IWrapNFT(info.originalNftAddress).redeem(info.originalNftId);
        address oNFTAddress = IWrapNFT(info.originalNftAddress)
            .originalAddress();
        ERC721(oNFTAddress).safeTransferFrom(
            address(this),
            ownerOf(tokenId),
            info.originalNftId
        );

        _burnVNft(tokenId);
    }
}
