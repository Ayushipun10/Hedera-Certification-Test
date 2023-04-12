# 🌟 Hedera Certification Test (Hedera Services) 🌟

This repository is designed to address the questions posed in the Hedera Certification test and to demonstrate the steps taken to arrive at the solutions. The Hedera API is utilized to communicate with high-speed services that leverage the efficiency of hashgraph and have low fees. The Node.js application contains scripts that enable interaction with the Hedera Hashgraph test network, including account-related activities, token management, multi-signature transactions, scheduling, and smart contract interaction.


## 📖 Getting Started

## 🚀 Prerequisites

Before getting started, make sure you have the following:


- 💻 Node.js (v14 or higher)

- 🤑 Hedera Hashgraph account

- 🚀 Hedera Hashgraph Testnet account (for testing)


## 🔧 Installation


- Clone this repository or download the code as a zip file.

`git clone https://github.com/Ayushipun10/Hedera-Certification-Test.git`

- Go to the `Hedera-Certification-Test` directory: `cd Hedera-Certification-Test`

- Install dependencies by running `npm install`.

- Create a `.env` file in the root directory of the project and add your Hedera Hashgraph account details.

- Run the scripts by executing `npm run <script-name>` (replace `<script-name>` with the name of the script you want to execute).


## 💻 Usage


For this application to be used, Node.js needs to be installed on the system along with the `@hashgraph/sdk` and `dotenv` modules. After these dependencies are installed, the repository can be cloned and the scripts can be run using the `npm run`command.


**The following scripts are available:**


### Account Scripts


- `npm run accountCreation`: This script will use to create 5 new accounts on Hedera testnet with some initial balance and query the balances for each account.


### Fungible Token Scripts


- `npm run createFungibleToken`: This script will create create Fungible Token belonging to Account 1.


- `npm run associateAccount`: This script functions by associating tokens with the receipient account.


- `npm run atomicSwap`: This script will swap token against Hbar.


### Smart Contract Scripts


- `npm run smartContract`: This script will be utilized to generate a unique identifier for a smart contract and output the outcomes of the predetermined functions that are contained within the smart contract.


### Multi-Signature Scripts


- `npm run multiSignature`: The script will be utilized for the purpose of transferring Hbar allowance from the owner account to another account which is 4th account using multiple keys(3 keys) with threshold of 2 


### Scheduled Transactions Scripts


- `npm run scheduleTransaction`: The objective of this script is to simplify the process of sending Hbars from Account 1 to Account 2 and this script will delete the transaction also.


### Consensus Scripts


- `npm run consensus`: The purpose of this script is to create and subscribe to a private topic, and also to submit a message to the subscribed topic.


## 📝 License


This project is licensed under the [ISC License](https://opensource.org/licenses/ISC)


## 👩‍💻 About the Author


Hi, I'm Ayushi, a blockchain developer at HCL Technologies. I'm passionate about decentralized technologies and their potential to revolutionize industries.


## 📬 Contact Me


Feel free to get in touch if you have any questions or feedback!


📧 [Email Me](aayushi@hcl.com)
