# AlyraProject


// j'ai initialisé 6 électeurs  de accounts[0] à accounts[5]
//  VotingInstance est l'instance du contrat sur lequel vonst se faire les tests

### 1 Ouverture d'une Describe REGISTRATION, dans cette partie j'enregistre l'électeur second
 et je  teste le setter  addVoter et le getter getVoter
 je teste l'enregistrement de l'électeur en vérifiant le booléen isRegistered
 je teste le revert 'Already registered'
 je teste l'évènement VoterRegistered qui signale que l'électeur second a été enregistré

       
### 2  Ouverture d'une Describe PROPOSAL

Enregistrement de 10 propositions dans un tableau et vérification que la 5eme proposition est bien "plus de vacances"     
test setter/getter  Proposal

Test du getter , vérification que la proposition numéro 6 est  "faire du sport au taff"

Test de l'Event ProposalRegistered 
Test du Revert endProposalsRegistering
Test du Revert 'Vous ne pouvez pas ne rien proposer'



### 3   Ouverture d'une Describe REGISTRATION Test VOTE 

test du setter, des event , et revert 
test de l'incrémentation du voteCount lors du vote pour, exempe une proposal numéro 4 voteCount = 2 
test de l'event Voted

































































