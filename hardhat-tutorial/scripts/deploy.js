const { ethers} = require("hardhat");
require("dotenv").config({ path: ".env" });
require("@nomiclabs/hardhat-etherscan");
const { CRYPTO_DEV_TOKEN_CONTRACT_ADDRESS } = require("../constants");


async function main() {
  const cryptoDevTokenAddress = CRYPTO_DEV_TOKEN_CONTRACT_ADDRESS;
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so exchangeContract here is a factory for instances of our Exchange contract.
  */
  const exchangeContract = await ethers.getContractFactory("Exchange");

  // here we deploy the contract
  const deployedExchangeContract = await exchangeContract.deploy(
    cryptoDevTokenAddress
  );
  await deployedExchangeContract.deployed();
  console.log(
    "Verify Contract Address:",  deployedExchangeContract.address);

  console.log("Sleeping.....");
  // Wait for etherscan to notice that the contract has been deployed
  await sleep(30000)

  // Verify the contract after deploying
  await hre.run ("verify:verify", {
    address: deployedExchangeContract.address,
    constructorArguments:[cryptoDevTokenAddress],
  });
}  
function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });