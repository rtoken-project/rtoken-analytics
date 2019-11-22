### General

Call handlers can subscribe to functions rather than events, but not available on Rinkeby or Ganache (due to lack of Parity tracing API)

### Commands

test if the mapping is correct with

`yarn build`

Generate the output with

`yarn codegen`

/ It is also possible to access smart contracts from mappings. For
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
// - contract.\_guardCounter(...)
// - contract.\_owner(...)
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

## Discussion on loan tracking with Miao

Question: How much interest (rDAI/DAI, what if it is cDAI) Alice has earned thanks to Bob?

Bob mints 10 rDAI, Alice is one recipient

LoanTransfered(bob → alice, isDistribution = true, 10 DAI, 100 cDAI (10 DAI))

Alice’s account info: 10 rDAI, 100 cDAI (worths 10 DAI)

100 cDAI = 100 cDAI (owed to Bob effectively) + 0 cDAI (owned by Alice fully)

.... eons later ...

Alice’s account info: 10 rDAI, 100 cDAI (worths 11 DAI)

100 cDAI = 91 cDAI (owed to Bob effectively) + 9 cDAI (owned by Alice fully)

… more eons later ...

100 cDAI = 1 cDAI (owed to Bob effectively) + 99 cDAI (owned by Alice fully)

--- Alice earned 1 rDAI from Bob's contribution

Bob redeems 5 rDAI

LoanTransfered(bob ← alice, isDistribution = false, 5 DAI, 45 cDAI );

-5 DAI -45 cDAI

Alice’s account info: 5 rDAI, 55 cDAI (worths 6 DAI)

--- Alice earned (6-5) = 1 rDAI from Bob’s contribution

Bob redeems 10 rDAI

LoanTransfered(bob ← alice, isDistribution = false, 10 DAI, 91 cDAI );

-10 DAI -91 cDAI

Alice’s account info: 0 rDAI, 9 cDAI (worths 1 DAI)

---

From this moment forward, Bob’s contribution to Alice is no longer calculated.

Bob transfers 10 rDAI to Jack, who doesn’t contribute to Alice

LoanTransfered(bob ← alice, isDistribution = false, 10 DAI, 91 cDAI );
LoanTransfered(bob → jack, isDistribution = true, 10 DAI, 91 cDAI );

Alice pays all interest

Alice’s account info: 1 rDAI, 9 cDAI (worths 1 DAI)

Alice redeems all

Alice’s account info: 0 rDAI, 0 cDAI
