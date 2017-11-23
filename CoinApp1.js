var Web3 = require('web3');
var config = require('./config');
var fs = require('fs');
var execSync = require('child_process').execSync;
var web3sync = require('./web3sync');
var utils = require('./codeUtils');

if (typeof web3 !== 'undefined') {
    web3 = new Web3(web3.currentProvider);
} else {
    web3 = new Web3(new Web3.providers.HttpProvider(config.HttpProvider));
}

console.log(' ........................Start........................');

var filename = "CoinApp1";
console.log('Soc File :' + filename);

try {
    //调用solc本地程序
    //编译合约文件
    execSync("solc --abi  --bin   --overwrite -o " + config.Ouputpath + "  " + filename + ".sol");
    console.log(filename + '编译成功！');
} catch (e) {
    console.log(filename + '编译失败!' + e);
}

(async function() {

    var Contract = await web3sync.rawDeploy(config.account, config.privKey, filename);
    console.log(filename + "部署成功！")

    var address = fs.readFileSync(config.Ouputpath + filename + '.address', 'utf-8');
    var abi = JSON.parse(fs.readFileSync(config.Ouputpath /*+filename+".sol:"*/ + filename + '.abi', 'utf-8'));

    //web3.eth.compile.solidity(source);
    //得到合约对象
    var contract = web3.eth.contract(abi);
    var instance = contract.at(address);
    console.log("读取" + filename + "合约address:" + address);

    //获取合约的代码，部署时传递的就是合约编译后的二进制码
    let deployCode = abi["code"];
    console.log("合约的代码" + deployCode);

    //部署者的地址，当前取默认账户的第一个地址。
    let deployeAddr = web3.eth.accounts[0];
    console.log("部署者的地址" + deployeAddr);

    //
    amount = instance.getMinterAmount();
    console.log("账户余额：" + amount);

    var func_mint = "mint(address,int256)";
    var params_mint = [config.account,2000];
    var receipt = await web3sync.sendRawTransaction(config.account, config.privKey, address, func_mint, params_mint);
    //
    amount = instance.getMinterAmount();
    console.log("账户余额：" + amount);
    //
    var func_send = "send(address,int256)";
    var params_send = [config.account,1000];
    var receipt_send = await web3sync.sendRawTransaction(config.account, config.privKey, address, func_send, params_send);
    //
    amount = instance.getMinterAmount();
    console.log("账户余额：" + amount);


    instance.Sent().watch({}, '', function(error, result) {
        if (!error) {
            console.log("Coin transfer: " + result.args.amount +
                " coins were sent from " + result.args.from +
                " to " + result.args.to + ".");
            console.log("Balances now:\n" +
                "Sender: " + Coin.balances.call(result.args.from) +
                "Receiver: " + Coin.balances.call(result.args.to));
        }
    });

    /*ar event = instance.AddMsg({}, function(error, result) {
        if (!error) {
            var msg = "AddMsg: " + utils.hex2a(result.args.msg) + " from "
            console.log(msg);
            return;
        } else {
            console.log('it error')
        }
    });*/
    console.log("==============================End============================================");
})();