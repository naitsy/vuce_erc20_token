const { assert } = require("chai");

const Main = artifacts.require("./Main.sol");

contract("Main", accounts =>{
    let contrato;

    it("getOwner function", async () => {
        contrato = await Main.deployed();
        const owner = await contrato.getOwner.call();

        assert( owner == accounts[0], "Owner incorrecto");
    });


    it("sendTokens function", async () => {
        const amount = 10000;
        const receiver_balance_pre = await contrato.getAddressBalance.call( accounts[0] );
        const contract_balance = await contrato.getContractBalance.call();

        // console.log("Receiver pre: "+ receiver_balance_pre);
        // console.log("Contract pre: "+ contract_balance);

        //Envio de tokens
        await contrato.sendTokens(accounts[0], amount);

        const receiver_balance_post = await contrato.getAddressBalance.call( accounts[0] );
        const contract_balance_post = await contrato.getContractBalance.call();

        // console.log("Receiver post: "+ receiver_balance_post);
        // console.log("Contract post: "+ contract_balance_post);

        assert( receiver_balance_post == (parseInt(receiver_balance_pre) + amount), "Receiver balance error" );
        assert( contract_balance_post == (parseInt(contract_balance) - amount), "Contract balance error" );

    });

});
// constructor() public {
//     _token = new VUCE_ERC20(10000000);
//     _owner = msg.sender;
//     _contract = address(this);
// }

// getOwner() public view returns(address)
// getContract() public view returns(address)
// sendTokens(address receiver, uint amount) public
// getAddressBalance(address the_address) public 
// getContractBalance()public view returns(uint)
