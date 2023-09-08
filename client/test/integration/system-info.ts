import { expect } from "chai"
import { config } from "dotenv"
import _ from "../../environment"
import { CosmapStargateClient } from "../../src/cosmap_stargateclient"
import { CosmapExtension } from "../../src/modules/cosmap/queries"

config()

describe("SystemInfo", function () {
    let client: CosmapStargateClient, cosmap: CosmapExtension["cosmap"]

    before("create client", async function () {
        client = await CosmapStargateClient.connect(process.env.RPC_URL)
        cosmap = client.cosmapQueryClient!.cosmap
    })

    it("can get system info", async function () {
        const systemInfo = await cosmap.getSystemInfo()
        expect(systemInfo.nextId.toNumber()).to.be.greaterThanOrEqual(1)
    })
})
