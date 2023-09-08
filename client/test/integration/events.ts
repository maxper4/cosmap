import { expect } from "chai"
import { config } from "dotenv"
import Long from "long"
import _ from "../../environment"
import { CosmapStargateClient } from "../../src/cosmap_stargateclient"
import { CosmapExtension } from "../../src/modules/cosmap/queries"

config()

describe("Events", function () {
    let client: CosmapStargateClient, cosmap: CosmapExtension["cosmap"]

    before("create client", async function () {
        client = await CosmapStargateClient.connect(process.env.RPC_URL)
        cosmap = client.cosmapQueryClient!.cosmap
    })

    it("can get game list", async function () {
        const allGames = await cosmap.getAllEvents(
            Uint8Array.of(),
            Long.fromInt(0),
            Long.fromInt(0),
            true,
        )
        expect(allGames.events).to.be.length.greaterThanOrEqual(0)
    })

    it("cannot get non-existent game", async function () {
        try {
            await cosmap.getEvent("no-id")
            expect.fail("It should have failed")
        } catch (error) {
            expect(error.toString()).to.equal(
                "Error: Query failed with (22): rpc error: code = NotFound desc = not found: key not found",
            )
        }
    })
})