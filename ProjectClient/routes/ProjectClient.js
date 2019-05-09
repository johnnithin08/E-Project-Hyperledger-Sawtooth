const {createHash} = require('crypto')
const {CryptoFactory, createContext } = require('sawtooth-sdk/signing')
const protobuf = require('sawtooth-sdk/protobuf')
const fs = require('fs')
const fetch = require('node-fetch');
const {Secp256k1PrivateKey} = require('sawtooth-sdk/signing/secp256k1')	
const {TextEncoder, TextDecoder} = require('text-encoding/lib/encoding')


FAMILY_NAME = 'ProjectFund'


function hash(v) {
  return createHash('sha512').update(v).digest('hex');
}



class ProjectClient{
  constructor(Key)
  {
      console.log("projectclient");
      const context = createContext('secp256k1');
      const secp256k1pk = Secp256k1PrivateKey.fromHex(Key.trim());
      this.signer = new CryptoFactory(context).newSigner(secp256k1pk);
      this.publicKey = this.signer.getPublicKey().asHex();
      console.log("publickey",this.publicKey);
      this.address = this.get_address(this.publicKey);
      console.log("Storing at: " + this.address);  
  }
  
get_address(publicKey)
 {
  var Address= hash(FAMILY_NAME).substr(0, 6) + "22" + hash(publicKey).substr(0, 62);
  return Address;
 }

key_check(prikey,username)
 {
    var privateKeyStrBuf = this.getUserPriKey(username);
    var privateKeyStr = privateKeyStrBuf.toString().trim();
    if(prikey == privateKeyStr)
      {
        return true;
      }
    else 
      {
        return false;
      }
 }

getUserPriKey(userid) 
 {
    var key;
    console.log(userid);
    console.log("Current working directory is: " + process.cwd());
    var userprivkeyfile = '/root/.sawtooth/keys/'+userid+'.priv';
    console.log("directory",userprivkeyfile);
    console.log(fs.readFileSync(userprivkeyfile));
    return fs.readFileSync(userprivkeyfile);
 }	

 async send_data(action,pData={}){
  var payload = ''
  var address = hash(FAMILY_NAME).substr(0, 6);
  console.log("output "+address)

  var inputAddressList = [address];
  var outputAddressList = [address];
  payload = action + "&," + pData;
  var encode =new TextEncoder('utf8');
  const payloadBytes = encode.encode(payload)
  const transactionHeaderBytes = protobuf.TransactionHeader.encode({
    familyName: FAMILY_NAME,
    familyVersion: '1.0',
    inputs: inputAddressList,
    outputs: outputAddressList,
    signerPublicKey: this.signer.getPublicKey().asHex(),
    nonce: "" + Math.random(),
    batcherPublicKey: this.signer.getPublicKey().asHex(),
    dependencies: [],
    payloadSha512: hash(payloadBytes),

  }).finish();

  const transaction = protobuf.Transaction.create({
    header: transactionHeaderBytes,
    headerSignature: this.signer.sign(transactionHeaderBytes),
    payload: payloadBytes
  });
  const transactions = [transaction];
  const  batchHeaderBytes = protobuf.BatchHeader.encode({
    signerPublicKey: this.signer.getPublicKey().asHex(),
    transactionIds: transactions.map((txn) => txn.headerSignature),
  }).finish();

  const batchSignature = this.signer.sign(batchHeaderBytes);
  const batch = protobuf.Batch.create({
    header: batchHeaderBytes,
    headerSignature: batchSignature,
    transactions: transactions,
  });

  const batchListBytes = protobuf.BatchList.encode({
    batches: [batch]
  }).finish();
   this._send_to_rest_api(batchListBytes);	

}


async _send_to_rest_api(batchListBytes){
        
    if (batchListBytes == null) {
      try{
      var geturl = 'http://rest-api:8008/state/'+this.address
      console.log("Getting from: " + geturl);
       let response =await fetch(geturl, {
        method: 'GET',
      })
      let responseJson =await response.json();
      console.log("responseJSON", responseJson);
        var data = responseJson.data;
        console.log("data", data);
        var amount = Buffer.from(data, 'base64').toString();
        return amount;
      }
      catch(error) {
        console.error(error);
      }	
    }
    else{
      console.log("new code");
      try{
     let resp = await fetch('http://rest-api:8008/batches', {
  method: 'POST',
        headers: {
    'Content-Type': 'application/octet-stream'
        },
        body: batchListBytes
         })
           console.log("response", resp);
        }
         catch(error) {
           console.log("error in fetch", error);
         
       } 
   }

}

/**
 * Get state from the REST API
 * @param {*} address The state address to get
 * @param {*} isQuery Is this an address space query or full address
 */
async getState (address, isQuery) {
  let stateRequest = 'http://rest-api:8008/state';
  if(address) {
    if(isQuery) {
      stateRequest += ('?address=')
    } else {
      stateRequest += ('/address/');
    }
    stateRequest += address;
  }
  let stateResponse = await fetch(stateRequest);
  let stateJSON = await stateResponse.json();
  return stateJSON;
}

async getOrderListings(flag) 
{
  const publicKey = this.signer.getPublicKey().asHex();
  let orderListingAddress;
  if(flag==0)
   {
    orderListingAddress = hash(FAMILY_NAME).substr(0, 6) + '00' + hash(publicKey).substr(0,12)+ "00";
   }
  else if(flag==1)
   {
    orderListingAddress = hash(FAMILY_NAME).substr(0, 6) + '00' + hash(publicKey).substr(0,12)+ "01";
   }
  else if(flag==2)
   {
    orderListingAddress = hash(FAMILY_NAME).substr(0, 6) + '01' + hash(publicKey).substr(0,12);
   }
  else if(flag==3)
   {
    orderListingAddress = hash(FAMILY_NAME).substr(0, 6) + '01' + hash(publicKey).substr(0,12) + "00";
   }
  else if(flag==4)
   {
    orderListingAddress = hash(FAMILY_NAME).substr(0, 6) + '01' + hash(publicKey).substr(0,12) + "01";
   }
  else if(flag==5)
   {
     orderListingAddress = hash(FAMILY_NAME).substr(0, 6) + '11';
   }
  else if(flag==6)
   {
     orderListingAddress = hash(FAMILY_NAME).substr(0, 6) + '11' + hash(publicKey).substr(0,12);
   }
  else if(flag==7)
   {
     orderListingAddress = hash(FAMILY_NAME).substr(0, 6) + '10' + hash(publicKey).substr(0,12) + "00";
   }
  else if(flag==8)
   {
     orderListingAddress = hash(FAMILY_NAME).substr(0, 6) + '10' + hash(publicKey).substr(0,12) + "01";
   } 
  else if(flag==9)
   {
     orderListingAddress = hash(FAMILY_NAME).substr(0, 6) + '10' + hash(publicKey).substr(0,12);
   }
  return this.getState(orderListingAddress, true);
}


}

module.exports.ProjectClient = ProjectClient;
