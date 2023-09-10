import { Attribute, Event } from "@cosmjs/stargate/build/events"
import { Log } from "@cosmjs/stargate/build/logs"

export type EventReportedEvent = Event

export const getReportedEventEvent = (log: Log): EventReportedEvent | undefined =>
    log.events?.find((event: Event) => event.type === "new-event")

export const getReportedEventId = (eventReportedEvent: EventReportedEvent): string =>
eventReportedEvent.attributes.find((attribute: Attribute) => attribute.key == "event-index")!.value