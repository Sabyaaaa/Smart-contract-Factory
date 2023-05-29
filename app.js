const { expect } = require('chai');
const { describe, it } = require('mocha');
const fs = require('fs');
const { ethers } = require('ethers');
const { hethers } = require("@hashgraph/hethers");
const { Client, PrivateKey, AccountCreateTransaction, ContractCreateTransaction, ContractFunctionParams, Hbar } = require('@hashgraph/sdk');
require("dotenv").config();


async function deployContract() {
    // Hedera Testnet account information
    const operatorPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);
    // const operatorPrivateKey=PrivateKey.generateED25519();
    const operatorAccountId = process.env.MY_ACCOUNT_ID;

    // Create a new client for interacting with the Hedera network
    const client = Client.forTestnet();

    // Set the operator account ID and private key
    client.setOperator(operatorAccountId, operatorPrivateKey);

    const gasLimit = 1200000;
    const bytecode = fs.readFileSync("./FactoryContract_sol_FactoryContract.bin").toString();
    const abi = JSON.parse(fs.readFileSync(`./FactoryContract_sol_FactoryContract.abi`));

    // const provider = hethers.providers.getDefaultProvider("testnet");

    // const eoaAccount = {
    //     account: operatorAccountId,
    //     privateKey: `0x${operatorPrivateKey.toStringRaw()}` // Convert private key to short format using .toStringRaw()
    // };
    // const wallet = new hethers.Wallet(eoaAccount, provider);

    factory = new hethers.ContractFactory(abi, bytecode);

    // Deploy an instance of the contract
    // contract = await factory.deploy(wallet.getAddress(), 29, { gasLimit: 300000 });
    contract = await factory.deploy();
    // The transaction that the signer sent to deploy
    contract.deployTransaction;

    // // import ABI
    // abi = json.abi;
    // iface = new hethers.utils.Interface(abi);

    // const contractBytecode = json.bytecode;

    // console.log('\n- Deploying contract...', '\n\tgas@', gasLimit);

    // contractId = await contractDeployFcn(contractBytecode, gasLimit);
    // contractAddress = contractId.toSolidityAddress();

    // console.log(`Contract created with ID: ${contractId} / ${contractAddress}`);

    // // Deploy the factory contract
    // const factoryContractBytecode = require('fs').readFileSync('FactoryContract_sol_ChildContract.bin', 'utf8');
    // console.log("bye");
    // const transactionId = await new ContractCreateTransaction()
    //     .setGas(3000000) // Set the gas limit for contract deployment
    //     .setBytecode(factoryContractBytecode)
    //     .execute(client);
    // console.log("Hi");
    // const receipt = await transactionId.getReceipt(client);
    // console.log("xyz");
    // const contractId = receipt.contractId;
    // const contractAddress = contractId.toSolidityAddress();
    // console.log(`- The smart contract ID is: ${contractId} \n`);
    // console.log(`- The smart contract ID in Solidity format is: ${contractAddress} \n`);
    // // Get the deployed contract address
    // // const contractAddress = receipt.getContractId().toString();

    // // console.log('Factory contract deployed successfully. Address:', contractAddress);
}

deployContract().catch(console.error);
