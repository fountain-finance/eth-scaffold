// SPDX-License-Identifier: MIT
pragma solidity >=0.6.0 <0.8.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./ITreasury.sol";

interface IController {
    /// @notice This event should trigger when an owner initialized their tickets.
    event InitializeTicket(address owner, string name, string symbol);

    /// @notice This event should trigger when a Money pool is configured.
    event ConfigureMp(
        uint256 indexed mpId,
        address indexed owner,
        uint256 indexed target,
        uint256 duration,
        IERC20 want,
        string title,
        string link,
        uint256 bias,
        uint256 o,
        uint256 b,
        address bAddress
    );

    /// @notice This event should trigger when a Money pool is sustained.
    event SustainMp(
        uint256 indexed mpId,
        address indexed owner,
        address indexed beneficiary,
        address sustainer,
        uint256 amount,
        IERC20 want,
        uint256 currentTicketValue
    );

    /// @notice This event should trigger when redistributions are collected.
    event Redeem(address indexed sustainer, uint256 amount);

    /// @notice This event should trigger when sustainments are collected.
    event TapMp(
        uint256 indexed mpId,
        address indexed owner,
        address indexed beneficiary,
        uint256 amount,
        IERC20 want
    );

    function initializeTicket(string calldata _name, string calldata _symbol)
        external;

    function configureMp(
        uint256 _target,
        uint256 _duration,
        IERC20 _want,
        string calldata _title,
        string calldata _link,
        uint256 bias,
        uint256 _o,
        uint256 _b,
        address _bAddress
    ) external returns (uint256 _mpId);

    function sustainOwner(
        address _owner,
        uint256 _amount,
        IERC20 _want,
        address _beneficiary,
        uint256 _convertedFlowAmount
    ) external returns (uint256 _mpId);

    function redeem(address _owner, uint256 _amount) external;

    function tapMp(
        uint256 _mpId,
        uint256 _amount,
        address _beneficiary
    ) external;

    function mintReservedTickets(address _owner) external;

    function appointTreasury(ITreasury _newTreasury) external;

    function withdrawFunds(uint256 _amount, IERC20 _token) external;

    function proposeSuccessor(address _successor) external;

    function migrate(address _proposer) external;
}