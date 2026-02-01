// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract EventLogger {
    event ActionLogged(address indexed user, string action);

    function log(string calldata action) external {
        emit ActionLogged(msg.sender, action);
    }
}
