/**
 * @author Ayushi
 * This script will create a private topic 
 * This script will subscribe to a private topic 
 * This script will send mesage to topic
 */
const {
  AccountId,
  PrivateKey,
  Client,
  TopicCreateTransaction,
  TopicMessageQuery,
  TopicMessageSubmitTransaction,
} = require("@hashgraph/sdk");

require("dotenv").config();

//Set the account ID and private key of account 1 from .env file
const myAccountId = process.env.ACCOUNT_1_ID;
const myPrivateKey = PrivateKey.fromString(process.env.ACCOUNT_1_PVKEY);

//Set the account ID and private key of the authorized account from .env file
const authorizedAccountId = process.env.ACCOUNT_2_ID;
const authorizedPrivateKey = PrivateKey.fromString(process.env.ACCOUNT_2_PVKEY);

const client = Client.forTestnet();
client.setOperator(myAccountId, myPrivateKey);

async function consensus() {
  // Create a new topic
  let txResponse = await new TopicCreateTransaction()
    .setSubmitKey(myPrivateKey.publicKey)
    .execute(client);

  // Grab the newly generated topic ID
  let receipt = await txResponse.getReceipt(client);
  let topicId = receipt.topicId;
  console.log(`Your topic ID is: ${topicId}`);

  // Wait 5 seconds between consensus topic creation and subscription creation
  await new Promise((resolve) => setTimeout(resolve, 5000));

  // Create the topic
  new TopicMessageQuery()
    .setTopicId(topicId)
    .subscribe(client, null, (message) => {
      console.log(`Received message from topic: ${message}`);
    });

  // Send message to private topic if authorized
  if (authorizedAccountId) {
    const message = new Date().toUTCString();
    let submitMsgTx = await new TopicMessageSubmitTransaction({
      topicId: topicId,
      message,
    })
      .freezeWith(client)
      .sign(authorizedPrivateKey);

    let submitMsgTxSubmit = await submitMsgTx.execute(client);
    let getReceipt = await submitMsgTxSubmit.getReceipt(client);

    // Get the status of the transaction
    const transactionStatus = getReceipt.status;
    console.log("The message transaction status: " + transactionStatus.toString());

    console.log(`Hey, This is a authorized consensus message and the time is : ${message}`);
  } else {
    console.log("You are not authorized to send messages to this topic.");
  }

  process.exit();
}

//call the async function at the top level scope
consensus();