import { BigInt } from '@graphprotocol/graph-ts';
import {
  RToken,
  AllocationStrategyChanged,
  Approval,
  CodeUpdated,
  HatChanged,
  HatCreated,
  InterestPaid,
  LoansTransferred,
  OwnershipTransferred,
  Transfer
} from '../generated/RToken/RToken';
import { CompoundAllocationStrategy } from '../generated/RToken/CompoundAllocationStrategy';
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
  // LoansTransferred(owner, recipient, hatID,
  //     isDistribution,
  //     redeemableAmount,
  //     internalSavingsAmount);

  let sender = event.params.owner.toHex();
  let recipient = event.params.recipient.toHex();
  let isDistribution = event.params.isDistribution;
  let sInternalAmount = event.params.internalSavingsAmount;
  let redeemableAmount = event.params.redeemableAmount;

  let rTokenContract = RToken.bind(event.address);
  let iasContract = CompoundAllocationStrategy.bind(rTokenContract.ias());
  let exchangeRateStored = iasContract.exchangeRateStored();

  let entity = loadUser(recipient);
  let interestSourceList = entity.interestSourceList;

  // Check if the sender has previously sent interest
  let isNewSender = true;
  for (let i: i32 = 0; i < interestSourceList.length; i++) {
    let thisSource = Source.load(interestSourceList[i]);
    if (thisSource !== null && thisSource.id === sender) {
      isNewSender = false;
      return;
    }
  }

  if (isNewSender) {
    // NOTE: Assumes isDistribution === true, since this is a new loan
    let source = new Source(sender);
    source.timeStarted = event.block.timestamp.toString();
    source.interestRateFloor = exchangeRateStored;
    source.redeemableAmount = redeemableAmount;
    source.sInternalAmount = sInternalAmount;
    source.save();
    interestSourceList.push(source.id);
    entity.interestSourceList = interestSourceList;
    entity.save();
  } else {
    // Sender is already present in interestSourceList
    let source = Source.load(sender);
    source.redeemableAmount = redeemableAmount;
    let newSInternal = source.sInternalAmount - sInternalAmount;
    if (isDistribution) {
      let newSInternal = source.sInternalAmount + sInternalAmount;
    }
    source.sInternalAmount = newSInternal;
    source.save();
  }

  // You know how much cDAI you've received from whome
  // You don't know exchange rate between cDAI and rDAI
  // redeemable amount is the amount I need to pay back
  // sInternal is how much I get to keep
  // Can use allocation strategy to get exchange rate
}

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
    entity.interestSourceList = [];
  }

  return entity;
}
