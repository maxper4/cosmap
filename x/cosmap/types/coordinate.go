package types

import (
	errorsmod "cosmossdk.io/errors"
)

const MIN_COORDINATE_X = 0
const MIN_COORDINATE_Y = 0
const MAX_COORDINATE_X = 100
const MAX_COORDINATE_Y = 100

var (
	ErrInvalidCoordinateX = errorsmod.Register(ModuleName, 2, "invalid coordinate x")
	ErrInvalidCoordinateY = errorsmod.Register(ModuleName, 3, "invalid coordinate y")
)

func (m *Coordinate) Validate() error {
	if m.X < MIN_COORDINATE_X || m.X > MAX_COORDINATE_X {
		return errorsmod.Wrapf(ErrInvalidCoordinateX, "Invalid coordinate X, it should be %d <= X <= %d, here X is: %d", MIN_COORDINATE_X, MAX_COORDINATE_X, m.X)
	}
	if m.Y < MIN_COORDINATE_Y || m.Y > MAX_COORDINATE_Y {
		return errorsmod.Wrapf(ErrInvalidCoordinateY, "Invalid coordinate Y, it should be %d <= Y <= %d, here Y is: %d", MIN_COORDINATE_Y, MAX_COORDINATE_Y, m.Y)
	}

	return nil
}
