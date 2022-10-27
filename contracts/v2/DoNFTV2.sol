// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts-upgradeable/security/ReentrancyGuardUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "../dualRoles/IERC4907.sol";
import "../dualRoles/wrap/IWrapNFT.sol";
import "./OwnableContract.sol";
import "./IDoNFTV2.sol";
import "./DoubleSVGV2.sol";
import "./ReverseRegistrarUtil.sol";

abstract contract DoNFTV2 is
    OwnableContract,
    ERC721Upgradeable,
    ReentrancyGuardUpgradeable,
    ReverseRegistrarUtil,
    IDoNFTV2
{
    using Strings for uint256;
    address public market;
    uint256 public curDoid;
    uint40 public maxDuration;
    mapping(uint256 => DoNftInfoV2) internal doNftMapping;
    //      oNftAddr          oNftId      vNftId
    mapping(address => mapping(uint256 => uint256)) internal oid2vid;

    function _initialize(
        string memory name_,
        string memory symbol_,
        address market_,
        address owner_,
        address admin_
    ) internal onlyInitializing {
        __ERC721_init(name_, symbol_);
        __ReentrancyGuard_init();
        initOwnableContract(owner_, admin_);
        market = market_;
        maxDuration = 365 days;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(_exists(tokenId), "URI query for nonexistent token");
        DoNftInfoV2 storage info = doNftMapping[tokenId];
        string memory name_;
        string memory type_value;
        string memory originalSymbol = "unknown";
        address oNFT = info.originalNftAddress;

        if (
            IDoNFTV2(this).getModelType() == IDoNFTV2.DoNFTModelType.WrapModel
        ) {
            oNFT = IWrapNFT(info.originalNftAddress).originalAddress();
        }

        try IERC721Metadata(oNFT).symbol() returns (string memory symbol_) {
            originalSymbol = symbol_;
        } catch {}

        if (isVNft(tokenId)) {
            name_ = string(abi.encodePacked("v-", originalSymbol));
            type_value = "vNFT";
        } else {
            name_ = string(abi.encodePacked("do-", originalSymbol));
            type_value = "doNFT";
        }

        return
            DoubleSVGV2.genTokenURI(
                tokenId,
                name_,
                type_value,
                info.startTime,
                info.endTime,
                oNFT
            );
    }

    function onlyApprovedOrOwner(
        address spender,
        address nftAddress,
        uint256 tokenId
    ) internal view returns (bool) {
        if (msg.sender == market) return true;
        address _owner = IERC721(nftAddress).ownerOf(tokenId);
        return (spender == _owner ||
            IERC721(nftAddress).getApproved(tokenId) == spender ||
            IERC721(nftAddress).isApprovedForAll(_owner, spender));
    }

    function isValidNow(uint256 tokenId) public view returns (bool isValid) {
        DoNftInfoV2 storage info = doNftMapping[tokenId];
        return
            info.startTime <= block.timestamp &&
            block.timestamp <= info.endTime;
    }

    function getDoNftInfo(uint256 tokenId)
        public
        view
        returns (
            uint256 originalNftId,
            address originalNftAddress,
            uint16 nonce,
            uint40 startTime,
            uint40 endTime
        )
    {
        DoNftInfoV2 storage info = doNftMapping[tokenId];
        originalNftId = info.originalNftId;
        originalNftAddress = info.originalNftAddress;
        nonce = info.nonce;
        startTime = info.startTime;
        endTime = info.endTime;
    }

    function getNonce(uint256 tokenId) external view returns (uint16) {
        return doNftMapping[tokenId].nonce;
    }

    function getStartTime(uint256 tokenId) public view returns (uint40) {
        return doNftMapping[tokenId].startTime;
    }

    function getEndTime(uint256 tokenId) public view returns (uint40) {
        return doNftMapping[tokenId].endTime;
    }

    function getUser(address originalNftAddress, uint256 originalNftId)
        external
        view
        returns (address)
    {
        return IERC4907(originalNftAddress).userOf(originalNftId);
    }

    function mint(
        uint256 tokenId,
        address to,
        address user,
        uint40 endTime
    ) public nonReentrant returns (uint256 tid) {
        uint40 startTime = uint40(block.timestamp);
        require(
            _isMarketOrOwner(_msgSender(), tokenId),
            "not owner nor market"
        );
        require(
            endTime > startTime && endTime <= block.timestamp + maxDuration,
            "invalid start or end"
        );
        DoNftInfoV2 storage info = doNftMapping[tokenId];
        require(
            startTime >= info.startTime && endTime <= info.endTime,
            "invalid duration"
        );

        if (startTime == info.startTime && endTime == info.endTime) {
            tid = mintDoNft(
                to,
                info.originalNftAddress,
                info.originalNftId,
                startTime,
                endTime
            );
            _burn(tokenId);
        } else {
            if (startTime == info.startTime && endTime != info.endTime) {
                info.startTime = endTime + 1;
            } else if (startTime != info.startTime && endTime == info.endTime) {
                info.endTime = startTime - 1;
            } else {
                info.startTime = endTime + 1;
            }

            tid = mintDoNft(
                to,
                info.originalNftAddress,
                info.originalNftId,
                startTime,
                endTime
            );
        }

        _checkIn(info.originalNftId, info.originalNftAddress, user, endTime);

        emit MetadataUpdate(tokenId);
    }

    function setMaxDuration(uint40 v) public onlyAdmin {
        maxDuration = v;
    }

    function getMaxDuration() public view returns (uint40) {
        return maxDuration;
    }

    function newDoNft(
        address oAddr,
        uint256 oId,
        uint40 start,
        uint40 end
    ) internal returns (uint256) {
        curDoid++;
        DoNftInfoV2 storage info = doNftMapping[curDoid];
        info.originalNftId = oId;
        info.originalNftAddress = oAddr;
        info.nonce = 0;
        info.startTime = start;
        info.endTime = end;
        return curDoid;
    }

    function mintDoNft(
        address to,
        address oAddr,
        uint256 oId,
        uint40 start,
        uint40 end
    ) internal returns (uint256) {
        newDoNft(oAddr, oId, start, end);
        _safeMint(to, curDoid);
        return curDoid;
    }

    function concat(uint256 tokenId, uint256 targetTokenId) public {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "ERC721: transfer caller is not owner nor approved"
        );
        require(
            _isApprovedOrOwner(_msgSender(), targetTokenId),
            "ERC721: transfer caller is not owner nor approved"
        );

        DoNftInfoV2 storage info = doNftMapping[tokenId];
        DoNftInfoV2 storage targetInfo = doNftMapping[targetTokenId];

        require(ownerOf(tokenId) == ownerOf(targetTokenId), "diff owner");
        require(
            info.originalNftId == targetInfo.originalNftId &&
                info.originalNftAddress == targetInfo.originalNftAddress,
            "diff oNFT "
        );

        if (info.endTime < targetInfo.startTime) {
            require(info.endTime + 1 == targetInfo.startTime);
            targetInfo.startTime = info.startTime;
        } else if (targetInfo.endTime < info.startTime) {
            require(targetInfo.endTime + 1 == info.startTime);
            targetInfo.endTime = info.endTime;
        }

        _burn(tokenId);
    }

    function _burnVNft(uint256 tokenId) internal {
        DoNftInfoV2 storage info = doNftMapping[tokenId];
        delete oid2vid[info.originalNftAddress][info.originalNftId];
        _burn(tokenId);
    }

    function _burn(uint256 tokenId) internal virtual override {
        super._burn(tokenId);
        delete doNftMapping[tokenId];
    }

    function _checkIn(
        uint256 originalNftId,
        address originalNftAddress,
        address user,
        uint40 expires
    ) internal virtual {
        IERC4907(originalNftAddress).setUser(
            originalNftId,
            user,
            uint64(expires)
        );
    }

    function checkIn(address to, uint256 tokenId) public virtual {
        require(
            _isApprovedOrOwner(_msgSender(), tokenId),
            "not owner nor approved"
        );
        DoNftInfoV2 storage info = doNftMapping[tokenId];
        require(
            info.startTime <= block.timestamp &&
                info.endTime >= block.timestamp,
            "invalid start or end time"
        );
        _checkIn(info.originalNftId, info.originalNftAddress, to, info.endTime);
    }

    function isVNft(uint256 tokenId) public view returns (bool) {
        if (tokenId == 0) return false;
        DoNftInfoV2 storage info = doNftMapping[tokenId];
        return oid2vid[info.originalNftAddress][info.originalNftId] == tokenId;
    }

    function getOriginalNftAddress(uint256 tokenId)
        public
        view
        returns (address)
    {
        return doNftMapping[tokenId].originalNftAddress;
    }

    function getOriginalNftId(uint256 tokenId) external view returns (uint256) {
        return doNftMapping[tokenId].originalNftId;
    }

    function getVNftId(address originalNftAddress, uint256 originalNftId)
        public
        view
        returns (uint256)
    {
        return oid2vid[originalNftAddress][originalNftId];
    }

    function _beforeTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        super._beforeTokenTransfer(from, to, tokenId);
        uint16 nonce = doNftMapping[tokenId].nonce;
        unchecked {
            nonce += 1;
        }
        doNftMapping[tokenId].nonce = nonce;
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override
        returns (bool)
    {
        return
            interfaceId == type(IDoNFTV2).interfaceId ||
            super.supportsInterface(interfaceId);
    }

    function exists(uint256 tokenId) public view virtual returns (bool) {
        return _exists(tokenId);
    }

    function _isMarketOrOwner(address spender, uint256 tokenId)
        internal
        view
        returns (bool)
    {
        return spender == market || ownerOf(tokenId) == spender;
    }

    function setMarket(address _market) public onlyOwner {
        uint256 id;
        assembly {
            id := chainid()
        }
        require(id == 4 || id == 97, "only for rinkeby or bsctest");
        market = _market;
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

    function couldRedeem(uint256 tokenId) public view virtual returns (bool) {
        require(isVNft(tokenId), "not vNFT");
        DoNftInfoV2 storage info = doNftMapping[tokenId];
        if (info.startTime > block.timestamp) {
            return false;
        }
        return info.endTime == type(uint40).max;
    }

    function redeem(uint256 tokenId) public virtual;

    function onERC721Received(
        address operator,
        address from,
        uint256 tokenId,
        bytes calldata data
    ) external pure virtual returns (bytes4) {
        bytes4 received = 0x150b7a02;
        return received;
    }
}
