import { toHex } from "@cosmjs/encoding"
import { OfflineDirectSigner } from "@cosmjs/proto-signing"
import { Account, DeliverTxResponse, GasPrice } from "@cosmjs/stargate"
import { Log } from "@cosmjs/stargate/build/logs"
import { BroadcastTxSyncResponse } from "@cosmjs/tendermint-rpc"
import { expect } from "chai"
import { TxRaw } from "cosmjs-types/cosmos/tx/v1beta1/tx"
import { config } from "dotenv"
import Long from "long"
import _ from "../../environment"
import { CosmapSigningStargateClient } from "../../src/cosmap_signingstargateclient"
import { CosmapStargateClient } from "../../src/cosmap_stargateclient"
import { CosmapExtension } from "../../src/modules/cosmap/queries"
import { typeUrlMsgReportEvent } from "../../src/types/cosmap/messages"
import { Events } from "../../src/types/generated/cosmap/cosmap/events"
import { askFaucet } from "../../src/util/faucet"
import { getSignerFromMnemonic } from "../../src/util/signer"
import { Coordinate } from "../../src/types/generated/cosmap/cosmap/coordinate"
import { EventTypesEnum } from "../../src/types/generated/cosmap/cosmap/event_types"
import { getReportedEventEvent, getReportedEventId } from "../../src/types/cosmap/events"

config()

describe("Events Action", function () {
    const { RPC_URL, ADDRESS_TEST_ALICE: alice, ADDRESS_TEST_BOB: bob } = process.env
    let aliceSigner: OfflineDirectSigner, bobSigner: OfflineDirectSigner
    let aliceClient: CosmapSigningStargateClient,
    bobClient: CosmapSigningStargateClient,
    cosmap: CosmapExtension["cosmap"]
    
    const aliceCredit = {
        stake: 100,
        token: 1,
    },
    bobCredit = {
        stake: 100,
        token: 1,
    }

    before("create signers", async function () {
        aliceSigner = await getSignerFromMnemonic(process.env.MNEMONIC_TEST_ALICE)
        bobSigner = await getSignerFromMnemonic(process.env.MNEMONIC_TEST_BOB)
        expect((await aliceSigner.getAccounts())[0].address).to.equal(alice)
        expect((await bobSigner.getAccounts())[0].address).to.equal(bob)
    })

    before("create signing clients", async function () {
        aliceClient = await CosmapSigningStargateClient.connectWithSigner(RPC_URL, aliceSigner, {
            gasPrice: GasPrice.fromString("0stake"),
        })
        bobClient = await CosmapSigningStargateClient.connectWithSigner(RPC_URL, bobSigner, {
            gasPrice: GasPrice.fromString("0stake"),
        })
        cosmap = aliceClient.cosmapQueryClient!.cosmap
    })

    before("credit test accounts", async function () {
        this.timeout(40_000)
           if (
               parseInt((await aliceClient.getBalance(alice, "stake")).amount, 10) < aliceCredit.stake ||
               parseInt((await aliceClient.getBalance(alice, "token")).amount, 10) < aliceCredit.token
           )
               await askFaucet(alice, aliceCredit)
           expect(parseInt((await aliceClient.getBalance(alice, "stake")).amount, 10)).to.be.greaterThanOrEqual(
               aliceCredit.stake,
           )
           expect(parseInt((await aliceClient.getBalance(alice, "token")).amount, 10)).to.be.greaterThanOrEqual(
               aliceCredit.token,
           )
           if (
               parseInt((await bobClient.getBalance(bob, "stake")).amount, 10) < bobCredit.stake ||
               parseInt((await bobClient.getBalance(bob, "token")).amount, 10) < bobCredit.token
           )
               await askFaucet(bob, bobCredit)
           expect(parseInt((await bobClient.getBalance(bob, "stake")).amount, 10)).to.be.greaterThanOrEqual(
               bobCredit.stake,
           )
           expect(parseInt((await bobClient.getBalance(bob, "token")).amount, 10)).to.be.greaterThanOrEqual(
               bobCredit.token,
           )
   })

   let eventIndex: string

   it("can report an event", async function () {
        this.timeout(10_000)
        const response: DeliverTxResponse = await aliceClient.reportEvent(
            alice,
            { x: Long.fromInt(1, true), y: Long.fromInt(1, true) },
            { eventType: EventTypesEnum.EVENT_TYPES_BOTTLING },
            "auto",
        )

        const logs: Log[] = JSON.parse(response.rawLog!)
        expect(logs).to.be.length(1)
        eventIndex = getReportedEventId(getReportedEventEvent(logs[0])!)
        const event: Events = (await cosmap.getEvent(eventIndex))!
        expect(event).to.include({
                index: eventIndex,
                sender: alice,
        })
        expect(event).to.have.property("event")
        expect(event.event.eventType).to.equal(EventTypesEnum.EVENT_TYPES_BOTTLING)
        expect(event).to.have.property("position")
        expect(event.position.x).to.eql(Long.fromInt(1, true))
        expect(event.position.y).to.eql(Long.fromInt(1, true))
   })
})