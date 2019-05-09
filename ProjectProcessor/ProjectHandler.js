'use strict'

const { TransactionHandler } = require('sawtooth-sdk/processor/handler');// require the transaction module here from SDK

const {
  InvalidTransaction,
  InternalErrorpayloadActions
} = require('sawtooth-sdk/processor/exceptions')
const crypto = require('crypto')
const {TextEncoder, TextDecoder} = require('text-encoding/lib/encoding')

const _hash = (x) => crypto.createHash('sha512').update(x).digest('hex').toLowerCase().substring(0, 64)
var encoder = new TextEncoder('utf8')
var decoder = new TextDecoder('utf8')

var CJ_FAMILY_NAME = 'ProjectFund';
var CJ_NAMESPACE = _hash(CJ_FAMILY_NAME).substring(0,6);

const _decodeRequest = function(payload){
  var payloadActions = payload.toString().split('&,');
  var payloadDecoded = {
    action : payloadActions[0],
    pData : payloadActions[1]
  }
  return payloadDecoded;
}

const _getprojectmanageraddress = function(PK,data) {
  console.log("data",data);
  if(PK=='')
   {
    throw new InvalidTransaction("Signer Public Key not Initialised"); 
   }
  else if(PK==1)
   {
      var input=JSON.parse(data);  
      var Address = CJ_NAMESPACE + "00" + _hash(input.proj_key).substring(0, 12) + "00" + _hash(data).substring(0,48);
      return Address;   
   }
  else if(PK==2)
   {
      var input=JSON.parse(data);  
      var Address = CJ_NAMESPACE + "00" + _hash(input.proj_key).substring(0, 12) + "01" + _hash(data).substring(0,48);
      return Address;
   }
  else
   {
      var Address = CJ_NAMESPACE + "00" + _hash(PK).substring(0, 12) + "00" + _hash(data).substring(0,48);
      return Address;
   }
  
}

const _getcontractoraddress = function(PK,data) {
  var input = JSON.parse(data);
  if(PK=='')
   {
    throw new InvalidTransaction("Signer Public Key not Initialised"); 
   }
  if(PK==1)
   {
      var Address = CJ_NAMESPACE + "01" + _hash(input.con_key).substring(0, 12) + "00" + _hash(data).substring(0,48);
      return Address;
   }
  else if(PK==2)
   {
      var Address = CJ_NAMESPACE + "01" + _hash(input.con_key).substring(0, 12) + "01" + _hash(data).substring(0,48);
      return Address;
   }
  else
   {
      var Address = CJ_NAMESPACE + "01" + _hash(PK).substring(0, 12) + "00" + _hash(data).substring(0,48);
      return Address;
   }
  
}

const _getonsitemanagerddress = function(flag,data)
 {
   if(flag==1)
    {
      var input = JSON.parse(data);
      var address = CJ_NAMESPACE + "10" + _hash(input.e_key).substring(0,12) + "01" + _hash(data).substring(0,48);
      return address;
    }
    else
     {
        var input = JSON.parse(data);
        var address = CJ_NAMESPACE + "10" + _hash(input.e_key).substring(0,12) + "00"+  _hash(data).substring(0,48);
        return address;
     }
 }

const _getprojectaddress = function(data)
 {
   var input = JSON.parse(data);
   var address = CJ_NAMESPACE + "11" + _hash(input.proj_key).substring(0,12) + _hash(data).substring(0,50);
   return address;
 }


const _setState = function(context, stateData, addresses) {
  let newStateMappings = {};
  addresses.forEach((address, index) => {
    let addressStateData = stateData[index];
    let newStateData = '';
    if(addressStateData) {
      newStateData = encoder.encode(addressStateData.toString());
    }
    newStateMappings = Object.assign({
      [address] : newStateData
    }, newStateMappings);
  })
  return context.setState(newStateMappings);
}

const _getnewdata = function(data,signer,flag)
 {
   if(flag==0)
    {
      data.proj_key=signer;
    }
  else if(flag==1)
   {
     data.con_key=signer;
   }
  return JSON.stringify(data);
 }

const projectfortender = function(projectDetails) 
 {
    const data = _getnewdata(JSON.parse(projectDetails.update.pData),projectDetails.signerPK,0);
    const projectaddress = _getprojectaddress(data);
    return projectDetails.context.getState([projectaddress])
    .then((stateMappings) => {
      const projectstate = stateMappings[projectaddress];
      return newprojectfortender(projectDetails.context, projectstate,projectaddress, data);
    })
 }

const newprojectfortender = function(context,currentstate,projectaddress,data)
 {
    let newproject;
    if(currentstate == '' || currentstate == null ) {
      newproject=data;
      console.log("newproj",newproject);
    } else {
      throw new InvalidTransaction("Project already exists");
    }

    context.addReceiptData(Buffer.from("Project for tender" + newproject, 'utf8'));

    context.addEvent(
      'eproject/newprojectfortender',
      [ ['proj_tender', newproject]]
    );


    return _setState(
      context,
      [newproject],
      [projectaddress]   
    );
 }

