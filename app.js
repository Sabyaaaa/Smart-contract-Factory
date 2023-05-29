const { Client, PrivateKey, AccountCreateTransaction, ContractCreateTransaction, ContractFunctionParams, Hbar } = require('@hashgraph/sdk');
require("dotenv").config();

async function deployContract() {
    // Hedera Testnet account information
    const operatorPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
    const operatorAccountId = process.env.MY_ACCOUNT_ID;

    // Create a new client for interacting with the Hedera network
    const client = Client.forTestnet();

    // Set the operator account ID and private key
    client.setOperator(operatorAccountId, operatorPrivateKey);

    // Deploy the factory contract
    const factoryContractBytecode = require('fs').readFileSync('FactoryContract_sol_ChildContract.bin', 'utf8');
    console.log("bye");
    const transactionId = await new ContractCreateTransaction()
        .setGas(3000000) // Set the gas limit for contract deployment
        .setBytecode(factoryContractBytecode)
        .execute(client);
    console.log("Hi");
    const receipt = await transactionId.getReceipt(client);
    console.log("xyz");
    const contractId = receipt.contractId;
    const contractAddress = contractId.toSolidityAddress();
    console.log(`- The smart contract ID is: ${contractId} \n`);
    console.log(`- The smart contract ID in Solidity format is: ${contractAddress} \n`);
    // Get the deployed contract address
    // const contractAddress = receipt.getContractId().toString();

    // console.log('Factory contract deployed successfully. Address:', contractAddress);
}

deployContract().catch(console.error);
