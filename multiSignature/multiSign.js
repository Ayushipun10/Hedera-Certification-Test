/**
 * @author Ayushi
 * This script will create new wallet with initial balance of 20 hbar
 * This script will have 3 keys of account 1,2 and 3 in a key list with threshold 2
 * This script will create transaction to send 10 Hbar to account 4
 */

//Import Dependencies
const {
    Wallet,
    LocalProvider,
    AccountId,
    PrivateKey,
    KeyList,
    AccountCreateTransaction,
    Hbar,
    AccountBalanceQuery,
    TransferTransaction,
    ScheduleSignTransaction,
    ScheduleInfoQuery,
    TransactionRecordQuery,
    PublicKey,
} = require("@hashgraph/sdk");

//load the environment variables
require('dotenv').config();


/**
 * @typedef {import("@hashgraph/sdk").AccountBalance} AccountBalance
 * @typedef {import("@hashgraph/sdk").AccountId} AccountId
 */
 const accountId1 =  AccountId.fromString(process.env.ACCOUNT_1_ID);
 const privateKey1=  PrivateKey.fromString(process.env.ACCOUNT_1_PVKEY);
 const publicKey1 =  PublicKey.fromString(process.env.ACCOUNT_1_PBKEY);
 const accountId2 =  AccountId.fromString(process.env.ACCOUNT_2_ID);
 const privateKey2=  PrivateKey.fromString(process.env.ACCOUNT_2_PVKEY);
 const publicKey2 =  PublicKey.fromString(process.env.ACCOUNT_2_PBKEY);
 const accountId3 =  AccountId.fromString(process.env.ACCOUNT_3_ID);
 const privateKey3=  PrivateKey.fromString(process.env.ACCOUNT_3_PVKEY);
 const publicKey3 =  PublicKey.fromString(process.env.ACCOUNT_3_PBKEY);
 const accountId4 =  AccountId.fromString(process.env.ACCOUNT_4_ID);
 const privateKey4=  PrivateKey.fromString(process.env.ACCOUNT_4_PVKEY);

 //Validating keys from .env file
if (accountId1 == null ||privateKey1 == null) {
    throw new Error("Please check .env file");
}
if (accountId2 == null ||privateKey2 == null) {
    throw new Error("Please check .env file");
}
if (accountId3 == null ||privateKey3 == null) {
    throw new Error("Please check .env file");
}
if (accountId4 == null ||privateKey4 == null) {
    throw new Error("Please check .env file");
}

async function schedule() {
    
    const wallet = new Wallet(accountId4,privateKey4,new LocalProvider());
       

    // generate keys
    const publicKeyList = [];
    publicKeyList.push(publicKey1);
    publicKeyList.push(publicKey2);
    publicKeyList.push(publicKey3);

    const privateKeyList = [];
    privateKeyList.push(privateKey1);
    privateKeyList.push(privateKey2);
    privateKeyList.push(privateKey3);
    const thresholdKey = new KeyList(publicKeyList, 3);

    // create multi-sig account
    let transaction = await new AccountCreateTransaction()
        .setKey(thresholdKey)
        .setInitialBalance(new Hbar(20))
        .setAccountMemo("2-of-3 multi-sig account4")
        .freezeWithSigner(wallet);
    transaction = await transaction.signWithSigner(wallet);
    const txAccountCreate = await transaction.executeWithSigner(wallet);

    const txAccountCreateReceipt = await txAccountCreate.getReceiptWithSigner(
        wallet
    );
    const multiSigAccountId = txAccountCreateReceipt.accountId;
    console.log(
        `2-of-3 multi-sig account ID:  ${multiSigAccountId.toString()}`
    );
    await queryBalance(multiSigAccountId, wallet);

    // schedule crypto transfer from multi-signature account to operator account
    const txSchedule = await (
        await (
            await (
                await new TransferTransaction()
                    .addHbarTransfer(multiSigAccountId, new Hbar(-10))
                    .addHbarTransfer(
                        wallet.getAccountId(),
                        new Hbar(10)
                    )
                    .schedule() // create schedule
                    .freezeWithSigner(wallet)
            ).signWithSigner(wallet)
        ).sign(privateKeyList[0])
    ) // add signature of Account 1
        .executeWithSigner(wallet);

    const txScheduleReceipt = await txSchedule.getReceiptWithSigner(wallet);
    console.log("Schedule status: " + txScheduleReceipt.status.toString());
    const scheduleId = txScheduleReceipt.scheduleId;
    console.log(`Schedule ID:  ${scheduleId.toString()}`);
    const scheduledTxId = txScheduleReceipt.scheduledTransactionId;
    console.log(`Scheduled tx ID:  ${scheduledTxId.toString()}`);

    // add signature of 2 account
    const txScheduleSign1 = await (
        await (
            await (
                await new ScheduleSignTransaction()
                    .setScheduleId(scheduleId)
                    .freezeWithSigner(wallet)
            ).signWithSigner(wallet)
        ).sign(privateKeyList[1])
    ).executeWithSigner(wallet);

    const txScheduleSign1Receipt = await txScheduleSign1.getReceiptWithSigner(
        wallet
    );
    console.log(
        "1. ScheduleSignTransaction status: " +
            txScheduleSign1Receipt.status.toString()
    );
    await queryBalance(multiSigAccountId, wallet);

    // add signature of 3 account to trigger scheduled transaction
    const txScheduleSign2 = await (
        await (
            await (
                await new ScheduleSignTransaction()
                    .setScheduleId(scheduleId)
                    .freezeWithSigner(wallet)
            ).signWithSigner(wallet)
        ).sign(privateKeyList[2])
    ).executeWithSigner(wallet);

    const txScheduleSign2Receipt = await txScheduleSign2.getReceiptWithSigner(
        wallet
    );
    console.log(
        "2. ScheduleSignTransaction status: " +
            txScheduleSign2Receipt.status.toString()
    );
    await queryBalance(multiSigAccountId, wallet);

}

/**
 * @param {AccountId} accountId
 * @param {Wallet} wallet
 * @returns {Promise<AccountBalance>}
 */
async function queryBalance(accountId, wallet) {
    const accountBalance = await new AccountBalanceQuery()
        .setAccountId(accountId)
        .executeWithSigner(wallet);
    console.log(
        `Balance of account ${accountId.toString()}: ${accountBalance} Hbar`
    );
    return accountBalance;
}
//call the async function at the top level scope
void schedule();