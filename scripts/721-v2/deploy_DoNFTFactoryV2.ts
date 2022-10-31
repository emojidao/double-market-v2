import { ethers } from "hardhat";
import { AddressConfig } from "../config/address";

async function main() {
  const WrappedInERC4907Upgradeable = await ethers.getContractFactory("WrappedInERC4907Upgradeable");
  const wNFTImpl = await WrappedInERC4907Upgradeable.deploy();
  await wNFTImpl.deployed();
  console.log("wNFTImpl deployed to:", wNFTImpl.address);

  const DoNFTFactoryV2 = await ethers.getContractFactory('DoNFTFactoryV2');
  const contract = await DoNFTFactoryV2.deploy(AddressConfig.contract_owner, AddressConfig.contract_admin, wNFTImpl.address);
  await contract.deployed();
  console.log("DoNFTFactoryV2 deployed to:", contract.address);

  let data = ethers.utils.defaultAbiCoder.encode(["address", "address", "address"], [AddressConfig.contract_owner, AddressConfig.contract_admin, wNFTImpl.address])
  console.log("Constructor Arguments :", data);

}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
