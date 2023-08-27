/* eslint-disable */
import { Coordinate } from "./coordinate";
import { EventTypes } from "./event_types";
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "cosmap.cosmap";

export interface Events {
  index: string;
  position?: Coordinate;
  sender: string;
  event?: EventTypes;
  timestamp: Long;
}

function createBaseEvents(): Events {
  return {
    index: "",
    position: undefined,
    sender: "",
    event: undefined,
    timestamp: Long.UZERO,
  };
}

export const Events = {
  encode(
    message: Events,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.index !== "") {
      writer.uint32(10).string(message.index);
    }
    if (message.position !== undefined) {
      Coordinate.encode(message.position, writer.uint32(18).fork()).ldelim();
    }
    if (message.sender !== "") {
      writer.uint32(26).string(message.sender);
    }
    if (message.event !== undefined) {
      EventTypes.encode(message.event, writer.uint32(34).fork()).ldelim();
    }
    if (!message.timestamp.isZero()) {
      writer.uint32(40).uint64(message.timestamp);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): Events {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEvents();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.index = reader.string();
          break;
        case 2:
          message.position = Coordinate.decode(reader, reader.uint32());
          break;
        case 3:
          message.sender = reader.string();
          break;
        case 4:
          message.event = EventTypes.decode(reader, reader.uint32());
          break;
        case 5:
          message.timestamp = reader.uint64() as Long;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): Events {
    return {
      index: isSet(object.index) ? String(object.index) : "",
      position: isSet(object.position)
        ? Coordinate.fromJSON(object.position)
        : undefined,
      sender: isSet(object.sender) ? String(object.sender) : "",
      event: isSet(object.event)
        ? EventTypes.fromJSON(object.event)
        : undefined,
      timestamp: isSet(object.timestamp)
        ? Long.fromValue(object.timestamp)
        : Long.UZERO,
    };
  },

  toJSON(message: Events): unknown {
    const obj: any = {};
    message.index !== undefined && (obj.index = message.index);
    message.position !== undefined &&
      (obj.position = message.position
        ? Coordinate.toJSON(message.position)
        : undefined);
    message.sender !== undefined && (obj.sender = message.sender);
    message.event !== undefined &&
      (obj.event = message.event
        ? EventTypes.toJSON(message.event)
        : undefined);
    message.timestamp !== undefined &&
      (obj.timestamp = (message.timestamp || Long.UZERO).toString());
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<Events>, I>>(object: I): Events {
    const message = createBaseEvents();
    message.index = object.index ?? "";
    message.position =
      object.position !== undefined && object.position !== null
        ? Coordinate.fromPartial(object.position)
        : undefined;
    message.sender = object.sender ?? "";
    message.event =
      object.event !== undefined && object.event !== null
        ? EventTypes.fromPartial(object.event)
        : undefined;
    message.timestamp =
      object.timestamp !== undefined && object.timestamp !== null
        ? Long.fromValue(object.timestamp)
        : Long.UZERO;
    return message;
  },
};

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
