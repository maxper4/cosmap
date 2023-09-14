/* eslint-disable */
import Long from "long";
import _m0 from "protobufjs/minimal";

export const protobufPackage = "cosmap.cosmap";

export enum EventTypesEnum {
  EVENT_TYPES_UNKNOWN = 0,
  EVENT_TYPES_BOTTLING = 1,
  EVENT_TYPES_ACCIDENT = 2,
  EVENT_TYPES_POLICE = 3,
  UNRECOGNIZED = -1,
}

export function eventTypesEnumFromJSON(object: any): EventTypesEnum {
  switch (object) {
    case 0:
    case "EVENT_TYPES_UNKNOWN":
      return EventTypesEnum.EVENT_TYPES_UNKNOWN;
    case 1:
    case "EVENT_TYPES_BOTTLING":
      return EventTypesEnum.EVENT_TYPES_BOTTLING;
    case 2:
    case "EVENT_TYPES_ACCIDENT":
      return EventTypesEnum.EVENT_TYPES_ACCIDENT;
    case 3:
    case "EVENT_TYPES_POLICE":
      return EventTypesEnum.EVENT_TYPES_POLICE;
    case -1:
    case "UNRECOGNIZED":
    default:
      return EventTypesEnum.UNRECOGNIZED;
  }
}

export function eventTypesEnumToJSON(object: EventTypesEnum): string {
  switch (object) {
    case EventTypesEnum.EVENT_TYPES_UNKNOWN:
      return "EVENT_TYPES_UNKNOWN";
    case EventTypesEnum.EVENT_TYPES_BOTTLING:
      return "EVENT_TYPES_BOTTLING";
    case EventTypesEnum.EVENT_TYPES_ACCIDENT:
      return "EVENT_TYPES_ACCIDENT";
    case EventTypesEnum.EVENT_TYPES_POLICE:
      return "EVENT_TYPES_POLICE";
    case EventTypesEnum.UNRECOGNIZED:
    default:
      return "UNRECOGNIZED";
  }
}

export interface EventTypes {
  eventType: EventTypesEnum;
}

function createBaseEventTypes(): EventTypes {
  return { eventType: 0 };
}

export const EventTypes = {
  encode(
    message: EventTypes,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.eventType !== 0) {
      writer.uint32(8).int32(message.eventType);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): EventTypes {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseEventTypes();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.eventType = reader.int32() as any;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): EventTypes {
    return {
      eventType: isSet(object.eventType)
        ? eventTypesEnumFromJSON(object.eventType)
        : 0,
    };
  },

  toJSON(message: EventTypes): unknown {
    const obj: any = {};
    message.eventType !== undefined &&
      (obj.eventType = eventTypesEnumToJSON(message.eventType));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<EventTypes>, I>>(
    object: I
  ): EventTypes {
    const message = createBaseEventTypes();
    message.eventType = object.eventType ?? 0;
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
