package types

import "encoding/binary"

var _ binary.ByteOrder

const (
	// EventsKeyPrefix is the prefix to retrieve all Events
	EventsKeyPrefix = "Events/value/"
)

// EventsKey returns the store key to retrieve a Events from the index fields
func EventsKey(
	index string,
) []byte {
	var key []byte

	indexBytes := []byte(index)
	key = append(key, indexBytes...)
	key = append(key, []byte("/")...)

	return key
}
