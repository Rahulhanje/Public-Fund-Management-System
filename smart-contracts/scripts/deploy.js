const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);

  // Deploy SBT
  console.log("Deploying SBT...");
  const SBT = await ethers.getContractFactory("SBT");
  const sbt = await SBT.deploy();
  await sbt.waitForDeployment();
  const sbtAddress = await sbt.getAddress();
  console.log("SBT deployed to:", sbtAddress);

  // Deploy PublicFundManagement with SBT address
  console.log("Deploying PublicFundManagement...");
  const PublicFundManagement = await ethers.getContractFactory("PublicFundManagement");
  const pfm = await PublicFundManagement.deploy(sbtAddress);
  await pfm.waitForDeployment();
  const pfmAddress = await pfm.getAddress();
  console.log("PublicFundManagement deployed to:", pfmAddress);

  // Deploy PublicFundTreasury
  console.log("Deploying PublicFundTreasury...");
  const Treasury = await ethers.getContractFactory("PublicFundTreasury");
  const treasury = await Treasury.deploy();
  await treasury.waitForDeployment();
  const treasuryAddress = await treasury.getAddress();
  console.log("PublicFundTreasury deployed to:", treasuryAddress);

  // Update frontend .env file with new contract addresses
  const frontendEnvPath = path.resolve(__dirname, "../../frontend/.env");
  
  try {
    if (fs.existsSync(frontendEnvPath)) {
      // Read existing .env file
      let envContent = fs.readFileSync(frontendEnvPath, 'utf8');
      
      // Update contract addresses with regex replacement
      envContent = envContent.replace(
        /NEXT_PUBLIC_SBT_TOKEN_ADDRESS=.*/,
        `NEXT_PUBLIC_SBT_TOKEN_ADDRESS=${sbtAddress}`
      );
      envContent = envContent.replace(
        /NEXT_PUBLIC_PUBLIC_FUND_TREASURY_ADDRESS=.*/,
        `NEXT_PUBLIC_PUBLIC_FUND_TREASURY_ADDRESS=${treasuryAddress}`
      );
      envContent = envContent.replace(
        /NEXT_PUBLIC_PUBLIC_FUND_MANAGEMENT_ADDRESS=.*/,
        `NEXT_PUBLIC_PUBLIC_FUND_MANAGEMENT_ADDRESS=${pfmAddress}`
      );
      
      // Update deployment information section
      const currentDate = new Date().toLocaleDateString();
      const deploymentInfo = `# Contract Addresses:
# - SBT Token: ${sbtAddress}
# - PublicFundManagement: ${pfmAddress}  
# - PublicFundTreasury: ${treasuryAddress}`;
      
      envContent = envContent.replace(
        /# Contract Addresses:[\s\S]*?# - PublicFundTreasury: .*/,
        deploymentInfo
      );
      
      // Update deployment date
      envContent = envContent.replace(
        /# Deployment Date: .*/,
        `# Deployment Date: ${currentDate}`
      );
      
      // Write updated content back to file
      fs.writeFileSync(frontendEnvPath, envContent);
      console.log(`✅ Frontend .env file updated: ${frontendEnvPath}`);
      console.log(`🔄 Contract addresses have been updated while preserving other settings`);
    } else {
      console.log("❌ Frontend .env file not found; skipping update.");
    }
  } catch (e) {
    console.log("⚠️  Error updating .env file:", e.message);
  }

  console.log("\nDeployment Summary:");
  console.log("-------------------");
  console.log("SBT:", sbtAddress);
  console.log("PublicFundManagement:", pfmAddress);
  console.log("PublicFundTreasury:", treasuryAddress);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});