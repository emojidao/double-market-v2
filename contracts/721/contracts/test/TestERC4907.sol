// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "../dualRoles/ERC4907.sol";

contract TestERC4907 is ERC4907 {
    constructor() ERC4907("", "") {}

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }

    function burn(uint256 tokenId) public {
        require(_isApprovedOrOwner(_msgSender(), tokenId), "ERC721: caller is not owner nor approved");
        _burn(tokenId);
    }
}
