import { ethers } from "hardhat";
import { ABI_MARKET_V2 } from "../config/abi";
import { AddressConfig } from "../config/address";

async function main() {
  const MarketV2 = await ethers.getContractFactory('MarketV2');
  const logic = await MarketV2.deploy();
  await logic.deployed();
  console.log("MarketV2 deployed to:", logic.address);

  const TransparentUpgradeableProxy = await ethers.getContractFactory("TransparentUpgradeableProxy");
  let iface = new ethers.utils.Interface(ABI_MARKET_V2);
  let data = iface.encodeFunctionData("initialize", [AddressConfig.contract_owner, AddressConfig.contract_admin,AddressConfig.market_beneficiary]);
  console.log(data);
  const proxy = await TransparentUpgradeableProxy.deploy(logic.address, AddressConfig.proxy_admin, data);
  await proxy.deployed();
  console.log("TransparentUpgradeableProxy deployed to:", proxy.address);
  let data_proxy = ethers.utils.defaultAbiCoder.encode(['address','address','bytes'],[logic.address, AddressConfig.proxy_admin, data]);
  console.log("data_proxy", data_proxy);
  
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
