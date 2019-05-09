function login(){
    const Key = document.getElementById('login_id').value;
    var username  = document.getElementById('username').value;
    var empid=document.getElementById('id').value;
    if(empid.length===0 ){
        alert("please enter the password");
    }
    else{
        $.post('/',{ privateKey : Key, empid : empid ,username : username},(data, textStatus, jqXHR)=>{
            if(data.done =1 && data.empsub=="proj"){
                sessionStorage.clear();
                sessionStorage.setItem("privatekey",data.privatekey);
                sessionStorage.setItem("empid",data.empid);
                var user="Manager";
                sessionStorage.setItem("user",user);
                alert(data.message);
                window.location.href='/phome';
            }
            else if(data.done =1 && data.empsub=="conn"){
                sessionStorage.clear();
                sessionStorage.setItem("privatekey",data.privatekey);
                sessionStorage.setItem("empid",data.empid);
                var user="Contractor";
                sessionStorage.setItem('user',user);
                alert(data.message);
                window.location.href='/chome';

            }
            else if(data.done =1 && data.empsub=="onsi"){
                sessionStorage.clear();
                sessionStorage.setItem("privatekey",data.privatekey);
                sessionStorage.setItem("empid",data.empid);
                var user="Onsite Engineer";
                sessionStorage.setItem('user',user);
                alert(data.message);
                window.location.href='/ehome';

            }
            else
            {
                alert(data.message);
                window.location.href='/';
            }
            
        },'json');
    }
}

function logout(){
    sessionStorage.clear();
    window.location.href='/';
}

function add_proj_tender(event){
    event.preventDefault();
    var pkey=sessionStorage.getItem('privatekey');
    var user=sessionStorage.getItem('user');
    var empid=sessionStorage.getItem('empid');
    var proj_type_element=document.getElementById('ProjType');
    var project_type = proj_type_element.options[proj_type_element.selectedIndex].value;
    var proj_name=document.getElementById('proj_name').value;
    var proj_id=document.getElementById('proj_id').value;
    var e_key=document.getElementById('e_key').value;
    var task=document.getElementById('task').value;
    var amount=document.getElementById('amount').value;
    var data=JSON.stringify({"project_type":project_type,"proj_name":proj_name,"proj_id":proj_id,"empid" : empid,"task":task,"amount":amount,"bidamount" : 0,"e_key" : e_key,"eapproved" : false});
    $.post('/add_proj_tender',{pkey : pkey,data :data,user : user},(data, textStatus, jqXHR)=>{
        alert(data.message);
        
    },'json');
    
}


function c_tender_bid(event,address,id)
 {
    event.preventDefault();
    var id1= id.toString();
    console.log(id1);
    var pkey=sessionStorage.getItem('privatekey');
    var user=sessionStorage.getItem('user');
    var empid=sessionStorage.getItem('empid');
    var bidamount=document.getElementById(id1).value;
    var data=JSON.stringify({"con_id" : empid,"bidamount" : bidamount,"address" : address})
    $.post('/chome/ctender',{pkey : pkey,data :data,user : user},(data, textStatus, jqXHR)=>{
        alert(data.message);    
    },'json');
    
 }

function add_proj(event,address){
    event.preventDefault();
    var pkey=sessionStorage.getItem('privatekey');
    var user=sessionStorage.getItem('user');
    var empid=sessionStorage.getItem('empid');
    var data=JSON.stringify({"address" : address})
    $.post('/add_proj',{pkey : pkey,data :data,user : user},(data, textStatus, jqXHR)=>{
        alert(data.message);    
    },'json');
     
    
    
}

function uploaded(event,address)
 {
     event.preventDefault();
     var pkey=sessionStorage.getItem('privatekey');
     var pData = JSON.stringify({"address" : address});
     $.post('/chome/pendingprojects',{pkey : pkey,pData : pData},(data, textStatus, jqXHR)=>{
         alert(data.message);
    },'json' );
 }

function approve_proj(event,address)
 {
     event.preventDefault();
     var pkey=sessionStorage.getItem('privatekey');
     var pData = JSON.stringify({"address" : address});
     $.post('/phome/pendingprojects',{pkey : pkey,pData : pData},(data, textStatus, jqXHR)=>{
        alert(data.message);
    },'json' );
 }

function e_approve(event,address)
 {
    event.preventDefault();
    var pkey=sessionStorage.getItem('privatekey');
    var pData = JSON.stringify({"address" : address});
    $.post('/ehome/epending',{pkey : pkey,pData : pData},(data, textStatus, jqXHR)=>{
        alert(data.message);
    },'json' );
 }

if (location.pathname == '/phome/add_new') {
    var socket = io('http://localhost:3000/%27');
    socket.on('newprojectfortender', () => {
        console.log("Socket Message Received!");
        
    });
}

if (location.pathname == '/phome/project_tender') {
    var socket = io('http://localhost:3000/%27');
    socket.on('newproject', () => {
        console.log("Socket Message Received!");
        
    });
}
