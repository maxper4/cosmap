import { createProtobufRpcClient, QueryClient } from "@cosmjs/stargate"
import { assert } from "@cosmjs/utils"
import Long from "long"
import {
    QueryAllEventsResponse,
    QueryClientImpl,
    QueryGetEventsResponse,
} from "../../types/generated/cosmap/cosmap/query"
import { Events } from "../../types/generated/cosmap/cosmap/events"
import { SystemInfo } from "../../types/generated/cosmap/cosmap/system_info"
import { PageResponse } from "../../types/generated/cosmos/base/query/v1beta1/pagination"

export interface AllEventsResponse {
    events: Events[]
    pagination?: PageResponse
}

export interface CosmapExtension {
    readonly cosmap: {
        readonly getSystemInfo: () => Promise<SystemInfo>
        readonly getEvent: (index: string) => Promise<Events | undefined>
        readonly getAllEvents: (
            key: Uint8Array,
            offset: Long,
            limit: Long,
            countTotal: boolean,
        ) => Promise<AllEventsResponse>
    }
}

export function setupCosmapExtension(base: QueryClient): CosmapExtension {
    const rpc = createProtobufRpcClient(base)
    // Use this service to get easy typed access to query methods
    // This cannot be used for proof verification
    const queryService = new QueryClientImpl(rpc)

    return {
        cosmap: {
            getSystemInfo: async (): Promise<SystemInfo> => {
                const { SystemInfo } = await queryService.SystemInfo({})
                assert(SystemInfo)
                return SystemInfo
            },
            getEvent: async (index: string): Promise<Events | undefined> => {
                const response: QueryGetEventsResponse = await queryService.Events({
                    index: index,
                })
                return response.events
            },
            getAllEvents: async (
                key: Uint8Array,
                offset: Long,
                limit: Long,
                countTotal: boolean,
            ): Promise<AllEventsResponse> => {
                const response: QueryAllEventsResponse = await queryService.EventsAll({
                    pagination: {
                        key: key,
                        offset: offset,
                        limit: limit,
                        countTotal: countTotal,
                        reverse: false,
                    },
                })
                return {
                    events: response.events,
                    pagination: response.pagination,
                }
            },
        },
    }
}
