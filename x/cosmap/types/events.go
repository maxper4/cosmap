package types

import (
	errorsmod "cosmossdk.io/errors"
)

var (
	ErrNoCoordinate = errorsmod.Register(ModuleName, 4, "No coordinate provided")
	ErrNoEvent      = errorsmod.Register(ModuleName, 5, "No event provided")
	ErrNoSender     = errorsmod.Register(ModuleName, 6, "No sender provided")
	ErrNoTimestamp  = errorsmod.Register(ModuleName, 7, "No timestamp provided")
)

func (e *Events) Validate() error {
	if e.Position == nil {
		return ErrNoCoordinate
	}
	if e.Event == nil {
		return ErrNoEvent
	}
	if e.Sender == "" {
		return ErrNoSender
	}
	if e.Timestamp == 0 {
		return ErrNoTimestamp
	}

	err := e.Position.Validate()
	if err != nil {
		return err
	}
	err = e.Event.Validate()
	if err != nil {
		return err
	}

	return nil
}
