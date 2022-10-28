import { expect } from "chai";
import { ethers } from "hardhat";

describe("Test Market", function () {

    const ETH_Address = "0x0000000000000000000000000000000000000000";
    const address0 = '0x0000000000000000000000000000000000000000';
    let owner, admin, beneficiary, pendingOwner, ownerOfNFT, beneficiaryOfNFT, lender, renter;
    let market;
    let testERC4907;
    let doNFT4907;
    let doNFTWrap;
    let maxEndTime;
    let test4907Id = 1;
    let pricePerDay = ethers.utils.parseEther("1");
    let erc20;


    beforeEach(async function () {

        [owner, admin, beneficiary, pendingOwner, ownerOfNFT, beneficiaryOfNFT, lender, renter] = await ethers.getSigners();

        const TestERC20 = await ethers.getContractFactory("TestERC20");
        erc20 = await TestERC20.deploy("T", "T", 18);

        const Market = await ethers.getContractFactory("MarketV2");
        market = await Market.deploy();
        market.initialize(owner.address, admin.address, beneficiary.address);

        const TestERC4907Upgradeable = await ethers.getContractFactory("TestERC4907Upgradeable");
        testERC4907 = await TestERC4907Upgradeable.deploy();

        const DoubleSVGV2 = await ethers.getContractFactory("DoubleSVGV2");
        const double_svg_v2 = await DoubleSVGV2.deploy();

        const DoNFT4907Model = await ethers.getContractFactory('DoNFT4907Model', {
            libraries: {
                "DoubleSVGV2": double_svg_v2.address
            }
        });
        doNFT4907 = await DoNFT4907Model.deploy();
        await doNFT4907.deployed();
        await doNFT4907.initialize("do4907", "do4907", market.address, owner.address, admin.address);

        const DoNFTWrapModel = await ethers.getContractFactory('DoNFTWrapModel', {
            libraries: {
                "DoubleSVGV2": double_svg_v2.address
            }
        });
        doNFTWrap = await DoNFTWrapModel.deploy();
        await doNFTWrap.deployed();
        await doNFTWrap.initialize("doWrap", "doWrap", market.address, owner.address, admin.address);

        await testERC4907.connect(lender).setApprovalForAll(doNFT4907.address, true);
        await testERC4907.connect(lender).mint(lender.address, 1);
        maxEndTime = Math.floor(new Date().getTime() / 1000 + 86400 * 7);

    });


    describe("when Market2 is not pause", function () {
        it("mint and create lend order with ETH", async function () {
            await market.connect(lender).mintAndCreateLendOrder(testERC4907.address, pricePerDay, doNFT4907.address, maxEndTime, test4907Id, ETH_Address, 86400, 0, address0);
            expect(await market.isLendOrderValid(doNFT4907.address, 1)).equal(true);
        });
        it("mint and create lend order with ETH fail", async function () {
            await expect(market.connect(renter).mintAndCreateLendOrder(testERC4907.address, pricePerDay, doNFT4907.address, maxEndTime, test4907Id, ETH_Address, 86400, 0, address0)).to.be.revertedWith("only owner");
        });

        it("create lend order with ETH", async function () {
            await market.connect(lender).mintAndCreateLendOrder(testERC4907.address, pricePerDay, doNFT4907.address, maxEndTime, test4907Id, ETH_Address, 86400, 0, address0);
            await market.connect(lender).createLendOrder(doNFT4907.address, maxEndTime, 0, 1, ETH_Address, pricePerDay, address0, 86400);
            expect(await market.isLendOrderValid(doNFT4907.address, 1)).to.equal(true);
        });
        it("create lend order with ETH fail", async function () {
            await market.connect(lender).mintAndCreateLendOrder(testERC4907.address, pricePerDay, doNFT4907.address, maxEndTime, test4907Id, ETH_Address, 86400, 0, address0);
            await expect(market.connect(renter).createLendOrder(doNFT4907.address, maxEndTime, 0, 1, ETH_Address, pricePerDay, address0, 86400)).to.be.revertedWith("only owner");
        });

        it("cancelLendOrder success", async function () {
            await market.connect(lender).mintAndCreateLendOrder(testERC4907.address, pricePerDay, doNFT4907.address, maxEndTime, test4907Id, ETH_Address, 86400, 0, address0);
            await market.connect(lender).cancelLendOrder(doNFT4907.address, 1);
            expect(await market.isLendOrderValid(doNFT4907.address, 1)).to.equal(false);
        });

        it("cancelLendOrder fail", async function () {
            await market.connect(lender).mintAndCreateLendOrder(testERC4907.address, pricePerDay, doNFT4907.address, maxEndTime, test4907Id, ETH_Address, 86400, 0, address0);
            await expect(market.connect(renter).cancelLendOrder(doNFT4907.address, 1)).to.be.revertedWith("only owner");
        });

        it("fulfillOrderNow with ETH success", async function () {
            await market.connect(lender).mintAndCreateLendOrder(testERC4907.address, pricePerDay, doNFT4907.address, maxEndTime, test4907Id, ETH_Address, 86400, 0, address0);
            await market.connect(renter).fulfillOrderNow(doNFT4907.address, 86400, 1, renter.address, ETH_Address, pricePerDay, { value: pricePerDay });
            expect(await doNFT4907.ownerOf(2)).equal(renter.address, "ownerOf 2");
            expect(await testERC4907.userOf(test4907Id)).equal(renter.address, "userOf");
        });
        it("fulfillOrderNow with ETH fail", async function () {
            await market.connect(lender).mintAndCreateLendOrder(testERC4907.address, pricePerDay, doNFT4907.address, maxEndTime, test4907Id, ETH_Address, 86400, 0, address0);
            await expect(market.connect(renter).fulfillOrderNow(doNFT4907.address, 86400, 1, renter.address, ETH_Address, pricePerDay, { value: ethers.utils.parseEther("0.9") })).to.be.revertedWith("payment is not enough");
        });

        it("fulfillOrderNow with erc20 success", async function () {
            await market.connect(lender).mintAndCreateLendOrder(testERC4907.address, pricePerDay, doNFT4907.address, maxEndTime, test4907Id, erc20.address, 86400, 0, address0);
            await erc20.connect(renter).approve(market.address, pricePerDay);
            erc20.mint(renter.address, pricePerDay);
            await market.connect(renter).fulfillOrderNow(doNFT4907.address, 86400, 1, renter.address, erc20.address, pricePerDay);
            expect(await erc20.balanceOf(renter.address)).equal(0);
            expect(await doNFT4907.ownerOf(2)).equal(renter.address, "ownerOf 2");
            expect(await testERC4907.userOf(test4907Id)).equal(renter.address, "userOf");
        });

        it("private fulfillOrderNow with ETH success", async function () {
            await market.connect(owner).setRoyaltyAdmin(testERC4907.address, renter.address);
            await market.connect(renter).setRoyaltyBeneficiary(testERC4907.address, renter.address)
            await market.connect(renter).setRoyaltyFee(testERC4907.address, 2500)

            await market.connect(lender).mintAndCreateLendOrder(testERC4907.address, pricePerDay, doNFT4907.address, maxEndTime, test4907Id, ETH_Address, 86400, 1, renter.address);
            await market.connect(renter).fulfillOrderNow(doNFT4907.address, 86400, 1, renter.address, ETH_Address, pricePerDay, { value: pricePerDay });
            expect(await doNFT4907.ownerOf(2)).equal(renter.address, "ownerOf 2");
            expect(await testERC4907.userOf(test4907Id)).equal(renter.address, "userOf");
            expect(await market.balanceOfRoyalty(testERC4907.address, ETH_Address)).above(0, "balanceOfRoyalty");
        });
        it("private fulfillOrderNow with ETH fail", async function () {
            await market.connect(lender).mintAndCreateLendOrder(testERC4907.address, pricePerDay, doNFT4907.address, maxEndTime, test4907Id, ETH_Address, 86400, 1, renter.address);
            await expect(market.fulfillOrderNow(doNFT4907.address, 86400, 1, renter.address, ETH_Address, pricePerDay, { value: pricePerDay })).to.be.revertedWith("invalid renter");
        });

    })

    describe("when Market2 is pause", function () {
        beforeEach(async function () {
            await market.setPause(true)
        });
        it("should fail", async function () {
            await expect(market.connect(lender).mintAndCreateLendOrder(testERC4907.address, pricePerDay, doNFT4907.address, maxEndTime, test4907Id, ETH_Address, 86400, 0, address0)).to.be.revertedWith("is pausing");
            await expect(market.connect(lender).createLendOrder(doNFT4907.address, maxEndTime, 0, 1, ETH_Address, pricePerDay, address0, 86400)).to.be.revertedWith("is pausing");
            await expect(market.connect(lender).cancelLendOrder(doNFT4907.address, 1)).to.be.revertedWith("is pausing");
            await expect(market.connect(renter).fulfillOrderNow(doNFT4907.address, 86400, 1, renter.address, ETH_Address, pricePerDay, { value: pricePerDay })).to.be.revertedWith("is pausing");
            await expect(market.connect(lender).claimMarketFee([testERC4907.address])).to.be.revertedWith("is pausing");
            await expect(market.connect(lender).claimRoyalty(testERC4907.address, [ETH_Address])).to.be.revertedWith("is pausing");
        });

    })

    describe("ownable", function () {
        let receipt = null;
        context('transfer ownership', function () {
            it("should success if caller is owner", async function () {
                receipt = await market.connect(owner).transferOwnership(pendingOwner.address);
                await expect(receipt).to.emit(market, "NewPendingOwner").withArgs(ethers.constants.AddressZero, pendingOwner.address);
                expect(await market.pendingOwner()).equal(pendingOwner.address);

                await expect(market.connect(admin).acceptOwner()).to.be.revertedWith("onlyPendingOwner");
                receipt = await market.connect(pendingOwner).acceptOwner();
                await expect(receipt).to.emit(market, "NewOwner").withArgs(owner.address, pendingOwner.address);
            });
            it("should fail if caller is not owner ", async function () {
                await expect(market.connect(admin).transferOwnership(pendingOwner.address)).to.be.revertedWith("onlyOwner");
            });
        })

        context('set admin', function () {
            it("should success if caller is owner", async function () {
                receipt = await market.connect(owner).setAdmin(pendingOwner.address);
                await expect(receipt).to.emit(market, "NewAdmin").withArgs(admin.address, pendingOwner.address);
                expect(await market.admin()).equal(pendingOwner.address);
            });
            it("should fail if caller is not owner ", async function () {
                await expect(market.connect(admin).setAdmin(pendingOwner.address)).to.be.revertedWith("onlyOwner");
            });
        })
        context('renounce ownership', function () {
            it("should success if caller is owner", async function () {
                receipt = await market.connect(owner).renounceOwnership();
                await expect(receipt).to.emit(market, "NewOwner").withArgs(owner.address, ethers.constants.AddressZero);
                await expect(receipt).to.emit(market, "NewAdmin").withArgs(admin.address, ethers.constants.AddressZero);
                await expect(receipt).to.emit(market, "NewPendingOwner").withArgs(ethers.constants.AddressZero,ethers.constants.AddressZero);
                expect(await market.owner()).equal(ethers.constants.AddressZero);
                expect(await market.admin()).equal(ethers.constants.AddressZero);
                expect(await market.pendingOwner()).equal(ethers.constants.AddressZero);
            });
            it("should fail if caller is not owner ", async function () {
                await expect(market.connect(admin).renounceOwnership()).to.be.revertedWith("onlyOwner");
            });
        })
    })


})