import { QueryClient, StargateClient, StargateClientOptions } from "@cosmjs/stargate"
import { Tendermint34Client } from "@cosmjs/tendermint-rpc"
import { CosmapExtension, setupCosmapExtension } from "./modules/cosmap/queries"

export class CosmapStargateClient extends StargateClient {
    public readonly cosmapQueryClient: CosmapExtension | undefined

    public static async connect(
        endpoint: string,
        options?: StargateClientOptions,
    ): Promise<CosmapStargateClient> {
        const tmClient = await Tendermint34Client.connect(endpoint)
        return new CosmapStargateClient(tmClient, options)
    }

    protected constructor(tmClient: Tendermint34Client | undefined, options: StargateClientOptions = {}) {
        super(tmClient, options)
        if (tmClient) {
            this.cosmapQueryClient = QueryClient.withExtensions(tmClient, setupCosmapExtension)
        }
    }
}
