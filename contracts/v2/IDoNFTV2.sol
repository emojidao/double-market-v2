// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/introspection/IERC165.sol";

interface IDoNFTV2 {
    enum DoNFTModelType {
        ERC4907Model, // 0
        WrapModel // 1
    }

    struct DoNftInfoV2 {
        uint256 originalNftId;
        address originalNftAddress;
        uint40 startTime; 
        uint40 endTime;  
        uint16 nonce;  
    }

    event MetadataUpdate(uint256 tokenId);


    function getModelType() external view returns (DoNFTModelType);

    function mintVNft(address oNftAddress,uint256 originalNftId) external returns (uint256);

    function mint(  
        uint256 tokenId,
        address to,
        address user,
        uint40 endTime
    ) external returns (uint256 tid);

    function setMaxDuration(uint40 v) external;

    function getMaxDuration() external view returns (uint40);

    function getDoNftInfo(uint256 tokenId)
        external
        view
        returns (
            uint256 originalNftId,
            address originalNftAddress,
            uint16 nonce,
            uint40 startTime,
            uint40 endTime
        );

    function getOriginalNftId(uint256 tokenId) external view returns (uint256);

    function getOriginalNftAddress(uint256 tokenId) external view returns (address);

    function getNonce(uint256 tokenId) external view returns (uint16);

    function getStartTime(uint256 tokenId) external view returns (uint40);

    function getEndTime(uint256 tokenId) external view returns (uint40);

    function getVNftId(address originalNftAddress, uint256 originalNftId) external view returns (uint256);

    function getUser(address originalNftAddress, uint256 originalNftId) external view returns (address);

    function isVNft(uint256 tokenId) external view returns (bool);

    function isValidNow(uint256 tokenId) external view returns (bool);

    function checkIn(address to, uint256 tokenId) external;

    function exists(uint256 tokenId) external view returns (bool);

    function couldRedeem(uint256 tokenId) external view returns (bool);

    function redeem(uint256 tokenId) external;
}
