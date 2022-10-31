// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract TestERC721 is ERC721 {
    constructor() ERC721("", "") {}

    function mint(address to, uint256 tokenId) public {
        _mint(to, tokenId);
    }

    function _baseURI() internal view virtual override returns (string memory) {
        return "testERC721_URI";
    }
    
}
