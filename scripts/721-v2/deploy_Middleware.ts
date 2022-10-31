import { ethers } from "hardhat";

async function main() {
  const MiddleWare = await ethers.getContractFactory("MiddleWareV2");
  const middleWare = await MiddleWare.deploy();
  await middleWare.deployed();
  console.log("MiddleWare deployed to:", middleWare.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
