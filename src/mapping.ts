import { BigInt, Address } from '@graphprotocol/graph-ts';
import {
  Contract,
  AllocationStrategyChanged,
  Approval,
  CodeUpdated,
  HatChanged,
  HatCreated,
  InterestPaid,
  LoansTransferred,
  OwnershipTransferred,
  Transfer
} from '../generated/Contract/Contract';
import { User, Source } from '../generated/schema';

export function handleInterestPaid(event: InterestPaid): void {
  let entity = loadUser(event.transaction.from.toHex());

  entity.interestEarned = entity.interestEarned + event.params.amount;

  // Check if interest was earned by self-hat

  // Check all accounts sending interest to this address
  // Calculate the amounts which each address has sent?

  entity.save();
}

export function handleHatChanged(event: HatChanged): void {
  // let entity = loadUser(event.transaction.from.toHex());
  //
  // // Inspect the new hat recipients
  // let contract = Contract.bind(event.address);
  // let recipients = contract.getHatByID(event.params.newHatID).value0;
  // recipients = recipients.forEach(item => item);
  // // add any new recipients to the array
  // let oldRecipients = entity.recipientsList;
  // let newRecipients = recipients.concat(
  //   recipients.filter(item => oldRecipients.indexOf(item) < 0)
  // );
  // entity.recipientsList = newRecipients;
  //
  // entity.save();
}

// Load all the sources of incoming interest
// internal

// external

// Sum it all up

// Multiply each person's balance by their proportion to get weighted contribution.

export function handleApproval(event: Approval): void {}

export function handleCodeUpdated(event: CodeUpdated): void {}

export function handleHatCreated(event: HatCreated): void {}

export function handleLoansTransferred(event: LoansTransferred): void {
  let entity = loadUser(event.transaction.from.toHex());
  let recipient = event.params.recipient.toString();
  let sender = event.params.owner.toString();

  let isNewSender = true;
  let receivedInterest = entity.receivedInterest;
  let newReceivedInterest = receivedInterest;
  // const doesIncludeSource = entity.receivedInterest.find(source => source.address === sender)
  for (let i: i32 = 0; i < receivedInterest.length; i++) {
    let sourceId = receivedInterest[i];
    let source = loadSource(sourceId);
    // If event.transaction.from is the recipient
    if (recipient === entity.id) {
      // If the sender has previously sent interest, add it
      if (source.id === sender) {
        let amount = source.amount + event.params.redeemableAmount;
        newReceivedInterest.splice(i, 1);
        let updatedSource = new Source(sender);
        newReceivedInterest.push(updatedSource);
        // newReceivedInterest[i] = source.amount + event.params.redeemableAmount;
        // Prevent adding a new sender to the list
        isNewSender = false;
        return;
      }
    }
    // If event.transaction.from is not the recipient
  }

  // if (isNewSender) {
  //   let newSource = new Source(sender);
  //   newReceivedInterest.push(newSource);
  // }
  entity.receivedInterest = newReceivedInterest;

  // LoansTransferred(owner, recipient, hatID,
  //     isDistribution,
  //     redeemableAmount,
  //     sInternalAmount);

  entity.save();
}

// log.info("New interest addded", source.amount)

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleAllocationStrategyChanged(
  event: AllocationStrategyChanged
): void {}

export function handleTransfer(event: Transfer): void {}

function loadUser(address: string): User | null {
  let entity = User.load(address);

  if (entity == null) {
    entity = new User(address);
    entity.interestEarned = new BigInt(0);
    entity.recipientsList = [];
    entity.receivedInterest = [];
  }

  return entity;
}

function loadSource(address: string): Source | null {
  let entity = Source.load(address);

  if (entity == null) {
    entity = new Source(address);
    entity.amount = new BigInt(0);
  }

  return entity;
}
