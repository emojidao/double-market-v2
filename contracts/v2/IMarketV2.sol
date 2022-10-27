// SPDX-License-Identifier: MIT
pragma solidity >=0.6.6 <0.9.0;

interface IMarketV2 {
    enum OrderType {
        Public, // 0
        Private // 1
    }

    struct Lending {  
        address lender; 
        uint40 maxEndTime; 
        uint16 nonce; 
        uint40 minDuration; 
        OrderType orderType; 
        address paymentToken; 
        address privateOrderRenter; 
        uint96 pricePerDay;
    }

    struct RoyaltyInfo {
        address royaltyAdmin;
        address beneficiary;
        uint32 royaltyFee;
    }

    event CreateLendOrderV2(   
        address lender, 
        uint40 maxEndTime, 
        OrderType orderType, 
        address erc4907NftAddress,
        uint96 pricePerDay, 
        uint256 erc4907NftId, 
        address doNftAddress,
        uint40 minDuration, 
        uint256 doNftId, 
        address paymentToken, 
        address privateOrderRenter
    );

    event CancelLendOrder(address lender, address nftAddress, uint256 nftId);
   
    event FulfillOrderV2(  
        address renter,  
        uint40 startTime, 
        address lender, 
        uint40 endTime,  
        address erc4907NftAddress,  
        uint256 erc4907NftId, 
        address doNftAddress, 
        uint256 doNftId,
        uint256 newId,
        address paymentToken,
        uint96 pricePerDay
    );

    event Paused(address account);
    event Unpaused(address account);

    event RoyaltyAdminChanged(address operator, address erc4907NftAddress, address royaltyAdmin);
    event RoyaltyBeneficiaryChanged(address operator, address erc4907NftAddress, address beneficiary);
    event RoyaltyFeeChanged(address operator, address erc4907NftAddress, uint32 royaltyFee);

    function createLendOrder( 
        address doNftAddress,
        uint40 maxEndTime, 
        OrderType orderType, 
        uint256 doNftId, 
        address paymentToken, 
        uint96 pricePerDay,  
        address privateOrderRenter, 
        uint40 minDuration 
    ) external;




    function mintAndCreateLendOrder(
        address erc4907NftAddress, 
        uint96 pricePerDay, 
        address doNftAddress, 
        uint40 maxEndTime, 
        uint256 erc4907NftId, 
        address paymentToken,
        uint40 minDuration,
        OrderType orderType,  
        address privateOrderRenter
    ) external;

    function cancelLendOrder(address nftAddress, uint256 nftId) external;

    function getLendOrder(address nftAddress, uint256 nftId)
        external
        view
        returns (Lending memory);

    function fulfillOrderNow(
        address doNftAddress, 
        uint40 duration, 
        uint256 doNftId,  
        address user,  
        address paymentToken, 
        uint96 pricePerDay 
    ) external payable;

    function setMarketFee(uint256 fee) external;

    function getMarketFee() external view returns (uint256);

    function setMarketBeneficiary(address payable beneficiary) external;

    function claimMarketFee(address[] calldata paymentTokens) external;

    function setRoyaltyAdmin(address erc4907NftAddress, address royaltyAdmin) external;
      
    function getRoyaltyAdmin(address erc4907NftAddress) external view returns(address);

    function setRoyaltyBeneficiary(address erc4907NftAddress, address  beneficiary) external; 

    function getRoyaltyBeneficiary(address erc4907NftAddress) external view returns (address);

    function balanceOfRoyalty(address erc4907NftAddress, address paymentToken) external view returns (uint256);

    function setRoyaltyFee(address erc4907NftAddress, uint32 royaltyFee) external;

    function getRoyaltyFee(address erc4907NftAddress) external view returns (uint32);

    function claimRoyalty(address erc4907NftAddress, address[] calldata paymentTokens) external;

    function isLendOrderValid(address nftAddress, uint256 nftId) external view returns (bool);

    function setPause(bool v) external;
}
