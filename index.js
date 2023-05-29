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

  // Create a new Hedera client
  const client = Client.forTestnet();
  client.setOperator(operatorAccount, operatorPrivateKey);

  // Read the bytecode of the factory contract
  const factoryBytecode = fs.readFileSync("./FactoryContract_sol_FactoryContract.bin").toString();

  // Create a new contract instance
  const contractInstantiateTx = await new ContractCreateTransaction()
    .setGas(800000)
    .setBytecode(factoryBytecode)
    .execute(client);

    const contractInstantiateRx = await contractInstantiateTx.getReceipt(client);
    const contractId = contractInstantiateRx.contractId;
    const contractAddress = contractId.toSolidityAddress();
    console.log(`- The smart contract ID is: ${contractId} \n`);
    console.log(`- The smart contract ID in Solidity format is: ${contractAddress} \n`);
}

deployFactoryContract().catch(console.error);
