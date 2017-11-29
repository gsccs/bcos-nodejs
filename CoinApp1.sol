//合约文件
pragma solidity ^0.4.2;

contract CoinApp1 {

    address public minter;
    mapping(address => uint) public balances;

    event Sent(address from,address to,uint amount);
    event AddMsg(address indexed sender, bytes32 msg);

    function CoinApp1() {

        minter = msg.sender;
        balances[minter] = 12300;
    }

    function getMinterAmount() constant public returns (uint ret) {
        //Sent(msg.sender,msg.sender,balances[minter]);
        AddMsg(msg.sender, "[getMinterAmount]");
        return ret = balances[minter];
    }

    function mint(address receiver,uint amount) {
        if (msg.sender != minter){
            AddMsg(msg.sender, "msg.sender != minter");
            return;
        }
        balances[receiver] += amount;
        Sent(msg.sender,receiver,amount);
    }

    function send(address receiver,uint amount) {
        if (balances[msg.sender] < amount){
            return;
        }
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        Sent(msg.sender,receiver,amount);

    }

}
