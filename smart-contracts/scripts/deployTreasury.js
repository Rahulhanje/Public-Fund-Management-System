const { ethers } = require("hardhat");

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deployer:", deployer.address);

  const Treasury = await ethers.getContractFactory("PublicFundTreasury");
  const treasury = await Treasury.deploy();
  await treasury.waitForDeployment();

  console.log("PublicFundTreasury:", await treasury.getAddress());
}

main().catch((e) => { console.error(e); process.exitCode = 1; });