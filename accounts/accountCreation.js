/**
 * @author Ayushi
 * This script will generate 5 new Hedera Testnet Accounts and will query the balance of created accounts
 */

const {
    Client,
    PrivateKey,
    AccountCreateTransaction,
    AccountBalanceQuery,
    Hbar
} = require("@hashgraph/sdk");

//Loading values from environment file
require("dotenv").config();

//Set hedera testnet account Id and private key from environment file
const ownerAccountId = process.env.MY_ACCOUNT_ID;
const ownerPrivateKey = process.env.MY_PRIVATE_KEY;

//If ownerAccountID and ownerPrivateKey are unavailable ,an error should be raised.
if (ownerAccountId == null || ownerPrivateKey == null) {
    throw new Error("Environment variables ownerAccountId and ownerPrivateKey must be present");
}

// Create connection to the Hedera network
const client = Client.forTestnet();
client.setOperator(ownerAccountId, ownerPrivateKey);
 
async function accountCreation() {

    //creating an array list to store account details
    const accountsCreatedList = [];

    //creating 5 new accounts using for loop
    for (i = 0; i < 5; i++) {

        //Creating new keys for accounts using auto account creation
        const newAccountPrivateKey = PrivateKey.generateED25519();
        const newAccountPublicKey = newAccountPrivateKey.publicKey;

        //Creating new accounts with 500 Hbar as their starting balance
        const newAccount = await new AccountCreateTransaction() 
            .setKey(newAccountPublicKey) 
            .setInitialBalance(new Hbar(500))
            .execute(client);

        // Get the new account ID
        const getReceipt = await newAccount.getReceipt(client);
        const newAccountId = getReceipt.accountId;
 
        //Printing details of newly generated accounts on console
        console.info(`=================== CREDENTIAL ACCOUNT_${i + 1}=======================`);
        console.log(`ACCOUNT_${i + 1}_ID = ${newAccountId} \n `);
        console.log(`ACCOUNT_${i + 1}_PBKEY = ${newAccountPublicKey} \n`);
        console.log(`ACCOUNT_${i + 1}_PVKEY = ${newAccountPrivateKey} \n `);

        accountsCreatedList.push(newAccountId);
    }
    //call the infoBalance function for checking account balance
    infoBalance(accountsCreatedList);
}

//function to get balance of accounts
async function infoBalance(accountsCreatedList) {

    //Loop for checking balance of newly created accounts
    for (const newIdofAccounts of accountsCreatedList) {

        const accountBalance = await new AccountBalanceQuery()
            .setAccountId(newIdofAccounts)
            .execute(client);

        console.log("The new account " + newIdofAccounts + " has balance of" + accountBalance.hbars + " Hbar.");

        console.log("Account info for account :")
        console.log(JSON.stringify(accountBalance));
    }

}

//call the accountCreation function at the top level scope
accountCreation();