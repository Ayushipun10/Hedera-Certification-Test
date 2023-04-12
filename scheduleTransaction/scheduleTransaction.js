/**
 * @author: Ayushi
 * 
 *This script will create schedule transaction 
 *This script will  delete the schedule transaction
 *This script will get scheduled transaction information
 */
// Import dependencies from hashgraph sdk
const {
    AccountId, Client, Hbar, ScheduleId, ScheduleInfoQuery, Timestamp,
    PrivateKey, TransferTransaction, ScheduleCreateTransaction, ScheduleDeleteTransaction, Transaction
} = require("@hashgraph/sdk");

require("dotenv").config();

// main function to call requisite function
async function main() {
    const myAccountId = AccountId.fromString(process.env.MY_ACCOUNT_ID);
    const myPrivateKey = PrivateKey.fromString(process.env.MY_PRIVATE_KEY);

    // setting keys for accounts
    const account1AccountId = AccountId.fromString(process.env.ACCOUNT_1_ID);;
    const account1PrivateKey = PrivateKey.fromString(process.env.ACCOUNT_1_PVKEY);
    const account2AccountId = AccountId.fromString(process.env.ACCOUNT_2_ID);
    const account2PrivateKey = PrivateKey.fromString(process.env.ACCOUNT_2_PVKEY);

    // creating a client for testnet using account 1
    const myClient = Client.forTestnet().setOperator(myAccountId, myPrivateKey);

    // transferring 2 Hbars from account1 to account2 and then creating schedule 
    let result = await createSchedule(account1AccountId, account2AccountId, myClient, myPrivateKey, "Scheduled Transaction Service is done By Ayushiii.");
    console.info('scheduleId: ' + result.scheduleId);

    // deleting schedule 
    let scheduleDeleteStatus = await deleteSchedule(result.scheduleId, myClient, myPrivateKey);
    console.info('schedule transaction delete status: ' + scheduleDeleteStatus.toString());


    //getting schedule information and transaction proofs 
    await getScheduleInfo(result.scheduleId, myClient);

    // deleting schedule 
    let executeScheduledTx = await executeScheduled(myAccountId, myClient, myPrivateKey);
    console.info('schedule transaction delete status: ' + executeScheduledTx.toString());

    process.exit();
}

// function to transfer 2 hbar and then create a schedule for it

async function createSchedule(fromAccountId, toAccountId, treasuryAccountClient, treasuryAccountPrivateKey, scheduleMemo) {
    console.info("---------- Scheduled Transaction Service == createSchedule START---------------   ");

    // Create a transaction to schedule
    const transferTx = new TransferTransaction()
        .addHbarTransfer(fromAccountId, new Hbar(-2))//setting 2 Hbar to transfer
        .addHbarTransfer(toAccountId, new Hbar(2));//new Hbar(2)

    //Schedule a transaction
    const scheduleTransaction = await new ScheduleCreateTransaction()
        .setScheduledTransaction(transferTx)
        .setScheduleMemo(scheduleMemo)
        .setAdminKey(treasuryAccountPrivateKey)
        .execute(treasuryAccountClient);

    //Get the receipt of the transaction
    const receipt = await scheduleTransaction.getReceipt(treasuryAccountClient);

    //Get the schedule ID
    const scheduleId = receipt.scheduleId;
    console.info("The schedule ID is " + scheduleId);

    //Get the scheduled transaction ID
    const scheduledTxId = receipt.scheduledTransactionId;
    console.info("The scheduled transaction ID is " + scheduledTxId);

    let result = { 'scheduledTxId': scheduledTxId.toString(), 'scheduleId': scheduleId.toString(), }
    // returning scheduleId
    return result;

}


// function to deleteSchedule 

async function deleteSchedule(scheduleId, treasuryAccountClient, treasuryAccountPrivateKey) {
    console.info("----------- Scheduled Transaction Service == deleteSchedule START  -----------  \n ");

    //Create the transaction and sign with the admin key
    const transaction = await new ScheduleDeleteTransaction()
        .setScheduleId(scheduleId)
        .freezeWith(treasuryAccountClient)
        .sign(treasuryAccountPrivateKey);

    //Sign with the operator key and submit to a Hedera network
    const txResponse = await transaction.execute(treasuryAccountClient);

    //Get the transaction receipt
    const receipt = await txResponse.getReceipt(treasuryAccountClient);

    //Get the transaction status
    const transactionStatus = receipt.status;

    //returning tranasaction status
    return transactionStatus.toString();
}

// function to getScheduleInfo 

async function getScheduleInfo(scheduleId, treasuryAccountClient) {
    console.info("-------scheduled_transaction_service --> getScheduleInfo START ------------- \n");

    //Create the query
    const query = new ScheduleInfoQuery().setScheduleId(scheduleId);

    //Sign with the client operator private key and submit the query request to a node in a Hedera network
    const info = await query.execute(treasuryAccountClient);
    console.log("ScheduledId: ", new ScheduleId(info.scheduleId).toString());
    console.log("Memo: ", info.scheduleMemo);
    console.log("CreatedBy: ", new AccountId(info.creatorAccountId).toString());
    console.log("PayedBy: ", new AccountId(info.payerAccountId).toString());
    console.log("The expiration time: ", new Timestamp(info.expirationTime).toDate());

    if (info.executed == null) {
        console.log("The transaction has not been executed yet.");
    } else {
        console.log("The time of execution of the scheduled tx is: ", new Timestamp(info.executed).toDate());
    }
}


async function executeScheduled(accountId, client, privateKey) {
    console.info("----------- Scheduled Transaction Service == executeScheduled START ---------- \n");
    console.log("---------Once a transaction has been deleted on the Hedera network, it cannot be executed again. Deletion of a transaction is a permanent action and cannot be reversed.--------");
    await new Transaction.fromAccountId(accountId).sign(privateKey);

    const executed = await txn.execute(client)
    
    return executed.getReceipt(client)

}
// invoking main method
main();