const bidfortender =function(projectDetails)
 {
    const con_key = projectDetails.signerPK;
    const con_id = JSON.parse(projectDetails.update.pData).con_id;
    const projectaddress = JSON.parse(projectDetails.update.pData).address;
    return projectDetails.context.getState([projectaddress])
    .then((stateMappings) => {
      const projectstate = stateMappings[projectaddress];
      return biddedfortender(projectDetails.context, projectstate,projectaddress,con_key,JSON.parse(projectDetails.update.pData));
    })
 }

const biddedfortender = function(context,currentstate,projectaddress,con_key,data)
 {
    let currentstatedecoded,currentstatechange,newstate;
    if(!currentstate.length) 
    {
        throw new InvalidTransaction("No valid project found");
    } 
    else 
    {
        currentstatedecoded = decoder.decode(currentstate);
        console.log("currentstate",currentstatedecoded);
        currentstatechange=JSON.parse(currentstatedecoded);
        let lowvalue = 0.9 * currentstatechange.amount;
        if(lowvalue > data.bidamount)
         {
          throw new InvalidTransaction("Bidding amount less than lower limit")
         }
        else if(currentstatechange.bidamount==0 || currentstatechange.bidamount>data.bidamount)
         {
            currentstatechange.bidamount=data.bidamount;
            currentstatechange.con_id=data.con_id;
            currentstatechange.con_key=con_key; 
            console.log("currentstatechange",JSON.stringify(currentstatechange));
            newstate=JSON.stringify(currentstatechange);
            const newprojectaddress = _getprojectaddress(newstate)
            return _setState(
              context, 
              [newstate,null], 
              [newprojectaddress,projectaddress]
            );
         }
        else
         {
           throw new InvalidTransaction("Bidding amount high")
         }

    }
 }
const addnewproject = function(projectDetails)
 {
    const projectaddress = JSON.parse(projectDetails.update.pData).address;
    return projectDetails.context.getState([projectaddress])
      .then((stateMappings) => {
        const currentstate = stateMappings[projectaddress];
        return newproject(projectDetails.context, currentstate, projectaddress);
      }) 
 }
const newproject = function(context,currentstate,projectaddress)
 {
  let currentstatedecoded,currentstatechange,newstate;
  if(!currentstate.length) 
   {
      throw new InvalidTransaction("No valid project found");
   } 
  else 
   {  
      currentstatedecoded = decoder.decode(currentstate);
      currentstatechange=JSON.parse(currentstatedecoded);
      if(currentstatechange.con_key == null)
       {
         throw new InvalidTransaction("No contractor accepted tender");
       }
      else
       {
          
          currentstatechange.cuploaded=false;
          currentstatechange.papproved=false;   
          console.log("currentstatechange",JSON.stringify(currentstatechange));
          newstate=JSON.stringify(currentstatechange);
          const newprojectmanageraddress = _getprojectmanageraddress(1,newstate);
          const newcontractoraddress = _getcontractoraddress(1,newstate);
          
          context.addEvent(
            'eproject/newproject',
            [ ['newproject', newstate]]
          );
          
          return _setState(
            context, 
            [newstate, newstate, null], 
            [newprojectmanageraddress,newcontractoraddress,projectaddress]
          );
          
       }

   }
 }

const contractor_upload_bill = function(projectDetails)
 {
    const contractoraddress = JSON.parse(projectDetails.update.pData).address;
    return projectDetails.context.getState([contractoraddress])
      .then((stateMappings) => {
        const currentstate = stateMappings[contractoraddress];
        return contractor_uploaded_bill(projectDetails.context, currentstate, contractoraddress,projectDetails.update.pData);
      }) 
 }

 const contractor_uploaded_bill = function(context,currentstate,oldcontractoraddress,data)
 {
  let currentstatedecoded,currentstatechange,newstate;
  if(!currentstate.length) 
   {
      throw new InvalidTransaction("No valid project found");
   } 
  else 
   {  
      var data = JSON.parse(data);
      currentstatedecoded = decoder.decode(currentstate);
      const oldprojectmanageraddress = _getprojectmanageraddress(1,currentstatedecoded);
      currentstatechange=JSON.parse(currentstatedecoded);
      if(currentstatechange.cuploaded == true)
       {
        throw new InvalidTransaction("Bill already uploaded");
       }
      else
       {
          currentstatechange.cuploaded=true;
          currentstatechange.bill = data.bill;
          console.log("currentstatechange",JSON.stringify(currentstatechange));
          newstate=JSON.stringify(currentstatechange);
          const newprojectmanageraddress = _getprojectmanageraddress(1,newstate);
          const onsitemanager = _getonsitemanagerddress(0,newstate);
          const newcontractoraddress = _getcontractoraddress(1,newstate);
          return _setState(
            context, 
            [newstate, newstate,newstate, null,null], 
            [newprojectmanageraddress,newcontractoraddress,onsitemanager,oldprojectmanageraddress,oldcontractoraddress]
          );
  
       }
      
   }
 }
