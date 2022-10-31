import { ethers } from "hardhat";
import { ABI_DO_NFT_4907_MODEL, ABI_MARKET_V2 } from "../config/abi";
import { AddressConfig } from "../config/address";

async function main() {
  const DoNFTWrapModel = await ethers.getContractFactory('DoNFTWrapModel', {
    libraries: {
      "DoubleSVGV2": AddressConfig.DoubleSVGV2
    }
  });
  const logic = await DoNFTWrapModel.deploy();
  await logic.deployed();
  console.log("DoNFTWrapModel deployed to:", logic.address);

  const TransparentUpgradeableProxy = await ethers.getContractFactory("TransparentUpgradeableProxy");
  let iface = new ethers.utils.Interface(ABI_DO_NFT_4907_MODEL);
  let data = iface.encodeFunctionData("initialize", ["DoNFTWrap", "DoNFTWrap", AddressConfig.market_proxy_v2, AddressConfig.contract_owner, AddressConfig.contract_admin]);
  console.log(data);
  const proxy = await TransparentUpgradeableProxy.deploy(logic.address, AddressConfig.proxy_admin, data);
  await proxy.deployed();
  console.log("TransparentUpgradeableProxy deployed to:", proxy.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
