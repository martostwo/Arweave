
//Create a new wallet and private key

arweave.wallets.generate().then((key) => {
    console.log(key);
});


//Get the wallet address for a private key

arweave.wallets.getBalance(addressDennis).then((balance) => {
    let winston = balance;
    let ar = arweave.ar.winstonToAr(balance);

    console.log(winston);
    //125213858712

    console.log(ar);
    //0.125213858712
});


arweave.wallets.getLastTransactionID(addressDennis).then((transactionId) => {
    console.log(transactionId);
    //3pXpj43Tk8QzDAoERjHE3ED7oEKLKephjnVakvkiHF8
});


//---------------CREATE, SIGN & SUBMIT IMAGE TO ARWEAVE-----------------------

const Arweave = require('arweave');
const fs = require('fs');
const folder = "./images/";
const filePath = folder + "FirstTxn.png";
const data = fs.readFileSync(filePath);
const contentType = ["Content-Type", "image/png"];
let key = {"Your keyWallet":"here"} //{"kty":"RSA","n":...};

// If you want to connect directly to a node. Initialisation:

const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https'
});

const upload = async (data, contentType, key) => {
    const tx = await arweave.createTransaction({ data: data }, key);
    tx.addTag(...contentType);

    await arweave.transactions.sign(tx, key);
    
    let uploader = await arweave.transactions.getUploader(tx);

    while (!uploader.isComplete) {
      await uploader.uploadChunk();
      console.log(`${uploader.pctComplete}% complete, ${uploader.uploadedChunks}/${uploader.totalChunks}`);
    }
    
    console.log("url", `https://arweave.net/${tx.id}`);
    
    return `https://arweave.net/${tx.id}`;
    
};

let txn = upload(data, contentType, key);
setTimeout(() => {console.log(txn)}, 5000);
