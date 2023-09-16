import { QueryClient, StargateClient, StargateClientOptions } from "@cosmjs/stargate"
import { Tendermint37Client } from "@cosmjs/tendermint-rpc"
import { CosmapExtension, setupCosmapExtension } from "./modules/cosmap/queries"
import { Events } from "./types/generated/cosmap/cosmap/events"
import Long from "long"

export class CosmapStargateClient extends StargateClient {
    public readonly cosmapQueryClient: CosmapExtension | undefined

    public static async connect(
        endpoint: string,
        options?: StargateClientOptions,
    ): Promise<CosmapStargateClient> {
        const tmClient = await Tendermint37Client.connect(endpoint)
        return new CosmapStargateClient(tmClient, options)
    }

    protected constructor(tmClient: Tendermint37Client | undefined, options: StargateClientOptions = {}) {
        super(tmClient, options)
        if (tmClient) {
            this.cosmapQueryClient = QueryClient.withExtensions(tmClient, setupCosmapExtension)
        }
    }

    public async getAllEvents():Promise<Events[]> {
        return ( 
            await this.cosmapQueryClient!.cosmap.getAllEvents(
                Uint8Array.from([]),
                Long.ZERO,
                Long.fromNumber(20),
                true,
            )
        ).events
    }

    public async getEventById(id: string):Promise<Events|undefined> {
        return ( 
            await this.cosmapQueryClient!.cosmap.getEvent(
                id,
            )
        )
    }
}
