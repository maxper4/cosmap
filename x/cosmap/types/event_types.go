package types

import (
	errorsmod "cosmossdk.io/errors"
)

var (
	ErrNoEventType = errorsmod.Register(ModuleName, 7, "No event type provided")
)

func (t *EventTypes) Validate() error {
	if int(t.EventType) >= len(EventTypesEnum_name) {
		return errorsmod.Wrapf(ErrNoEventType, "Invalid event type")
	}

	return nil
}
