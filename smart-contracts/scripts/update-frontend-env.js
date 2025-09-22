const fs = require("fs");
const path = require("path");

/**
 * Helper script to update frontend .env file with new contract addresses
 * Usage: node scripts/update-frontend-env.js [SBT_ADDRESS] [MANAGEMENT_ADDRESS] [TREASURY_ADDRESS]
 */

function updateFrontendEnv(sbtAddress, managementAddress, treasuryAddress) {
  const frontendEnvPath = path.resolve(__dirname, "../../frontend/.env");
  
  try {
    if (!fs.existsSync(frontendEnvPath)) {
      console.log("❌ Frontend .env file not found at:", frontendEnvPath);
      return false;
    }

    // Read existing .env file
    let envContent = fs.readFileSync(frontendEnvPath, 'utf8');
    
    // Update contract addresses
    if (sbtAddress) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_SBT_TOKEN_ADDRESS=.*/,
        `NEXT_PUBLIC_SBT_TOKEN_ADDRESS=${sbtAddress}`
      );
    }
    
    if (treasuryAddress) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_PUBLIC_FUND_TREASURY_ADDRESS=.*/,
        `NEXT_PUBLIC_PUBLIC_FUND_TREASURY_ADDRESS=${treasuryAddress}`
      );
    }
    
    if (managementAddress) {
      envContent = envContent.replace(
        /NEXT_PUBLIC_PUBLIC_FUND_MANAGEMENT_ADDRESS=.*/,
        `NEXT_PUBLIC_PUBLIC_FUND_MANAGEMENT_ADDRESS=${managementAddress}`
      );
    }
    
    // Update deployment information
    const currentDate = new Date().toLocaleDateString();
    if (sbtAddress && managementAddress && treasuryAddress) {
      const deploymentInfo = `# Contract Addresses:
# - SBT Token: ${sbtAddress}
# - PublicFundManagement: ${managementAddress}  
# - PublicFundTreasury: ${treasuryAddress}`;
      
      envContent = envContent.replace(
        /# Contract Addresses:[\s\S]*?# - PublicFundTreasury: .*/,
        deploymentInfo
      );
      
      envContent = envContent.replace(
        /# Deployment Date: .*/,
        `# Deployment Date: ${currentDate}`
      );
    }
    
    // Write updated content back to file
    fs.writeFileSync(frontendEnvPath, envContent);
    console.log(`✅ Frontend .env file updated successfully!`);
    console.log(`📍 Updated addresses:`);
    if (sbtAddress) console.log(`   SBT: ${sbtAddress}`);
    if (managementAddress) console.log(`   Management: ${managementAddress}`);
    if (treasuryAddress) console.log(`   Treasury: ${treasuryAddress}`);
    
    return true;
  } catch (error) {
    console.error("❌ Error updating .env file:", error.message);
    return false;
  }
}

// If called directly from command line
if (require.main === module) {
  const args = process.argv.slice(2);
  
  if (args.length === 0) {
    console.log(`
📋 Usage: node scripts/update-frontend-env.js [SBT] [MANAGEMENT] [TREASURY]

Examples:
  # Update all addresses
  node scripts/update-frontend-env.js 0x123... 0x456... 0x789...
  
  # Update specific address (use empty string for others)
  node scripts/update-frontend-env.js 0x123... "" ""
    `);
    process.exit(1);
  }
  
  const [sbt, management, treasury] = args;
  updateFrontendEnv(
    sbt || null, 
    management || null, 
    treasury || null
  );
}

module.exports = { updateFrontendEnv };