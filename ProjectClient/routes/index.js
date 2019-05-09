var express = require('express');
var router = express.Router();
var {ProjectClient}  = require('./ProjectClient');
var fs = require('fs');
var bodyParser = require('body-parser');
const fileUpload = require('express-fileupload');
const sessionStorage = require('node-sessionstorage')
var ipfsAPI = require('ipfs-api');
router.use(bodyParser.json()); // for parsing application/json
router.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
router.use(fileUpload());

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
  
});

router.get('/phome',function(req,res){
  res.render('phome');
});

router.get('/phome/add_new',function(req,res){
  res.render('padd_new');
});

router.get('/phome/approvedprojects',async (req,res) =>{
  var key=sessionStorage.getItem('privatekey');  
  let project_client = new ProjectClient(key);
  let stateData = await project_client.getOrderListings(1);
  let datalist = [];
  stateData.data.forEach(order => {
    if(!order.data) return;
    let decodedOrder = JSON.parse(Buffer.from(order.data, 'base64').toString('ascii'));
    datalist.push({
      address : order.address,
      data: decodedOrder
    });
  });
  console.log("exhcangeorderlist",datalist)
  res.render('papprovedprojects',{listings: datalist});
});

router.get('/phome/pendingprojects', async (req,res) => {
  var key=sessionStorage.getItem('privatekey');  
  let project_client = new ProjectClient(key);
  let stateData = await project_client.getOrderListings(0);
  let datalist = [];
  stateData.data.forEach(order => {
    if(!order.data) return;
    let decodedOrder = JSON.parse(Buffer.from(order.data, 'base64').toString('ascii'));
    datalist.push({
      address : order.address,
      data: decodedOrder
    });
  });
  console.log("exhcangeorderlist",datalist)
  res.render('ppending_proj',{listings: datalist});
});

router.get('/phome/project_tender', async (req,res) => {
  var key=sessionStorage.getItem('privatekey');  
  let project_client = new ProjectClient(key);
  let stateData = await project_client.getOrderListings(6);
  let datalist = [];
  stateData.data.forEach(order => {
    if(!order.data) return;
    let decodedOrder = JSON.parse(Buffer.from(order.data, 'base64').toString('ascii'));
    datalist.push({
      address : order.address,
      data: decodedOrder
    });
  });
  console.log("exhcangeorderlist",datalist)
  res.render('pprojtender',{listings: datalist});
});

router.get('/chome',function(req,res){
  res.render('chome');
});

router.get('/chome/viewprojects',async (req,res) =>{
  var key=sessionStorage.getItem('privatekey');  
  let project_client = new ProjectClient(key);
  let stateData = await project_client.getOrderListings(2);
  let datalist = [];
  stateData.data.forEach(order => {
    if(!order.data) return;
    let decodedOrder = JSON.parse(Buffer.from(order.data, 'base64').toString('ascii'));
    datalist.push({
      address : order.address,
      data: decodedOrder
    });
  });
  console.log("exhcangeorderlist",datalist)
  res.render('cviewprojects',{listings : datalist});
});

router.get('/chome/pendingprojects',async (req,res) =>{
  var key=sessionStorage.getItem('privatekey');  
  let project_client = new ProjectClient(key);
  let stateData = await project_client.getOrderListings(3);
  let datalist = [];
  stateData.data.forEach(order => {
    if(!order.data) return;
    let decodedOrder = JSON.parse(Buffer.from(order.data, 'base64').toString('ascii'));
    datalist.push({
      address : order.address,
      data: decodedOrder
    });
  });
  console.log("exhcangeorderlist",datalist)
  res.render('cpendingprojects',{listings : datalist});
});

router.get('/chome/approvedprojects',async (req,res) =>{
  var key=sessionStorage.getItem('privatekey');  
  let project_client = new ProjectClient(key);
  let stateData = await project_client.getOrderListings(4);
  let datalist = [];
  stateData.data.forEach(order => {
    if(!order.data) return;
    let decodedOrder = JSON.parse(Buffer.from(order.data, 'base64').toString('ascii'));
    datalist.push({
      address : order.address,
      data: decodedOrder
    });
  });
  console.log("exhcangeorderlist",datalist)
  res.render('capproved',{listings : datalist});
});

router.get('/chome/addprojtender', async (req,res) => {
  var key=sessionStorage.getItem('privatekey');  
  let id=0;
  let project_client = new ProjectClient(key);
  let stateData = await project_client.getOrderListings(5);
  let datalist = [];
  stateData.data.forEach(order => {
    if(!order.data) return;
    let decodedOrder = JSON.parse(Buffer.from(order.data, 'base64').toString('ascii'));
      datalist.push({
      id:id,
      address : order.address,
      data: decodedOrder
    }
    );
    id++;
  });
  console.log("exhcangeorderlist",datalist)
  res.render('cprojtender',{listings: datalist});
});

router.get('/ehome',function(req,res){
  res.render('ehome');
});

router.get('/ehome/eview', async (req,res) => {
  var key=sessionStorage.getItem('privatekey');  
  let project_client = new ProjectClient(key);
  let stateData = await project_client.getOrderListings(9);
  let datalist = [];
  stateData.data.forEach(order => {
    if(!order.data) return;
    let decodedOrder = JSON.parse(Buffer.from(order.data, 'base64').toString('ascii'));
    datalist.push({
      address : order.address,
      data: decodedOrder
    });
  });
  console.log("exhcangeorderlist",datalist)
  res.render('eview',{listings: datalist});
});

