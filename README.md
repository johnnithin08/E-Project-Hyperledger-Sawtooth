#E-PROJECT

##Abstract
e-Project is a project management portal for managing government projects that are assigned to a local governing body over a private blockchain network. This application could help with the tracking of a project throughout it’s journey till completion. It allows 3 types of users to participate where all of them are allowed to add relevant particular data about the project that they are working on. This application allows the governing body to keep track of the project reports and the progress in completion of the project. It also allows the cross verification of data entered by the users to ensure the authenticity of the data provided.

##Description
e-Project is a hyperledger sawtooth application aimed to provide an easier and secure portal for managing projects of a local self governing body. The controlled access to information is a key feature for this application and the fact that it is a private blockchain based application ensures it. The user’s interaction with the application is controlled depending on what kind of user it is. The application expects 3 types of users. 
1)Project manager
2)Onsite Engineer
3)Contractor

Project Manager
The project manager is the superuser in this application. The user with this clearance can create projects and issue the budjet for it. He is the one who makes the contract for the project. He also conducts the tender auctions where in which the contractors can bid the amount. He verifies the reports and bills presented by the site engineer and contractor before approving the project as complete.

Onsite Engineer
The Onsite Engineer has three roles in this system. He has to issue the bill/part bill for the project completed to the contractor. He has to verify if the contractor has uploaded the correct bill that he has issued. He also has to attach his own report of the project and a picture of the site of the completed project. He is the one who sends all the reports to the project manager for final verification.

Contractor
The contractor can perform two actions in this application. He can place the bid for the contract put in the auction and if he gets the contract he can upload the bill issued by the onsite engineer upon  completion of a task.

##How to Setup :

1) Dowload the file from
2)Unzip the file
3)Open the folder and find docker-compose.yaml file.
4)Open terminal and run the command sudo docker-compose  -f docker-compose.yaml up from that folder location.
5)Open bash shell in `project-client` container:  `docker exec -it project-client bash`
6)Create user accounts
	sawtooth keygen proj*** for project manager. eg. sawtooth keygen projnithin
	sawtooth keygen conn*** for contractor. eg.   sawtooth keygen connamal
	sawtooth keygen onsi*** for onsite engineer.  eg.  sawtooth keygen onsiritwhik
NOTE: THE USERS MUST BE SURE TO REMEMBER THE USERNAME AND STORE THE PUBLIC KEY AND PRIVATE KEY. PROJECT MANAGER SHOULD KNOW THE PUBLIC KEY OF THE ONSITE ENGINEER HE IS ASSIGNING.


##How to Set Permissions :

To set up permissions the following are required 
1) A policy file which holds the public keys permitted and denied.
2) A role where the policy is to be applied.

Permissions can be given in two ways. 
Off chain permission - validator will restrict the access
On chain permission – sawtooth network will restrict the access.

On chain permissioning
1) The public keys that to be permitted should be added to “sawtooth.identity.allowed_keys” settings

2)Policies describe a set of identities that have permission to perform some action.
# sawtooth identity policy create -k ~/.sawtooth/keys/my_key.priv --url http://rest-api:8008 policy_1 "PERMIT_KEY *" creates a policy.

3)The roles must be assigned to the policy  using – transactor.SUB_ROLE = POLICY_NAME
    where transactor should be the prefix used to specify roles that deal with the transactor
    eg.   transactor.transaction_signer. = policy_1	

Off chain permissioning

1) In the validator.toml file inside config directory specify the role for the policy.
     ROLE = ROLICY NAME
2) The policy file should have the public keys with their respective keywords
     PERMIT_KEY and DENY_KEY






