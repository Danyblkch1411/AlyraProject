const Voting = artifacts.require("./Voting.sol");
const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');

contract('Voting', accounts => {
    const owner = accounts[0];
    const second = accounts[1];
    const third = accounts[2];
    const fourth = accounts[3];
    const five = accounts[4];
    const six = accounts[5];

    let VotingInstance;

    describe("test setter/getter", function () {

        before(async function () {
            VotingInstance = await Voting.new({from:owner});

        });

 // ::::::::::::: REGISTRATION ::::::::::::: // 
// Test du setter/getter  addVoter
        it("should store Voter true in voters mapping, get isRegistered", async () => {
     await VotingInstance.addVoter(second, { from: owner });
     const storedData = await VotingInstance.getVoter(second, {from: second});
     expect(storedData.isRegistered).to.be.true;
        });

        it("should store Voter true in voters mapping, get hasVoted", async () => {
            const storedData = await VotingInstance.getVoter(second, {from: second});
           expect(storedData.hasVoted).to.be.false;
        
        });

// Test de revert, ne doit pas enregistré un électeur déjà inscrit
        it("should not register an already isRegistered, revert", async () => {
        const storedData = await VotingInstance.getVoter(second, {from: second});
        console.log(storedData.isRegistered)

        await expectRevert(VotingInstance.addVoter(second, { from: owner }), 'Already registered');

         });   


    });




    describe("test Event Enregistrement Electeur", function () {

        beforeEach(async function () {
            VotingInstance = await Voting.new({from:owner});

        });

            it("should store Voter true in voters mapping, get event VoterRegistered", async () => {

                const  findEvent = await VotingInstance.addVoter(second, {from: owner});  
                expectEvent(findEvent,'VoterRegistered' , {voterAddress: second});
            });
        
     });
 
  // ::::::::::::: PROPOSAL ::::::::::::: // 

// Test du setter/getter  Proposal
describe("test setter/getter  Proposal", function () {

    before(async function () {
       VotingInstance = await Voting.new({from:owner});
       await VotingInstance.addVoter(second, { from: owner });
       await VotingInstance.addVoter(third, { from: owner });
        await VotingInstance.addVoter(fourth, { from: owner });
        await VotingInstance.startProposalsRegistering({from: owner});

    });


    it("should store 10 proposals in array, get proposal number 5", async () => {
     
        await VotingInstance.addProposal("moins de sel dans la soupe", { from: second });
        await VotingInstance.addProposal("plus de pate", { from: second });
        await VotingInstance.addProposal("quitter plus tot le taff", { from: second });
        await VotingInstance.addProposal("arriver plus tot partir plus tot", { from: second  });
        await VotingInstance.addProposal("arriver plus tard partir plus tard", { from: third  });
        await VotingInstance.addProposal("plus de vacances", { from: third });
        await VotingInstance.addProposal("faire du sport au taff", { from: third });
        await VotingInstance.addProposal("se faire payer les rtt", { from: fourth });
        await VotingInstance.addProposal("plus de yaourt au dessert", { from: fourth });
        await VotingInstance.addProposal("rester au lit et se faire payer", { from: fourth });
       storedData = await VotingInstance.getOneProposal(5, { from: fourth } );
       expect(storedData.description).to.equal("plus de vacances");

       });


       it("should store 10 proposals in array, get proposal number 6", async () => {
     
         storedData = await VotingInstance.getOneProposal(6, { from: fourth } );
         expect(storedData.description).to.equal("faire du sport au taff");

    });

});


// Test Event Enregistrement  Proposal
describe("test des event , et revert Enregistrement Proposal", function () {

    before(async function () {
       VotingInstance = await Voting.new({from:owner});
       await VotingInstance.addVoter(second, { from: owner });
       await VotingInstance.addVoter(third, { from: owner });
        await VotingInstance.addVoter(fourth, { from: owner });
        await VotingInstance.startProposalsRegistering({from: owner});
    });

     it("should add proposal in array, get event ProposalRegistered", async () => {

        await VotingInstance.addProposal("moins de sel dans la soupe", { from: second });
        await VotingInstance.addProposal("plus de pate", { from: second });
        const  findEvent = await VotingInstance.addProposal("quitter plus tot le taff", { from: second });
        await VotingInstance.addProposal("arriver plus tot partir plus tot", { from: second  });

        expectEvent(findEvent,'ProposalRegistered' , {proposalId: new BN(2)});
    });
   

    it("should not register an empty proposal, revert", async () => {


        await expectRevert(VotingInstance.addProposal("", { from: fourth }), 'Vous ne pouvez pas ne rien proposer');

         });   
  

    it("should not register proposal if endProposalsRegistering, revert", async () => {

            await VotingInstance.endProposalsRegistering({from: owner});
            await expectRevert(VotingInstance.addProposal("Augmenter les salaires", { from: fourth }), 'Proposals are not allowed yet');
    
    }); 

});


// Test VOTE 

describe("test du setter, des event , et revert VOTE", function () {

    before(async function () {
       VotingInstance = await Voting.new({from:owner});
       await VotingInstance.addVoter(second, { from: owner });
       await VotingInstance.addVoter(third, { from: owner });
        await VotingInstance.addVoter(fourth, { from: owner });
        await VotingInstance.addVoter(five, { from: owner });
        await VotingInstance.addVoter(six, { from: owner });
        
        await VotingInstance.startProposalsRegistering({from: owner});

        // Saisie des proposal
        await VotingInstance.addProposal("moins de sel dans la soupe", { from: second });
        await VotingInstance.addProposal("plus de pate", { from: second });
        await VotingInstance.addProposal("quitter plus tot le taff", { from: second });
        await VotingInstance.addProposal("arriver plus tot partir plus tot", { from: second  });
        await VotingInstance.addProposal("arriver plus tard partir plus tard", { from: third  });
        await VotingInstance.addProposal("plus de vacances", { from: third });
        await VotingInstance.addProposal("faire du sport au taff", { from: third });
        await VotingInstance.addProposal("se faire payer les rtt", { from: fourth });
        await VotingInstance.addProposal("plus de yaourt au dessert", { from: fourth });
        await VotingInstance.addProposal("rester au lit et se faire payer", { from: fourth });
        await VotingInstance.endProposalsRegistering({from: owner});
        await VotingInstance.startVotingSession({from: owner});


    });

     
    
    it("Si une proposalId n'a reçu aucun vote, son  voteCount égale à 0, get voteCount", async () => {    
        storedData = await VotingInstance.getOneProposal(2, { from: fourth } );
        expect(new BN(storedData.voteCount)).to.be.bignumber.equal(new BN(0));

    });
    
    it("Si une proposalId reçoit un vote, son  voteCount est ++, get voteCount", async () => {    
        await VotingInstance.setVote(4, { from: second });
        await VotingInstance.setVote(4, { from: third });
        storedData = await VotingInstance.getOneProposal(4, { from: third } );
        expect(new BN(storedData.voteCount)).to.be.bignumber.equal(new BN(2));

    });
    
    

// Emission de l'évènement Voted quand il y a un vote pour une proposition
    it("should Emit an even after voted for a ProposalId in array, get event Voted", async () => {

        const  findEvent = await VotingInstance.setVote(1, { from: fourth });
        expectEvent(findEvent,'Voted' , {voter: fourth, proposalId: new BN(1)});
    });
   
// Si un électeur a déjà voté une proposition il ne peut revoter pour la-même
   it("should not register a vote for already voted in array, get revert", async () => {

      await expectRevert(VotingInstance.setVote(1, { from: third }), ' You have already voted');
  });
   

// ==> Tester workflowstatus fin enregistrement proposal
 

});


});
































































