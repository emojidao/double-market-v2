// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/IERC721Metadata.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "./IMarketV2.sol";
import "./IDoNFTV2.sol";
import "../dualRoles/wrap/IWrapNFT.sol";

interface IDoNFT2 is IDoNFTV2, IERC721 {}

contract MiddleWareV2 {
    struct DoNftMarketInfo {
        uint256 originalNftId;
        address orderPaymentToken;
        uint96 orderPricePerDay;         
        address owner;
        uint40 endTime;
        uint32 orderFee; //   ratio = fee / 1e5 , orderFee = 1000 means 1%
        address user;
        uint32 orderCreateTime;
        uint32 orderMinDuration;
        uint32 orderMaxEndTime;
        address orderPrivateRenter;
        uint40 startTime;
        address originalNftAddress;
        uint8 orderType; // 0: Public, 1: Private, 2: Event_Private
        bool orderIsValid; 
        bool isVNft;
    }


    function getNftOwnerAndUser(
        address originalNftAddr,
        uint256 orginalNftId,
        address doNftAddr
    ) public view returns (address owner, address user) {
        IDoNFTV2 doNft = IDoNFTV2(doNftAddr);
        IERC721Metadata oNft = IERC721Metadata(originalNftAddr);

        try oNft.ownerOf(orginalNftId) returns (address ownerAddr) {
            owner = ownerAddr;
        } catch {}

        try doNft.getUser(originalNftAddr,orginalNftId) returns (address userAddr) {
            user = userAddr;
        } catch {}
    }

    function getDoNftMarketInfo(
        address doNftAddr,
        uint256 doNftId,
        address marketAddr
    ) public view returns (DoNftMarketInfo memory doNftInfo) {
        IDoNFT2 doNft = IDoNFT2(doNftAddr);
        IMarketV2 market = IMarketV2(marketAddr);

        doNftInfo.orderFee = uint32(market.getMarketFee()) ;

        if (doNft.exists(doNftId)) {
            (
            doNftInfo.originalNftId,
            doNftInfo.originalNftAddress,
            ,
            doNftInfo.startTime,
            doNftInfo.endTime

            ) = doNft.getDoNftInfo(doNftId);
            
            doNftInfo.orderFee += market.getRoyaltyFee(doNftInfo.originalNftAddress);
            doNftInfo.owner = doNft.ownerOf(doNftId);
          
            doNftInfo.user = doNft.getUser(doNftInfo.originalNftAddress, doNftInfo.originalNftId);
            doNftInfo.orderIsValid = market.isLendOrderValid(doNftAddr, doNftId);
            doNftInfo.isVNft = doNft.isVNft(doNftId);
            if (doNftInfo.orderIsValid) {
                IMarketV2.Lending memory order = market.getLendOrder(
                    doNftAddr,
                    doNftId
                );
                
                if (
                    order.orderType == IMarketV2.OrderType.Private 
                ) {
                    doNftInfo.orderPrivateRenter = order.privateOrderRenter;
                }
                doNftInfo.orderType = uint8(order.orderType);
                doNftInfo.orderMinDuration = uint32(order.minDuration);
                doNftInfo.orderMaxEndTime = uint32(order.maxEndTime);
                doNftInfo.orderPricePerDay = uint96(order.pricePerDay);
                doNftInfo.orderPaymentToken = order.paymentToken;                
            }

            if(doNft.getModelType() == IDoNFTV2.DoNFTModelType.WrapModel) {
                    address wrapNftAddress = doNftInfo.originalNftAddress;
                    doNftInfo.originalNftAddress =  IWrapNFT(wrapNftAddress).originalAddress();
            }
        }
    }
}
