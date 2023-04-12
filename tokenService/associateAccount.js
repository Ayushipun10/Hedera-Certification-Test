/**
 * @author Ayushi
 *  This script associate account with treasury account to transfer tokens 
 * Using the javascript SDK offered by Hedera Hashgraph,
 * the following code connects an account with a token on the test network.
 */

const {
  Client,
  TokenAssociateTransaction,
  Wallet,
  PrivateKey
} = require("@hashgraph/sdk");

//Load environment variables from .env file
require('dotenv').config();

// configuring the treasury Account, using account id and private key of account 1
const treasuryAccountId = process.env.ACCOUNT_1_ID;
const treasuryPrivateKey = PrivateKey.fromString(process.env.ACCOUNT_1_PVKEY);

// associate account2
const account2Id = process.env.ACCOUNT_2_ID;
const account2PrivateKey = PrivateKey.fromString(process.env.ACCOUNT_2_PVKEY);

const tokenId = process.env.TOKEN_ID;

//If treasuryAccountId and treasuryPrivateKey are unavailabe, an error should be raised
if (treasuryAccountId == null ||
  treasuryPrivateKey == null) {
  throw new Error("Environment variables treasuryAccountId and treasuryPrivateKey must be present");
}

//If account2Id and account2PrivateKey are unavailabe, an error should be raised.
if (account2Id == null ||
  account2PrivateKey == null) {
  throw new Error("Environment variables account2Id and account2PrivateKey must be present");
}


//Setting-up the client to interact with Hedera Test Network
const client = Client.forTestnet();
client.setOperator(treasuryAccountId, treasuryPrivateKey);

const account2Wallet = new Wallet(
  account2Id,
  account2PrivateKey
);


async function associate() {

  //LOG THE TRANSACTION STATUS
  console.log(`================= Associating account 2 with the token id: ${tokenId} =============`);

  //Associate account2 with the token
  let associateAccount2Tx = await new TokenAssociateTransaction()
    .setAccountId(account2Wallet.accountId)
    .setTokenIds([tokenId])
    .freezeWith(client)
    .sign(account2PrivateKey)

  //SUBMIT THE TRANSACTION
  let associateAccount2TxSubmit = await associateAccount2Tx.execute(client);

  //GET THE RECEIPT OF THE TRANSACTION
  let associateAccount2Rx = await associateAccount2TxSubmit.getReceipt(client);

  //LOG THE TRANSACTION STATUS
  console.log(`- Token association with account2: ${associateAccount2Rx.status} \n- - Transaction ID for Token association with account2: ${associateAccount2TxSubmit.transactionId}`);


  process.exit();
}

// The async function is being called in the top-level scope.
associate();
