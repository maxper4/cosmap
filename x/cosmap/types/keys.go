package types

const (
	// ModuleName defines the module name
	ModuleName = "cosmap"

	// StoreKey defines the primary module store key
	StoreKey = ModuleName

	// RouterKey defines the module's message routing key
	RouterKey = ModuleName

	// MemStoreKey defines the in-memory store key
	MemStoreKey = "mem_cosmap"
)

func KeyPrefix(p string) []byte {
	return []byte(p)
}

const (
	SystemInfoKey = "SystemInfo/value/"
)

// Validation of coordinates
const (
	MIN_COORDINATE_X = 0
	MIN_COORDINATE_Y = 0
	MAX_COORDINATE_X = 100
	MAX_COORDINATE_Y = 100
)

// Event Registered Event
const (
	EventRegisteredEventType       = "new-event"   // Indicates what event type to listen to
	EventRegisteredEventCreator    = "creator"     // Subsidiary information
	EventRegisteredEventEventIndex = "event-index" // What game is relevant
	EventRegisteredEventEventType  = "type"        // The event type
)

// Gas costs
const (
	RegisterEventGas = 10000
)
