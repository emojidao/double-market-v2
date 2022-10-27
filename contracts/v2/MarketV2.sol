// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/utils/Address.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "./IMarketV2.sol";
import "./OwnableContract.sol";
import "./IDoNFTV2.sol";
import "./ReverseRegistrarUtil.sol";
import "../dualRoles/wrap/IWrapNFT.sol";

contract MarketV2 is
    OwnableContract,
    ReentrancyGuardUpgradeable,
    ReverseRegistrarUtil,
    IMarketV2
{
    uint64 private constant E5 = 1e5;
    mapping(address => mapping(uint256 => Lending)) internal lendingMap;

    // erc4907NftAddress  => mapping(paymentToken => balance)
    mapping(address => mapping(address => uint256)) internal royaltyIncomeMap;

    // erc4907NftAddress => RoyaltyInfo
    mapping(address => RoyaltyInfo) internal royaltyInfoMap;

    //      paymentToken  balance
    mapping(address => uint256) public marketBalanceOfFee;
    uint256 private marketFee;
    address payable public marketBeneficiary;
    uint40 public maxIndate;
    bool public isPausing;

    function initialize(
        address owner_,
        address admin_,
        address payable marketBeneficiary_
    ) public initializer {
        __ReentrancyGuard_init();
        initOwnableContract(owner_, admin_);
        marketBeneficiary = marketBeneficiary_;
        maxIndate = 365 days;
        marketFee = 2500;
    }

    function onlyNftOwner(address nftAddress, uint256 nftId) internal view {
        require(msg.sender == IERC721(nftAddress).ownerOf(nftId), "only owner");
    }

    modifier whenNotPaused() {
        require(!isPausing, "is pausing");
        _;
    }

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
    ) public nonReentrant {
        uint256 doNftId;
        if (
            IDoNFTV2(doNftAddress).getModelType() ==
            IDoNFTV2.DoNFTModelType.WrapModel
        ) {
            doNftId = _mintVForWrap(
                erc4907NftAddress,
                doNftAddress,
                erc4907NftId
            );
        } else {
            doNftId = _mintVFor4907(
                erc4907NftAddress,
                doNftAddress,
                erc4907NftId
            );
        }
        createLendOrder(
            doNftAddress,
            maxEndTime,
            orderType,
            doNftId,
            paymentToken,
            pricePerDay,
            privateOrderRenter,
            minDuration
        );
    }

    function _mintVForWrap(
        address wNftAddress,
        address doNftAddress,
        uint256 oNftId
    ) internal returns (uint256 nftId) {
        address oNftAddress = IWrapNFT(wNftAddress).originalAddress();
        onlyNftOwner(oNftAddress, oNftId);
        nftId = IDoNFTV2(doNftAddress).mintVNft(wNftAddress, oNftId);
    }

    function _mintVFor4907(
        address oNftAddress,
        address doNftAddress,
        uint256 oNftId
    ) internal returns (uint256 nftId) {
        onlyNftOwner(oNftAddress, oNftId);
        nftId = IDoNFTV2(doNftAddress).mintVNft(oNftAddress, oNftId);
    }

    function createLendOrder(
        address doNftAddress,
        uint40 maxEndTime,
        OrderType orderType,
        uint256 doNftId,
        address paymentToken,
        uint96 pricePerDay,
        address privateOrderRenter,
        uint40 minDuration
    ) public whenNotPaused {
        onlyNftOwner(doNftAddress, doNftId);
        require(maxEndTime > block.timestamp, "invalid maxEndTime");
        require(
            minDuration <= IDoNFTV2(doNftAddress).getMaxDuration(),
            "Error: invalid minDuration"
        );

        (
            uint256 originalNftId,
            address originalNftAddress,
            uint16 nonce,
            ,
            uint40 dEnd
        ) = IDoNFTV2(doNftAddress).getDoNftInfo(doNftId);

        if (maxEndTime > dEnd) {
            maxEndTime = dEnd;
        }
        if (maxEndTime > block.timestamp + maxIndate) {
            maxEndTime = uint40(block.timestamp) + maxIndate;
        }

        address _owner = IERC721(doNftAddress).ownerOf(doNftId);

        lendingMap[doNftAddress][doNftId] = Lending(
            _owner,
            maxEndTime,
            nonce,
            minDuration,
            orderType,
            paymentToken,
            privateOrderRenter,
            pricePerDay
        );

        _emitCreateLendOrder(
            doNftAddress,
            doNftId,
            originalNftAddress,
            originalNftId
        );
    }

    function _emitCreateLendOrder(
        address doNftAddress,
        uint256 doNftId,
        address originalNftAddress,
        uint256 originalNftId
    ) internal {
        Lending storage lending = lendingMap[doNftAddress][doNftId];
        emit CreateLendOrderV2(
            lending.lender,
            lending.maxEndTime,
            lending.orderType,
            originalNftAddress,
            lending.pricePerDay,
            originalNftId,
            doNftAddress,
            lending.minDuration,
            doNftId,
            lending.paymentToken,
            lending.privateOrderRenter
        );
    }

    function cancelLendOrder(address nftAddress, uint256 nftId)
        public
        whenNotPaused
    {
        onlyNftOwner(nftAddress, nftId);
        delete lendingMap[nftAddress][nftId];
        emit CancelLendOrder(msg.sender, nftAddress, nftId);
    }

    function getLendOrder(address nftAddress, uint256 nftId)
        public
        view
        returns (Lending memory)
    {
        return lendingMap[nftAddress][nftId];
    }

    function fulfillOrderNow(
        address doNftAddress,
        uint40 duration,
        uint256 doNftId,
        address user,
        address paymentToken,
        uint96 pricePerDay
    ) public payable whenNotPaused nonReentrant {
        require(isLendOrderValid(doNftAddress, doNftId), "invalid order");
        Lending storage lending = lendingMap[doNftAddress][doNftId];
        require(
            paymentToken == lending.paymentToken &&
                pricePerDay == lending.pricePerDay,
            "invalid lending"
        );

        if (lending.orderType == OrderType.Private) {
            require(msg.sender == lending.privateOrderRenter, "invalid renter");
        }
        uint40 endTime = uint40(block.timestamp + duration - 1);
        if (endTime > lending.maxEndTime) {
            endTime = lending.maxEndTime;
        }
        (
            uint256 originalNftId,
            address originalNftAddress,
            ,
            ,
            uint40 dEnd
        ) = IDoNFTV2(doNftAddress).getDoNftInfo(doNftId);

        if (endTime > dEnd) {
            endTime = dEnd;
        }
        if (!(endTime == dEnd || endTime == lending.maxEndTime)) {
            require(duration >= lending.minDuration, "duration < minDuration");
        }

        _fulfillOrderNow(
            originalNftAddress,
            originalNftId,
            doNftAddress,
            endTime,
            doNftId,
            lending.lender,
            user,
            lending.paymentToken,
            lending.pricePerDay
        );
    }

    function _fulfillOrderNow(
        address originalNftAddress,
        uint256 originalNftId,
        address doNftAddress,
        uint40 endTime,
        uint256 doNftId,
        address lender,
        address user,
        address paymentToken,
        uint96 pricePerDay
    ) internal {
        distributePayment(
            doNftAddress,
            doNftId,
            originalNftAddress,
            endTime,
            paymentToken,
            pricePerDay
        );

        uint256 tid = IDoNFTV2(doNftAddress).mint(
            doNftId,
            msg.sender,
            user,
            endTime
        );

        emit FulfillOrderV2(
            msg.sender,
            uint40(block.timestamp),
            lender,
            endTime,
            originalNftAddress,
            originalNftId,
            doNftAddress,
            doNftId,
            tid,
            paymentToken,
            pricePerDay
        );
    }

    function distributePayment(
        address nftAddress,
        uint256 nftId,
        address oNFT,
        uint40 endTime,
        address paymentToken,
        uint96 pricePerDay
    )
        internal
        returns (
            uint256 totalPrice,
            uint256 leftTotalPrice,
            uint256 curFee,
            uint256 curRoyalty
        )
    {
        if (pricePerDay == 0) return (0, 0, 0, 0);
        totalPrice =
            (uint256(pricePerDay) * (endTime - block.timestamp + 1)) /
            86400;
        curFee = (totalPrice * marketFee) / E5;
        marketBalanceOfFee[paymentToken] += curFee;
        RoyaltyInfo storage royaltyInfo = royaltyInfoMap[oNFT];
        if (royaltyInfo.royaltyFee > 0) {
            curRoyalty = (totalPrice * royaltyInfo.royaltyFee) / E5;
            royaltyIncomeMap[oNFT][paymentToken] += curRoyalty;
        }
        leftTotalPrice = totalPrice - curFee - curRoyalty;

        if (paymentToken == address(0)) {
            require(msg.value >= totalPrice, "payment is not enough");
            Address.sendValue(
                payable(IERC721(nftAddress).ownerOf(nftId)),
                leftTotalPrice
            );
            if (msg.value > totalPrice) {
                Address.sendValue(payable(msg.sender), msg.value - totalPrice);
            }
        } else {
            SafeERC20.safeTransferFrom(
                IERC20(paymentToken),
                msg.sender,
                address(this),
                totalPrice
            );

            SafeERC20.safeTransfer(
                IERC20(paymentToken),
                IERC721(nftAddress).ownerOf(nftId),
                leftTotalPrice
            );
        }
    }

    function setMarketFee(uint256 fee_) public onlyAdmin {
        require(fee_ <= 1e4, "invalid fee");
        marketFee = fee_;
    }

    function getMarketFee() public view returns (uint256) {
        return marketFee;
    }

    function setMarketBeneficiary(address payable beneficiary_)
        public
        onlyOwner
    {
        marketBeneficiary = beneficiary_;
    }

    function claimMarketFee(address[] calldata paymentTokens)
        public
        whenNotPaused
        nonReentrant
    {
        require(msg.sender == marketBeneficiary, "not beneficiary");
        for (uint256 index = 0; index < paymentTokens.length; index++) {
            uint256 balance = marketBalanceOfFee[paymentTokens[index]];
            if (balance > 0) {
                if (paymentTokens[index] == address(0)) {
                    Address.sendValue(marketBeneficiary, balance);
                } else {
                    SafeERC20.safeTransfer(
                        IERC20(paymentTokens[index]),
                        marketBeneficiary,
                        balance
                    );
                }
                marketBalanceOfFee[paymentTokens[index]] = 0;
            }
        }
    }

    function setRoyaltyAdmin(address erc4907NftAddress, address royaltyAdmin)
        public
        onlyAdmin
    {
        RoyaltyInfo storage royaltyInfo = royaltyInfoMap[erc4907NftAddress];
        royaltyInfo.royaltyAdmin = royaltyAdmin;
        emit RoyaltyAdminChanged(msg.sender, erc4907NftAddress, royaltyAdmin);
    }

    function getRoyaltyAdmin(address erc4907NftAddress)
        public
        view
        returns (address)
    {
        return royaltyInfoMap[erc4907NftAddress].royaltyAdmin;
    }

    function setRoyaltyBeneficiary(
        address erc4907NftAddress,
        address beneficiary
    ) public {
        require(beneficiary != address(0), "invalid beneficiary");
        RoyaltyInfo storage royaltyInfo = royaltyInfoMap[erc4907NftAddress];
        require(
            msg.sender == royaltyInfo.royaltyAdmin,
            "msg.sender is not royaltyAdmin"
        );
        royaltyInfo.beneficiary = beneficiary;
        emit RoyaltyBeneficiaryChanged(
            msg.sender,
            erc4907NftAddress,
            beneficiary
        );
    }

    function getRoyaltyBeneficiary(address erc4907NftAddress)
        public
        view
        returns (address)
    {
        return royaltyInfoMap[erc4907NftAddress].beneficiary;
    }

    function setRoyaltyFee(address erc4907NftAddress, uint32 royaltyFee)
        public
    {
        require(royaltyFee <= 10000, "fee exceeds 10pct");

        RoyaltyInfo storage royaltyInfo = royaltyInfoMap[erc4907NftAddress];
        require(
            msg.sender == royaltyInfo.royaltyAdmin,
            "msg.sender is not royaltyAdmin"
        );
        royaltyInfo.royaltyFee = royaltyFee;

        emit RoyaltyFeeChanged(msg.sender, erc4907NftAddress, royaltyFee);
    }

    function getRoyaltyFee(address erc4907NftAddress)
        public
        view
        returns (uint32)
    {
        return royaltyInfoMap[erc4907NftAddress].royaltyFee;
    }

    function claimRoyalty(
        address erc4907NftAddress,
        address[] calldata paymentTokens
    ) public whenNotPaused nonReentrant {
        RoyaltyInfo storage royaltyInfo = royaltyInfoMap[erc4907NftAddress];
        address _beneficiary = royaltyInfo.beneficiary;
        require(msg.sender == _beneficiary, "not beneficiary");
        for (uint256 index = 0; index < paymentTokens.length; index++) {
            address paymentToken = paymentTokens[index];

            uint256 balance = royaltyIncomeMap[erc4907NftAddress][paymentToken];
            if (balance > 0) {
                if (paymentTokens[index] == address(0)) {
                    Address.sendValue(payable(_beneficiary), balance);
                } else {
                    SafeERC20.safeTransfer(
                        IERC20(paymentTokens[index]),
                        _beneficiary,
                        balance
                    );
                }
                royaltyIncomeMap[erc4907NftAddress][paymentToken] = 0;
            }
        }
    }

    function balanceOfRoyalty(address erc4907NftAddress, address paymentToken)
        public
        view
        returns (uint256)
    {
        return royaltyIncomeMap[erc4907NftAddress][paymentToken];
    }

    function isLendOrderValid(address doNftAddress, uint256 doNftId)
        public
        view
        returns (bool)
    {
        Lending storage lending = lendingMap[doNftAddress][doNftId];
        if (isPausing) {
            return false;
        }
        return
            lending.maxEndTime > block.timestamp &&
            lending.nonce == IDoNFTV2(doNftAddress).getNonce(doNftId);
    }

    function setPause(bool pause_) public onlyAdmin {
        isPausing = pause_;
        if (isPausing) {
            emit Paused(address(this));
        } else {
            emit Unpaused(address(this));
        }
    }

    function setMaxIndate(uint40 max_) public onlyAdmin {
        maxIndate = max_;
    }

    function multicall(bytes[] calldata data)
        external
        returns (bytes[] memory results)
    {
        results = new bytes[](data.length);
        for (uint256 i = 0; i < data.length; i++) {
            (bool success, bytes memory result) = address(this).delegatecall(
                data[i]
            );
            if (success) {
                results[i] = result;
            }
        }
        return results;
    }
}
