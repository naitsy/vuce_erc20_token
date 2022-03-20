// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;
import "./VUCE_ERC20.sol";

contract Main {

    // Instancia del token a administrar
    VUCE_ERC20 private _token;

    // Owner del contrato
    address private _owner;

    // Direccion del contrato
    address private _contract;

    constructor() public {
        _token = new VUCE_ERC20(10000000);
        _owner = msg.sender;
        _contract = address(this);
    }

    function getOwner() public view returns(address){
        return _owner;
    }

    function getContract() public view returns(address){
        return _contract;
    }


    // comprar tokens mediante direccion de destino y cantidad de tokens
    // el contrato envia tokens a la direccion de destino especificada
    function sendTokens(address receiver, uint amount) public payable {
        // Limite de tokens a comprar
        require(amount <= 10, "La cantidad de tokens a comprar es demasiado alta");

        // Establecer precio de los tokens
        uint tokens_price = tokensPrice(amount);

        // Verificar que el receiver tenga saldo de ethers para pagar la operacion
        require( msg.value >=  tokens_price, "Insuficient balance");

        // Diferencia de lo que el cliente paga
        uint return_value = msg.value - tokens_price;

        // retorna la cantidad de tokens determinada en return_value (el vuelto)
        payable(msg.sender).transfer( return_value );

        // Obtener el balance de tokens disponibles
        uint balance = getContractBalance();
        require( amount <= balance, "Insuficient tokens");

        //Transfiere los tokens al destinatario
        _token.transfer(receiver, amount);
    }

    function tokensPrice( uint amount ) internal pure returns( uint ){
        return amount * (1 ether);
    }

    function getAddressBalance(address the_address) public view returns(uint){
        return _token.balanceOf(the_address);
    }

    function getContractBalance() public view returns(uint){
        return _token.balanceOf(_contract);
    }

    function mint( uint amount ) public OnlyOwner {
        _token.increaseTotalSupply(amount);
    }

    modifier OnlyOwner() {
        require( msg.sender == getOwner(), "Only owner can use this function");
        _;
    }

}