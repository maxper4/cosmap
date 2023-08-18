package types

import (
	errorsmod "cosmossdk.io/errors"
)

func (t *EventTypes) Validate() error {
	if int(t.EventType) >= len(EventTypesEnum_name) {
		return errorsmod.Wrapf(ErrNoEventType, "Invalid event type")
	}

	return nil
}
