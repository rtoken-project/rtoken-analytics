import { BigInt } from "@graphprotocol/graph-ts"
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
} from "../generated/Contract/Contract"
import { ExampleEntity } from "../generated/schema"

export function handleAllocationStrategyChanged(
  event: AllocationStrategyChanged
): void {
  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = ExampleEntity.load(event.transaction.from.toHex())

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (entity == null) {
    entity = new ExampleEntity(event.transaction.from.toHex())

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.strategy = event.params.strategy
  entity.conversionRate = event.params.conversionRate

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.ALLOCATION_STRATEGY_EXCHANGE_RATE_SCALE(...)
  // - contract.INITIAL_SAVING_ASSET_CONVERSION_RATE(...)
  // - contract.MAX_NUM_HAT_RECIPIENTS(...)
  // - contract.MAX_UINT256(...)
  // - contract.PROPORTION_BASE(...)
  // - contract.SELF_HAT_ID(...)
  // - contract._guardCounter(...)
  // - contract._owner(...)
  // - contract.accountStats(...)
  // - contract.accounts(...)
  // - contract.allowance(...)
  // - contract.approve(...)
  // - contract.balanceOf(...)
  // - contract.changeHat(...)
  // - contract.createHat(...)
  // - contract.decimals(...)
  // - contract.getAccountStats(...)
  // - contract.getCurrentAllocationStrategy(...)
  // - contract.getCurrentSavingStrategy(...)
  // - contract.getGlobalStats(...)
  // - contract.getHatByAddress(...)
  // - contract.getHatByID(...)
  // - contract.getHatStats(...)
  // - contract.getMaximumHatID(...)
  // - contract.getSavingAssetBalance(...)
  // - contract.hatStats(...)
  // - contract.ias(...)
  // - contract.initialized(...)
  // - contract.interestPayableOf(...)
  // - contract.isOwner(...)
  // - contract.mint(...)
  // - contract.mintWithNewHat(...)
  // - contract.mintWithSelectedHat(...)
  // - contract.name(...)
  // - contract.owner(...)
  // - contract.payInterest(...)
  // - contract.proxiableUUID(...)
  // - contract.receivedLoanOf(...)
  // - contract.receivedSavingsOf(...)
  // - contract.redeem(...)
  // - contract.redeemAll(...)
  // - contract.redeemAndTransfer(...)
  // - contract.redeemAndTransferAll(...)
  // - contract.savingAssetConversionRate(...)
  // - contract.savingAssetOrignalAmount(...)
  // - contract.symbol(...)
  // - contract.token(...)
  // - contract.totalSupply(...)
  // - contract.transfer(...)
  // - contract.transferAll(...)
  // - contract.transferAllFrom(...)
  // - contract.transferAllowances(...)
  // - contract.transferFrom(...)
}

export function handleApproval(event: Approval): void {}

export function handleCodeUpdated(event: CodeUpdated): void {}

export function handleHatChanged(event: HatChanged): void {}

export function handleHatCreated(event: HatCreated): void {}

export function handleInterestPaid(event: InterestPaid): void {}

export function handleLoansTransferred(event: LoansTransferred): void {}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleTransfer(event: Transfer): void {}
