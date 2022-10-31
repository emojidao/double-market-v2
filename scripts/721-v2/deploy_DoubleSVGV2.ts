import { ethers } from "hardhat";

async function main() {
  const DoubleSVGV2 = await ethers.getContractFactory('DoubleSVGV2');
  const svg = await DoubleSVGV2.deploy();
  await svg.deployed();
  console.log("DoubleSVGV2 deployed to:", svg.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
