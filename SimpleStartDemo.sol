//合约文件

pragma solidity ^0.4.2;

contract SimpleStartDemo {
    //声明状态变量
    int256 storedData;
    event AddMsg(address indexed sender, bytes32 msg);
    //构造函数只在合约创建的时候被运行。
    function SimpleStartDemo() {
        storedData = 5;
    }

    function setData(int256 x) public{
        storedData = x;
        AddMsg(msg.sender, "[in the set() method]");
    }

    function getData() constant public returns (int256 _ret) {
        AddMsg(msg.sender, "[in the get() method]");
        return _ret = storedData;
    }
}
