import { expect } from "chai";
import { ethers } from "hardhat";

describe("Test Market", function () {

    const ETH_Address = "0x0000000000000000000000000000000000000000";
    const address0 = '0x0000000000000000000000000000000000000000';
    let alice, bob;
    let market;
    let testERC4907;
    let doNFT4907;
    let doNFTWrap;
    let maxEndTime;
    let test4907Id = 1;
    //UINT96
    // let pricePerDay = BigNumber.from("79228162514264337593543950335");
    let pricePerDay = ethers.utils.parseEther("1");
    let erc20;


    beforeEach(async function () {

        [alice, bob] = await ethers.getSigners();

        const TestERC20 = await ethers.getContractFactory("TestERC20");
        erc20 = await TestERC20.deploy("T", "T", 18);

        const Market = await ethers.getContractFactory("MarketV2");
        market = await Market.deploy();
        market.initialize(alice.address, alice.address, alice.address);

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
        await doNFT4907.initialize("do4907", "do4907", market.address, alice.address, alice.address);

        const DoNFTWrapModel = await ethers.getContractFactory('DoNFTWrapModel', {
            libraries: {
                "DoubleSVGV2": double_svg_v2.address
            }
        });
        doNFTWrap = await DoNFTWrapModel.deploy();
        await doNFTWrap.deployed();
        await doNFTWrap.initialize("doWrap", "doWrap", market.address, alice.address, alice.address);

        await testERC4907.setApprovalForAll(doNFT4907.address, true);
        await testERC4907.mint(alice.address,1);
        maxEndTime = Math.floor(new Date().getTime() / 1000 + 86400 * 7);
        console.log("before each");


    });


    describe("Test Market2", function () {

        it("mint and create lend order with ETH", async function () {
            await market.mintAndCreateLendOrder(testERC4907.address, pricePerDay, doNFT4907.address, maxEndTime, test4907Id, ETH_Address, 86400, 0, address0);
            expect(await market.isLendOrderValid(doNFT4907.address, 1)).equal(true);
        });
        it("mint and create lend order with ETH fail", async function () {
            await expect(market.connect(bob).mintAndCreateLendOrder(testERC4907.address, pricePerDay, doNFT4907.address, maxEndTime, test4907Id, ETH_Address, 86400, 0, address0)).to.be.revertedWith("only owner");
        });

        it("create lend order with ETH", async function () {
            await market.mintAndCreateLendOrder(testERC4907.address, pricePerDay, doNFT4907.address, maxEndTime, test4907Id, ETH_Address, 86400, 0, address0);
            await market.createLendOrder(doNFT4907.address, maxEndTime, 0, 1, ETH_Address, pricePerDay, address0, 86400);
            expect(await market.isLendOrderValid(doNFT4907.address, 1)).to.equal(true);
        });
        it("create lend order with ETH fail", async function () {
            await market.mintAndCreateLendOrder(testERC4907.address, pricePerDay, doNFT4907.address, maxEndTime, test4907Id, ETH_Address, 86400, 0, address0);
            await expect(market.connect(bob).createLendOrder(doNFT4907.address, maxEndTime, 0, 1, ETH_Address, pricePerDay, address0, 86400)).to.be.revertedWith("only owner");
        });

        it("cancelLendOrder success", async function () {
            await market.mintAndCreateLendOrder(testERC4907.address, pricePerDay, doNFT4907.address, maxEndTime, test4907Id, ETH_Address, 86400, 0, address0);
            await market.cancelLendOrder(doNFT4907.address, 1);
            expect(await market.isLendOrderValid(doNFT4907.address, 1)).to.equal(false);
        });

        it("cancelLendOrder fail", async function () {
            await market.mintAndCreateLendOrder(testERC4907.address, pricePerDay, doNFT4907.address, maxEndTime, test4907Id, ETH_Address, 86400, 0, address0);
            await expect(market.connect(bob).cancelLendOrder(doNFT4907.address, 1)).to.be.revertedWith("only owner");
        });

        it("fulfillOrderNow with ETH success", async function () {
            await market.mintAndCreateLendOrder(testERC4907.address, pricePerDay, doNFT4907.address, maxEndTime, test4907Id, ETH_Address, 86400, 0, address0);
            await market.connect(bob).fulfillOrderNow(doNFT4907.address, 86400, 1, bob.address, ETH_Address, pricePerDay, { value: pricePerDay });
            expect(await doNFT4907.ownerOf(2)).equal(bob.address, "ownerOf 2");
            expect(await testERC4907.userOf(test4907Id)).equal(bob.address, "userOf");
        });
        it("fulfillOrderNow with ETH fail", async function () {
            await market.mintAndCreateLendOrder(testERC4907.address, pricePerDay, doNFT4907.address, maxEndTime, test4907Id, ETH_Address, 86400, 0, address0);
            await expect(market.connect(bob).fulfillOrderNow(doNFT4907.address, 86400, 1, bob.address, ETH_Address, pricePerDay, { value: ethers.utils.parseEther("0.9") })).to.be.revertedWith("payment is not enough");
        });

        it("fulfillOrderNow with erc20 success", async function () {
            await market.mintAndCreateLendOrder(testERC4907.address, pricePerDay, doNFT4907.address, maxEndTime, test4907Id, erc20.address, 86400, 0, address0);
            await erc20.connect(bob).approve(market.address, pricePerDay);
            erc20.mint(bob.address, pricePerDay);
            await market.connect(bob).fulfillOrderNow(doNFT4907.address, 86400, 1, bob.address, erc20.address, pricePerDay);
            expect(await erc20.balanceOf(bob.address)).equal(0);
            expect(await doNFT4907.ownerOf(2)).equal(bob.address, "ownerOf 2");
            expect(await testERC4907.userOf(test4907Id)).equal(bob.address, "userOf");
        });

        it("private fulfillOrderNow with ETH success", async function () {
            await market.setRoyaltyAdmin(testERC4907.address, bob.address);
            await market.connect(bob).setRoyaltyBeneficiary(testERC4907.address, bob.address)
            await market.connect(bob).setRoyaltyFee(testERC4907.address, 2500)

            await market.mintAndCreateLendOrder(testERC4907.address, pricePerDay, doNFT4907.address, maxEndTime, test4907Id, ETH_Address, 86400, 1, bob.address);
            await market.connect(bob).fulfillOrderNow(doNFT4907.address, 86400, 1, bob.address, ETH_Address, pricePerDay, { value: pricePerDay });
            expect(await doNFT4907.ownerOf(2)).equal(bob.address, "ownerOf 2");
            expect(await testERC4907.userOf(test4907Id)).equal(bob.address, "userOf");
            expect(await market.balanceOfRoyalty(testERC4907.address,ETH_Address)).above(0, "balanceOfRoyalty");
        });
        it("private fulfillOrderNow with ETH fail", async function () {
            await market.mintAndCreateLendOrder(testERC4907.address, pricePerDay, doNFT4907.address, maxEndTime, test4907Id, ETH_Address, 86400, 1, bob.address);
            await expect(market.fulfillOrderNow(doNFT4907.address, 86400, 1, bob.address, ETH_Address, pricePerDay, { value: pricePerDay })).to.be.revertedWith("invalid renter");
        });


    })


})