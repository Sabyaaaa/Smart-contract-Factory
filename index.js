const { Client, AccountId, PrivateKey, ContractCreateTransaction } = require("@hashgraph/sdk");
require("dotenv").config();
const fs = require("fs");

async function deployFactoryContract() {
  // Hedera Testnet account details
  const operatorAccount = AccountId.fromString(process.env.MY_ACCOUNT_ID);
  const operatorPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

  if (operatorPrivateKey == null || operatorAccount == null) {
    throw new Error("Env variables cannot be null");
  }
  console.log("ID and keys are fine");
  // Create a new Hedera client
  const client = Client.forTestnet();
  client.setOperator(operatorAccount, operatorPrivateKey);

  // Read the bytecode of the factory contract
  const factoryBytecode = fs.readFileSync("FactoryContract_sol_FactoryContract.bin").toString();
  console.log("bytecode is fine");
  // Create a new contract instance
  const contractInstantiateTx = await new ContractCreateTransaction()
    .setGas(800000)
    .setBytecode(factoryBytecode);

  const contractInstantiateSubmit = await contractInstantiateTx.execute(client);
  console.log("ContractCreateTransaction is fine");
  const contractInstantiateRx = await contractInstantiateSubmit.getReceipt(client);
  console.log("getReceipt is fine");
  const contractId = contractInstantiateRx.getContractId;
  console.log("contract id is fine");
  const contractAddress = contractId.toSolidityAddress();
  console.log("hi");
  console.log(`- The smart contract ID is: ${contractId} \n`);
  console.log(`- The smart contract ID in Solidity format is: ${contractAddress} \n`);

  // Deploy the Child Contract
  console.info("========== Deploying Child Contract ===========");
  // Import the bytecode and ABI of the child contract
  const childByteCode = fs.readFileSync("ChildContract_sol_ChildContract.bin").toString();
  // const childAbi = JSON.parse(fs.readFileSync("ChildContract_sol_ChildContract.json"));

  // Create a new ContractCreateTransaction for the Child Contract
  const childInstantiateTx = new ContractCreateTransaction()
    .setBytecode(childByteCode)
    .setGas(100000)
    .setConstructorParams([ContractFunctionParameters.fromUint256(0)]);
  const childInstantiateSubmit = await childInstantiateTx.execute(client);
  const childInstantiateRx = await childInstantiateSubmit.getReceipt(client);
  const childContractId = childInstantiateRx.contractId;
  const childContractAddress = childContractId.toString();
  console.log(`- Child Contract deployed with ID: ${childContractId}`);

  // Call the createContract function of the Factory Contract to link it with the Child Contract
  console.info("========== Calling Factory Contract createContract Function ===========");
  const factoryContractExecuteTx = new ContractExecuteTransaction()
    .setContractId(factoryContractId)
    .setGas(100000)
    .setFunction("createContract", [ContractFunctionParameters.fromUint256(0)]);
  const factoryContractExecuteSubmit = await factoryContractExecuteTx.execute(client);
  const factoryContractExecuteRx = await factoryContractExecuteSubmit.getReceipt(client);
  console.log("- Factory Contract createContract function executed successfully");

  // Get the deployed Child Contracts from the Factory Contract
  // console.info("========== Calling Factory Contract getDeployedContracts Function ===========");
  // const factoryContractCallQuery = new ContractCallQuery()
  //   .setContractId(factoryContractId)
  //   .setGas(100000)
  //   .setFunction("getDeployedContracts");
  // const factoryContractCallSubmit = await factoryContractCallQuery.execute(client);
  // const deployedContracts = factoryContractCallSubmit.get<ChildContract[]>(0);
  // console.log("- Deployed Child Contracts:");
  // deployedContracts.forEach((contract) => {
  //   console.log(contract.toString());
  // });
}

deployFactoryContract().catch(console.error);
