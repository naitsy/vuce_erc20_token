import Web3 from "web3";

let web3;
if ( window.web3 ){
    console.log("window.web3.1");
console.log(window.web3);
    web3 = new Web3( window.web3.currentProvider );
}

window.addEventListener("load", async()=>{

    if( window.ethereum ){
        console.log("window.ethereum");

        window.web3 = new Web3( window.ethereum );

        try {
            
            console.log("ethereum enable");
            await window.ethereum.enable();
            console.log("ethereum enable: ok");

        } catch( err ){

            alert("User denied account access...");

        }

    } else if ( window.web3 ){
        console.log("window.web3.2");

        window.web3 = new Web3( web3.currentProvider );

    } else {

        console.log("else");

        alert("Non-ethereum browser detected. You should trying");

    }

});

export default web3;