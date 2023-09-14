/* eslint-disable */
import { Coordinate } from "./coordinate";
import { EventTypes } from "./event_types";
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "cosmap.cosmap";

export interface MsgReportEvent {
  creator: string;
  position?: Coordinate;
  event?: EventTypes;
}

export interface MsgReportEventResponse {
  eventId: string;
}

function createBaseMsgReportEvent(): MsgReportEvent {
  return { creator: "", position: undefined, event: undefined };
}

export const MsgReportEvent = {
  encode(
    message: MsgReportEvent,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.creator !== "") {
      writer.uint32(10).string(message.creator);
    }
    if (message.position !== undefined) {
      Coordinate.encode(message.position, writer.uint32(18).fork()).ldelim();
    }
    if (message.event !== undefined) {
      EventTypes.encode(message.event, writer.uint32(26).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): MsgReportEvent {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgReportEvent();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.creator = reader.string();
          break;
        case 2:
          message.position = Coordinate.decode(reader, reader.uint32());
          break;
        case 3:
          message.event = EventTypes.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgReportEvent {
    return {
      creator: isSet(object.creator) ? String(object.creator) : "",
      position: isSet(object.position)
        ? Coordinate.fromJSON(object.position)
        : undefined,
      event: isSet(object.event)
        ? EventTypes.fromJSON(object.event)
        : undefined,
    };
  },

  toJSON(message: MsgReportEvent): unknown {
    const obj: any = {};
    message.creator !== undefined && (obj.creator = message.creator);
    message.position !== undefined &&
      (obj.position = message.position
        ? Coordinate.toJSON(message.position)
        : undefined);
    message.event !== undefined &&
      (obj.event = message.event
        ? EventTypes.toJSON(message.event)
        : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgReportEvent>, I>>(
    object: I
  ): MsgReportEvent {
    const message = createBaseMsgReportEvent();
    message.creator = object.creator ?? "";
    message.position =
      object.position !== undefined && object.position !== null
        ? Coordinate.fromPartial(object.position)
        : undefined;
    message.event =
      object.event !== undefined && object.event !== null
        ? EventTypes.fromPartial(object.event)
        : undefined;
    return message;
  },
};

function createBaseMsgReportEventResponse(): MsgReportEventResponse {
  return { eventId: "" };
}

export const MsgReportEventResponse = {
  encode(
    message: MsgReportEventResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.eventId !== "") {
      writer.uint32(10).string(message.eventId);
    }
    return writer;
  },

  decode(
    input: _m0.Reader | Uint8Array,
    length?: number
  ): MsgReportEventResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseMsgReportEventResponse();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.eventId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): MsgReportEventResponse {
    return {
      eventId: isSet(object.eventId) ? String(object.eventId) : "",
    };
  },

  toJSON(message: MsgReportEventResponse): unknown {
    const obj: any = {};
    message.eventId !== undefined && (obj.eventId = message.eventId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<MsgReportEventResponse>, I>>(
    object: I
  ): MsgReportEventResponse {
    const message = createBaseMsgReportEventResponse();
    message.eventId = object.eventId ?? "";
    return message;
  },
};

/** Msg defines the Msg service. */
export interface Msg {
  ReportEvent(request: MsgReportEvent): Promise<MsgReportEventResponse>;
}

export class MsgClientImpl implements Msg {
  private readonly rpc: Rpc;
  constructor(rpc: Rpc) {
    this.rpc = rpc;
    this.ReportEvent = this.ReportEvent.bind(this);
  }
  ReportEvent(request: MsgReportEvent): Promise<MsgReportEventResponse> {
    const data = MsgReportEvent.encode(request).finish();
    const promise = this.rpc.request("cosmap.cosmap.Msg", "ReportEvent", data);
    return promise.then((data) =>
      MsgReportEventResponse.decode(new _m0.Reader(data))
    );
  }
}

interface Rpc {
  request(
    service: string,
    method: string,
    data: Uint8Array
  ): Promise<Uint8Array>;
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

export type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Long
  ? string | number | Long
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & {
      [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
    };

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
