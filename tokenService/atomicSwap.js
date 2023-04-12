
/**
 * @author Ayushi
 * This script is to atomic swap transaction 150 token to account2 against 10 hbar
*/
 //Import dependencies
const {
    TransferTransaction,
    Client,
    Wallet,
    AccountBalanceQuery,
    Hbar,
    PrivateKey

} = require("@hashgraph/sdk");
// Loads environment variables from a .env file into process.env object using the dotenv package.

require('dotenv').config();

// send token from the treasury Account 
const treasuryAccountId = process.env.ACCOUNT_1_ID;
const treasuryPrivateKey = PrivateKey.fromString(process.env.ACCOUNT_1_PVKEY);

// send token to account2 which will act as recipient
const recipientId = process.env.ACCOUNT_2_ID;
const recipientPrivateKey = PrivateKey.fromString(process.env.ACCOUNT_2_PVKEY);

const tokenId = process.env.TOKEN_ID;

//if treasuryAccountId and treasuryPrivateKey are unavailable, an error should be raised
if (treasuryAccountId == null ||
    treasuryPrivateKey == null) {
    throw new Error("Environment variables treasuryAccountId and treasuryPrivateKey must be present");
}

//if recipientId and recipientPrivateKey are unavailable, an error should be raised
if (recipientId == null ||
    recipientPrivateKey == null) {
    throw new Error("Environment variables recipientId and recipientPrivateKey must be present");
}


//Setting-up the client to interact with Hedera Test Network
const client = Client.forTestnet();
client.setOperator(treasuryAccountId, treasuryPrivateKey);

//create wallet for recipient
const recepientWallet = new Wallet(
    recipientId,
    recipientPrivateKey
);

async function atomicSwap() {

    //  amount of token need to swap
    var transferTokenAmmount = 150

    // amount of HBar need to swap
    var transferHbarAmmount = 10
    console.log(`=============== Swapping ${transferTokenAmmount} Token with ${transferHbarAmmount} Hbar ==========`)

    const atomicSwapTx = await new TransferTransaction()
        .addHbarTransfer(recepientWallet.accountId, new Hbar(-transferHbarAmmount))
        .addHbarTransfer(client.operatorAccountId, new Hbar(transferHbarAmmount))
        .addTokenTransfer(tokenId, client.operatorAccountId, -(transferTokenAmmount))
        .addTokenTransfer(tokenId, recepientWallet.accountId, transferTokenAmmount)
        .freezeWith(client);

    //Sign with the sender account private key and recipient private key
    const signTx = await (await atomicSwapTx.sign(treasuryPrivateKey)).sign(recipientPrivateKey);

    //Sign with the client operator private key and submit to a Hedera network
    const txResponse = await signTx.execute(client);

    //Request the receipt of the transaction
    const receipt = await txResponse.getReceipt(client);

    //Obtain the transaction consensus status
    const transactionStatus = receipt.status;

    console.log(`\n- Atomic swap with account2 status: ${transactionStatus} \n`);
    console.log(`Transaction ID: ${txResponse.transactionId}`);

    //BALANCE CHECK
    var balanceCheckTx = await new AccountBalanceQuery().setAccountId(treasuryAccountId).execute(client);
    console.log(`- Treasury balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} units of token ID ${tokenId}`);

    var balanceCheckTx = await new AccountBalanceQuery().setAccountId(recipientId).execute(client);
    console.log(`- Recipient's balance: ${balanceCheckTx.tokens._map.get(tokenId.toString())} units of token ID ${tokenId}`);

    process.exit();

}
// The async function is being called in the top-level scope.
atomicSwap();
