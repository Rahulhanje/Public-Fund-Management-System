// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract PublicFundTreasury {
    // ===== State =====
    address public owner;
    uint256 private treasuryBalance;

    struct Proposal {
        uint256 id;
        string description;
        uint256 amount;
        address recipient;
        uint256 votes;
        bool approved;
        bool fundsReleased;
        mapping(address => bool) hasVoted;
    }

    uint256 private proposalCount;
    mapping(uint256 => Proposal) private proposals;

    // ===== Modifiers =====
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner");
        _;
    }

    modifier proposalExists(uint256 proposalId) {
        require(proposalId > 0 && proposalId <= proposalCount, "Proposal does not exist");
        _;
    }

    // ===== Constructor =====
    constructor() {
        owner = msg.sender;
    }

    // ===== Funds management =====
    function depositFunds() external payable {
        require(msg.value > 0, "Deposit must be greater than zero");
        treasuryBalance += msg.value;
    }

    function getTreasuryBalance() external view returns (uint256) {
        return treasuryBalance;
    }

    // ===== Proposals =====
    function submitProposal(string calldata description, uint256 amount, address recipient) external {
        require(amount > 0, "Requested amount must be greater than zero");
        require(recipient != address(0), "Invalid recipient address");

        proposalCount += 1;
        Proposal storage p = proposals[proposalCount];
        p.id = proposalCount;
        p.description = description;
        p.amount = amount;
        p.recipient = recipient;
    }

    function getProposal(uint256 proposalId)
        external
        view
        proposalExists(proposalId)
        returns (
            uint256 id,
            string memory description,
            uint256 amount,
            address recipient,
            uint256 votes,
            bool approved,
            bool fundsReleased
        )
    {
        Proposal storage p = proposals[proposalId];
        return (p.id, p.description, p.amount, p.recipient, p.votes, p.approved, p.fundsReleased);
    }

    // ===== Voting =====
    function voteOnProposal(uint256 proposalId) external proposalExists(proposalId) {
        Proposal storage p = proposals[proposalId];
        require(!p.hasVoted[msg.sender], "Already voted on this proposal");
        p.hasVoted[msg.sender] = true;
        p.votes += 1;

        // Simple threshold: approve at 3 votes as test expects
        if (p.votes >= 3) {
            p.approved = true;
        }
    }

    // ===== Fund release =====
    function releaseFunds(uint256 proposalId) external onlyOwner proposalExists(proposalId) {
        Proposal storage p = proposals[proposalId];
        require(p.approved, "Proposal is not approved");
        require(!p.fundsReleased, "Funds already released");
        require(treasuryBalance >= p.amount, "Insufficient treasury balance");

        p.fundsReleased = true;
        treasuryBalance -= p.amount;
        payable(p.recipient).transfer(p.amount);
    }
}


