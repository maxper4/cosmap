package types

// DONTCOVER

import (
	errorsmod "cosmossdk.io/errors"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

// x/cosmap module sentinel errors
var (
	ErrSample = sdkerrors.Register(ModuleName, 1100, "sample error")
)

var (
	ErrInvalidCoordinateX = errorsmod.Register(ModuleName, 2, "invalid coordinate x")
	ErrInvalidCoordinateY = errorsmod.Register(ModuleName, 3, "invalid coordinate y")
	ErrNoCoordinate       = errorsmod.Register(ModuleName, 4, "No coordinate provided")
	ErrNoEvent            = errorsmod.Register(ModuleName, 5, "No event provided")
	ErrNoSender           = errorsmod.Register(ModuleName, 6, "No sender provided")
	ErrNoTimestamp        = errorsmod.Register(ModuleName, 7, "No timestamp provided")
	ErrNoEventType        = errorsmod.Register(ModuleName, 8, "No event type provided")
)
