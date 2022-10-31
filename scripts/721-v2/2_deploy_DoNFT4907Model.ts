import { ethers } from "hardhat";
import { ABI_DO_NFT_4907_MODEL, ABI_MARKET_V2 } from "../config/abi";
import { AddressConfig } from "../config/address";

async function main() {
  const DoNFT4907Model = await ethers.getContractFactory('DoNFT4907Model', {
    libraries: {
      "DoubleSVGV2": AddressConfig.DoubleSVGV2
    }
  });
  const logic = await DoNFT4907Model.deploy();
  await logic.deployed();
  console.log("DoNFT4907Model deployed to:", logic.address);

  const TransparentUpgradeableProxy = await ethers.getContractFactory("TransparentUpgradeableProxy");
  let iface = new ethers.utils.Interface(ABI_DO_NFT_4907_MODEL);
  let data = iface.encodeFunctionData("initialize", ["DoNFT4907", "DoNFT4907", AddressConfig.market_proxy_v2, AddressConfig.contract_owner, AddressConfig.contract_admin]);
  console.log(data);
  const proxy = await TransparentUpgradeableProxy.deploy(logic.address, AddressConfig.proxy_admin, data);
  await proxy.deployed();
  console.log("TransparentUpgradeableProxy deployed to:", proxy.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
