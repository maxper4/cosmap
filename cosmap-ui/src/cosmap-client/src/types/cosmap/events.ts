import { Attribute, Event } from "@cosmjs/stargate/build/events"
import { Log } from "@cosmjs/stargate/build/logs"
import { EventTypesEnum } from "../generated/cosmap/cosmap/event_types"

export type EventReportedEvent = Event

export const getReportedEventEvent = (log: Log): EventReportedEvent | undefined =>
    log.events?.find((event: Event) => event.type === "new-event")

export const getReportedEventId = (eventReportedEvent: EventReportedEvent): string =>
eventReportedEvent.attributes.find((attribute: Attribute) => attribute.key == "event-index")!.value

export const eventTypeToString = (eventType: EventTypesEnum): string => {
    switch(eventType) {
        case EventTypesEnum.EVENT_TYPES_ACCIDENT:
            return "Accident"
        case EventTypesEnum.EVENT_TYPES_BOTTLING:
            return "Bottling"
        case EventTypesEnum.EVENT_TYPES_POLICE:
            return "Police"

        case EventTypesEnum.EVENT_TYPES_UNKNOWN:
        default:
            return "Unknown"
    }
}