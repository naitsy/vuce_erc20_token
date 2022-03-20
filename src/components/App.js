import React, { Component } from 'react';
import logo from '../logo.png';
import './App.css';
import Web3 from "web3";
// import web3 from "../ethereum/web3";
import token_contract from "../abis/Main.json";
import web3 from '../ethereum/web3';

class App extends Component {
	async componentWillMount(){
		//Carga de web3
		await this.loadWeb3();

		//Carga de los datos de la blockchain
		await this.loadBlockchainData();
	
	}

	async loadWeb3(){
		if ( window.ethereum ) {
			window.web3 = new Web3( window.ethereum );
			await window.ethereum.enable();
		} else if ( window.web3 ) {
			window.web3 = new Web3( window.web3.currentProvider );
		} else {
			window.alert("Non ethereum browser detected. You should consider to use metamask")
		}

	}

	async loadBlockchainData(){
		const web3 = window.web3;

		//Carga de los datos de la cuenta
		const accounts = await web3.eth.getAccounts();
		this.setState({account: accounts[0]});

		const network_id = "5777";
		const network_data = token_contract.networks[network_id];
		console.log( network_data );

		if ( network_data ){
			const abi = token_contract.abi;
			const address = network_data.address;
			const contract = new web3.eth.Contract( abi, address);
			this.setState({contract: contract});

			//Info del smart contract
			const smart_contract = await this.state.contract.methods.getContract().call();
			this.setState({ smart_contract_address: smart_contract });

		} else {
			window.alert("El smart contract no se ha desplegado en la red");
		}
	}

	constructor( props ){
		super( props );
		this.state = {
			contract: null,
			account: undefined,
			smart_contract_address: "",
			owner: "",
			address: "",
			loading: false,
			error_message: "",
			address_balance: 0, 
			cantidad: 0 // no se la intecion de esta prop
		}
	}

	envio = async (address, amount, ethers) => {
		try {
			const accounts = await web3.eth.getAccounts();
			console.log(this.state.account);
			await this.state.contract.methods
				.sendTokens( address, amount)
				.send({
					from: this.state.account,
					value: ethers
				});
		} catch( err ){
			this.setState({ error_message: err.message });
		} 
	}

	balancePersona = async ( address_balance, mensaje) => {
		try {
			//balance persona
			const balance_direccion = await this.state.contract.methods.getAddressBalance( address_balance).call();
			alert(balance_direccion);

			this.setState({ address_balance, balance_direccion})
		} catch( err ) {
			this.setState({ error_message: err.message })
		} finally {

		}
	};

	// Muestra el balance del contrato
	balanceContrato = async ( mensaje ) => {
		try {
			const balance = await this.state.contract.methods.getContractBalance().call();
			alert(balance);
		} catch ( err ){
			this.setState({ error_message: err.message })
		}
	}

	// Crear nuevos tokens
	mintTokens = async ( amount, mensaje ) => {
		try {
			await this.state.contract.methods.mint( amount ).send({ from: this.state.account });
		} catch ( err ) {
			this.setState({ error_message: err.message });
		}
	}

  render() {
    return (
      <div>
        <nav className="navbar navbar-dark fixed-top bg-dark flex-md-nowrap p-0 shadow">
          <a
            className="navbar-brand col-sm-3 col-md-2 mr-0"
            href="https://frogames.es/rutas-de-aprendizaje"
            target="_blank"
            rel="noopener noreferrer"
          >
            DApp
          </a>
		  <ul className="navbar-nav px3">
			  <li className="nav-item text-nowrap d-none d-sm-none d-sm-block">
				  <small className="text-white"><span id="account">{ this.state.smart_contract_address}</span></small>
			  </li>
		  </ul>
        </nav>
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
				<h1>Comprar tokens ERC-20</h1>
				<form action="" onSubmit={(e) => {
					e.preventDefault();
					const direccion = this.direccion.value;
					const cantidad = this.cantidad.value;
					const ethers = web3.utils.toWei( cantidad, "ether" );
					this.envio( direccion, cantidad, ethers );
				}}>
					<input type="text" className="form-control mb-1" placeholder="Direccion de destino" ref={(input) => { this.direccion = input }} />
					<input type="text" className="form-control mb-1" placeholder="Cantidad de token (1 token = 1 eth)" ref = {(input) => { this.cantidad = input}} />
					<input type="submit" value="COMPRAR TOKENS" className="btn btn-block btn-danger btn-sm" />
				
		
				
				</form>
				&nbsp;
				<h1>Balance total de tokens de una wallet</h1>
				<form action="" onSubmit={(e) => {
					e.preventDefault();
					const address = this.address_balance.value;
					this.balancePersona( address );
				}}>
					<input type="text" className="form-control mb-1" placeholder="Direccion de la wallet" ref={(input) => { this.address_balance = input }} />
					<input type="submit" value="VER BALANCE" className="btn btn-block btn-primary btn-sm" />				
				</form>
				&nbsp;

				<h1>Balance de tokens del contrato</h1>
				<form action="" onSubmit={(e) => {
					e.preventDefault();
					const balance = this.balanceContrato();
					this.setState({ address_balance: balance });
				}}>
					<input type="submit" value="VER BALANCE DEL CONTRATO" className="btn btn-block btn-warning btn-sm" />				
				</form>
				
				&nbsp;
				<h1>Crear mas tokens</h1>
				<form action="" onSubmit={(e) => {
					e.preventDefault();
					const amount = this.amount.value;
					this.mintTokens( amount );
				}}>
					<input type="text" className="form-control mb-1" placeholder="Tokens a crear" ref={(input) => { this.amount = input }} />
					<input type="submit" value="CREAR" className="btn btn-block btn-success btn-sm" />				
				</form>

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
