require("dotenv").config();
require("@nomiclabs/hardhat-ethers");
require("@nomicfoundation/hardhat-chai-matchers");

const PRIVATE_KEY = process.env.PRIVATE_KEY;

module.exports = {
  solidity: {
    version: "0.8.18",
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
      viaIR: true,
    },
  },
  networks: {
    hardhat: {
      chainId: 31337,
    },
    localhost: {
      url: "http://127.0.0.1:8545",
      chainId: 31337,
      accounts: PRIVATE_KEY ? [PRIVATE_KEY] : [],
    },
  },
  defaultNetwork: "localhost",
  circom: {
    inputBasePath: "./circuits",
    outputBasePath: "./build/circuits",
    ptau: "path/to/your/ptau/file",
    circuits: [
      {
        name: "verifier",
        protocol: "groth16"
      }
    ]
  }
};