const eapprove = function(projectDetails)
 {
    const onsitemanageraddress = JSON.parse(projectDetails.update.pData).address;
    return projectDetails.context.getState([onsitemanageraddress])
      .then((stateMappings) => {
        const currentstate = stateMappings[onsitemanageraddress];
        return eapproved(projectDetails.context, currentstate, onsitemanageraddress,projectDetails.update.pData);
      }) 
 }

const eapproved = function(context,currentstate,onsitemanageraddress,data)
 {
    let currentstatedecoded,currentstatechange,newstate;
    if(!currentstate.length) 
    {
        throw new InvalidTransaction("No valid project found");
    } 
    else 
    {
        var data = JSON.parse(data);
        currentstatedecoded = decoder.decode(currentstate);
        const oldcontractoraddress = _getcontractoraddress(1,currentstatedecoded);
        const oldprojectmanageraddress = _getprojectmanageraddress(1,currentstatedecoded);
        currentstatechange=JSON.parse(currentstatedecoded);
        currentstatechange.eapproved = true;
        currentstatechange.picture = data.picture;
        currentstatechange.report = data.report;
        console.log("currentstatechange",JSON.stringify(currentstatechange));
        newstate=JSON.stringify(currentstatechange);
        const newprojectmanageraddress = _getprojectmanageraddress(1,newstate);
        const newcontractoraddress = _getcontractoraddress(1,newstate);
        const newonsitemanager = _getonsitemanagerddress(0,newstate);
        return _setState(
          context, 
          [newstate, newstate,newstate, null,null,null], 
          [newprojectmanageraddress,newcontractoraddress,newonsitemanager,oldprojectmanageraddress,oldcontractoraddress,onsitemanageraddress]
        );

    }
 }
const project_approve = function(projectDetails)
 {
    const projectmanageraddress = JSON.parse(projectDetails.update.pData).address;
    return projectDetails.context.getState([projectmanageraddress])
      .then((stateMappings) => {
        const currentstate = stateMappings[projectmanageraddress];
        return project_approved(projectDetails.context, currentstate, projectmanageraddress);
      }) 
 }

const project_approved = function(context,currentstate,projectmanageraddress)
 {
    let currentstatedecoded,currentstatechange,newstate;
    if(!currentstate.length) 
    {
        throw new InvalidTransaction("No valid project found");
    } 
    else 
    {
        currentstatedecoded = decoder.decode(currentstate);
        const oldcontractoraddress = _getcontractoraddress(1,currentstatedecoded);
        const oldonsiteaddress = _getonsitemanagerddress(0,currentstatedecoded);
        currentstatechange=JSON.parse(currentstatedecoded);
        currentstatechange.papproved=true;
        console.log("currentstatechange",JSON.stringify(currentstatechange));
        newstate=JSON.stringify(currentstatechange);
        const newprojectmanageraddress = _getprojectmanageraddress(2,newstate);
        const newcontractoraddress = _getcontractoraddress(2,newstate);
        const newonsiteaddress = _getonsitemanagerddress(1,newstate);
        return _setState(
          context, 
          [newstate, newstate,newstate, null,null,null], 
          [newprojectmanageraddress,newcontractoraddress,newonsiteaddress,projectmanageraddress,oldcontractoraddress,oldonsiteaddress]
        );

    }
 
 }
// Write CH extends TH
class CookieJarHandler extends TransactionHandler {
  // Constructor
  constructor(){
    super(CJ_FAMILY_NAME, ['1.0'], [CJ_NAMESPACE]);
  }

  // apply function
  apply(txProcessRequest, context) {
    console.log("txprocessrequest",txProcessRequest)
    const payload = txProcessRequest.payload;
    const update = _decodeRequest(payload);
    console.log("payload", update);
    const signerPK = txProcessRequest.header.signerPublicKey;
    let operationToExecute;
    let operationParameters;
    

    if(update.action == 'addnewproj') 
     {
      const projectDetails = {
        context : context,
        update, update,
        signerPK : signerPK
      }
      operationToExecute = addnewproject;
      operationParameters = projectDetails;
     }
    else if(update.action == 'addprojtender') 
     {
      const projectDetails = {
        context : context,
        update, update,
        signerPK : signerPK
      }
      operationToExecute = projectfortender;
      operationParameters = projectDetails;
     }
    else if(update.action == 'cbidtender') 
     {
      const projectDetails = {
        context : context,
        update, update,
        signerPK : signerPK
      }
      operationToExecute = bidfortender;
      operationParameters = projectDetails;
     }
    else if(update.action == 'c_upload_bill') 
     {

        const projectDetails = {
          context : context,
          update, update,
          signerPK : signerPK
        }
        operationToExecute = contractor_upload_bill;
        operationParameters = projectDetails;
      }
    else if(update.action == 'eapprove') 
      {
       const projectDetails = {
         context : context,
         update, update,
         signerPK : signerPK
       }
       operationToExecute = eapprove;
       operationParameters = projectDetails;
      }
    else if(update.action == 'p_approve_proj') 
      {
 
         const projectDetails = {
           context : context,
           update, update,
           signerPK : signerPK
         }
         operationToExecute = project_approve;
         operationParameters = projectDetails;
       }
    return operationToExecute(operationParameters);
  }
}


module.exports = CookieJarHandler;
