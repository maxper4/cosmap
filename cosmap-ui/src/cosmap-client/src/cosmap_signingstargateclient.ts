import { GeneratedType, OfflineSigner, Registry } from "@cosmjs/proto-signing"
import {
    defaultRegistryTypes,
    DeliverTxResponse,
    QueryClient,
    SigningStargateClient,
    SigningStargateClientOptions,
    StdFee,
} from "@cosmjs/stargate"
import { Tendermint37Client } from "@cosmjs/tendermint-rpc"
import Long from "long"
import { CosmapExtension, setupCosmapExtension } from "./modules/cosmap/queries"
import {
    cosmapTypes,
    MsgReportEventEncodeObject,
    typeUrlMsgReportEvent,
} from "./types/cosmap/messages"
import { Coordinate } from "./types/generated/cosmap/cosmap/coordinate"
import { EventTypes } from "./types/generated/cosmap/cosmap/event_types"
import { Log } from "@cosmjs/stargate/build/logs"
import { getReportedEventEvent, getReportedEventId } from "./types/cosmap/events"

export const cosmapDefaultRegistryTypes: ReadonlyArray<[string, GeneratedType]> = [
    ...defaultRegistryTypes,
    ...cosmapTypes,
]

function createDefaultRegistry(): Registry {
    return new Registry(cosmapDefaultRegistryTypes)
}

export class CosmapSigningStargateClient extends SigningStargateClient {
    public readonly cosmapQueryClient: CosmapExtension | undefined

    public static async connectWithSigner(
        endpoint: string,
        signer: OfflineSigner,
        options: SigningStargateClientOptions = {},
    ): Promise<CosmapSigningStargateClient> {
        const tmClient = await Tendermint37Client.connect(endpoint)
        return new CosmapSigningStargateClient(tmClient, signer, {
            registry: createDefaultRegistry(),
            ...options,
        })
    }

    protected constructor(
        tmClient: Tendermint37Client | undefined,
        signer: OfflineSigner,
        options: SigningStargateClientOptions,
    ) {
        super(tmClient, signer, options)
        if (tmClient) {
            this.cosmapQueryClient = QueryClient.withExtensions(tmClient, setupCosmapExtension)
        }
    }

    public async reportEvent(
        creator: string,
        position: Coordinate,
        event: EventTypes,
        fee: StdFee | "auto" | number,
        memo = "",
    ): Promise<string> {
        const reportMsg: MsgReportEventEncodeObject = {
            typeUrl: typeUrlMsgReportEvent,
            value: {
                creator: creator,
                position: position,
                event: event,
            },
        }
        const res = await this.signAndBroadcast(creator, [reportMsg], fee, memo)
        const logs: Log[] = JSON.parse(res.rawLog!)
        return getReportedEventId(getReportedEventEvent(logs[0])!)
    }
}
