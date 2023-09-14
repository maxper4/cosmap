import { EncodeObject, GeneratedType } from "@cosmjs/proto-signing"
import {
    MsgReportEvent,
    MsgReportEventResponse,
} from "../generated/cosmap/cosmap/tx"


export const typeUrlMsgReportEvent = "/cosmap.cosmap.MsgReportEvent"
export const typeUrlMsgReportEventResponse = "/cosmap.cosmap.MsgReportEventResponse"

export const cosmapTypes: ReadonlyArray<[string, GeneratedType]> = [
    [typeUrlMsgReportEvent, MsgReportEvent],
    [typeUrlMsgReportEventResponse, MsgReportEventResponse],
]

export interface MsgReportEventEncodeObject extends EncodeObject {
    readonly typeUrl: string
    readonly value: Partial<MsgReportEvent>
}

export function isMsgReportEventEncodeObject(
    encodeObject: EncodeObject,
): encodeObject is MsgReportEventEncodeObject {
    return (
        (encodeObject as MsgReportEventEncodeObject).typeUrl === typeUrlMsgReportEvent
    )
}

export interface MsgReportEventResponseEncodeObject extends EncodeObject {
    readonly typeUrl: string
    readonly value: Partial<MsgReportEventResponse>
}

export function isMsgReportEventResponseEncodeObject(
    encodeObject: EncodeObject,
): encodeObject is MsgReportEventResponseEncodeObject {
    return (
        (encodeObject as MsgReportEventResponseEncodeObject).typeUrl === typeUrlMsgReportEventResponse
    )
}