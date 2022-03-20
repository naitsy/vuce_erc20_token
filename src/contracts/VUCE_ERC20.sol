// SPDX-License-Identifier: MIT

pragma solidity >=0.6.0 <0.9.0;
pragma experimental ABIEncoderV2;
import "./SafeMath.sol";


// Interface de mi token ERC20
interface IERC20 {
    // returns the token total supply
    function totalSupply() external view returns(uint256);

    // returns the token amount for a token address
    function balanceOf(address account) external view returns(uint256);

    // returns the tokem amount that the spender can spend as the owner
    function allowance(address owner, address spender) external view returns(uint256); 

    // returns a boolean results from the operation
    function transfer(address recipient, uint256 amount) external returns(bool);

    // returns a boolean results from the spend operation
    function approve(address spender, uint256 amount) external returns(bool);

    // returns a boolean result from the operation of transfer a token amount using the allowance method
    function transferFrom(address sender, address recipient, uint256 amount) external returns(bool);

    // evento q se debe emitir cuando una cantidad de tokens pase de un origen a un destino
    event Transfer(address indexed from, address indexed to, uint256 value);

    // evento q se debe emitir cuando se establece una asignacion con el metodo allowance
    event Approval(address indexed owner, address indexed spender, uint256 value);
}

// Mia 0x5B38Da6a701c568545dCfcB03FcB875f56beddC4
// w2  0x17F6AD8Ef982297579C203069C1DbfFE4348c372
// w3  0xdD870fA1b7C4700F2BD7f44238821C26f7392148

contract VUCE_ERC20 is IERC20 {
    using SafeMath for uint256;

    string public constant name = "Vuce Coin";
    string public constant symbol = "VUCE";
    uint8 public constant decimals = 2;

    mapping( address => uint ) balance;
    mapping( address => mapping( address => uint ) ) allowed;
    uint256 total_supply;

    constructor ( uint256 initial_supply ) public {
        total_supply = initial_supply;
        balance[msg.sender] = total_supply;
    }

    function totalSupply() public override view returns(uint256){
        return total_supply;
    }

    // solo Owner
    function increaseTotalSupply(uint tokensToAdd) public {
        total_supply += tokensToAdd;
        balance[msg.sender] += tokensToAdd;
    } 

    function decreaseTotalSupply(uint tokensToBurn) public {

    }

    function balanceOf(address account) public override view returns(uint256){
        return balance[account];
    }

    function allowance(address owner, address spender) public override view returns(uint256){
        return allowed[owner][spender];
    }

    // 
    function transfer(address recipient, uint256 amount) public override returns(bool){
        require( amount <= balance[msg.sender], "Balance insuficiente" );
        balance[msg.sender] = balance[msg.sender].sub( amount );
        balance[recipient] = balance[recipient].add( amount );

        emit Transfer(msg.sender, recipient, amount);

        return true;
    }

    //owner only
    function approve(address spender, uint256 amount) external override returns(bool){
        allowed[msg.sender][spender] += amount;
        emit Approval(msg.sender, spender, amount);

        return true;
    }

    // delegated only    
    function transferFrom(address owner, address recipient, uint256 amount) public override returns(bool){
        require( balance[owner] >= amount, "Insufficient balance");
        require( allowed[owner][msg.sender] >= amount, "Your are not allowed to do this operation" );
        balance[owner] = balance[owner].sub(amount);
        allowed[owner][msg.sender] = allowed[owner][msg.sender].sub(amount);
        
        balance[recipient] = balance[recipient].add(amount);
        
        emit Transfer(owner, recipient, amount);

        return true;
    }
}