router.get('/ehome/epending', async (req,res) => {
  var key=sessionStorage.getItem('privatekey');  
  let project_client = new ProjectClient(key);
  let stateData = await project_client.getOrderListings(7);
  let datalist = [];
  stateData.data.forEach(order => {
    if(!order.data) return;
    let decodedOrder = JSON.parse(Buffer.from(order.data, 'base64').toString('ascii'));
    datalist.push({
      address : order.address,
      data: decodedOrder
    });
  });
  console.log("exhcangeorderlist",datalist)
  res.render('epending',{listings: datalist});
});

router.get('/ehome/eapproved', async (req,res) => {
  var key=sessionStorage.getItem('privatekey');  
  let project_client = new ProjectClient(key);
  let stateData = await project_client.getOrderListings(8);
  let datalist = [];
  stateData.data.forEach(order => {
    if(!order.data) return;
    let decodedOrder = JSON.parse(Buffer.from(order.data, 'base64').toString('ascii'));
    datalist.push({
      address : order.address,
      data: decodedOrder
    });
  });
  console.log("exhcangeorderlist",datalist)
  res.render('eapproved',{listings: datalist});
});

router.post('/eupload',(req,res,next)=>{
  const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})
  let sampleFile = req.files.picture;
  console.log(sampleFile);
  var datapicture = sampleFile.data;
  var datareport = req.files.report.data;
  ipfs.files.add(datapicture,(error,res) => {
    if(error)
     {
         console.error(error)
     }
    else
     {
         hash = res[0].hash;
         var uploadlink='https://ipfs.io/ipfs/'+hash;
         console.log("uploadlink",uploadlink);
         sessionStorage.setItem('uploadpicture',uploadlink);
     }
  })
  ipfs.files.add(datareport,(error,res) => {
    if(error)
    {
        console.error(error)
    }
    else
    {
        hash = res[0].hash;
        var uploadlink='https://ipfs.io/ipfs/'+hash;
        console.log("uploadlink",uploadlink);
        sessionStorage.setItem('uploadreport',uploadlink);
    }
  })
  
});

router.post('/upload',(req,res,next)=>{
  const ipfs = ipfsAPI('ipfs.infura.io', '5001', {protocol: 'https'})
  var data = req.files.sampleFile.data;
  ipfs.files.add(data,(error,res) => {
    if(error)
     {
         console.error(error)
     }
    else
     {
         hash = res[0].hash;
         var uploadlink='https://ipfs.io/ipfs/'+hash;
         console.log("uploadlink",uploadlink);
         sessionStorage.setItem('uploadlink',uploadlink);
     }
})
});

router.post('/',(req,res)=>{
  var Key = req.body.privateKey;
  var empid = req.body.empid;
  var username = req.body.username;
  sessionStorage.setItem('privatekey',Key);
  sessionStorage.setItem('empid',empid);
  var empsub = username.substring(0,4);
  var project_client = new ProjectClient(Key);
  const check = project_client.key_check(Key,username);
  if(check == true)
   {
    res.send({ done:1, privatekey: Key, message: "your privatekey is "+ Key, empsub : empsub, empid : empid});
   }
  else
   {
     res.send({ done : 0,message : "Username and Key do not match"});
   }
});

router.post('/add_proj_tender',(req,res,next)=>{
  var pkey=req.body.pkey;
  var data=req.body.data;
  var user=req.body.user;
  var  project_client = new ProjectClient(pkey);
  project_client.send_data('addprojtender',data);
  res.send({message: "Project entered"});

});

router.post('/add_proj',(req,res,next)=>{
  var pkey=req.body.pkey;
  var data=req.body.data;
  var user=req.body.user;
  var  project_client = new ProjectClient(pkey);
  project_client.send_data('addnewproj',data);
  res.send({message: "New project created"});

});

router.post('/phome/pendingprojects', (req,res) => {
  var pkey=req.body.pkey;
  var pData=req.body.pData;
  var project_client = new ProjectClient(pkey);
  project_client.send_data("p_approve_proj",pData);
  res.send({message: "Project Approved"});
})

router.post('/chome/pendingprojects', (req,res) => {
  var pkey=req.body.pkey;
  var Data=req.body.pData;
  var uploadlink = sessionStorage.getItem('uploadlink');
  var data = JSON.parse(Data);
  data.bill = uploadlink;
  var pData = JSON.stringify(data);
  var project_client = new ProjectClient(pkey);
  project_client.send_data('c_upload_bill',pData);
  res.send({message: "Data send"});
})

router.post('/chome/ctender', (req,res) => {
  var pkey=req.body.pkey;
  var pData=req.body.data;
  var project_client = new ProjectClient(pkey);
  project_client.send_data('cbidtender',pData);
  res.send({message: "Bidded"});
})

router.post('/ehome/epending', (req,res) => {
  var pkey=req.body.pkey;
  var Data=req.body.pData;
  var uploadpicture = sessionStorage.getItem('uploadpicture');
  var uploadreport = sessionStorage.getItem('uploadreport');
  var data = JSON.parse(Data);
  data.picture = uploadpicture;
  data.report = uploadreport;
  var pData = JSON.stringify(data);
  var project_client = new ProjectClient(pkey);
  project_client.send_data('eapprove',pData);
  res.send({message: "Data send to project manager"});
})

module.exports = router;
