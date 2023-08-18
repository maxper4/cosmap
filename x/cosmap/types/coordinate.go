package types

import (
	errorsmod "cosmossdk.io/errors"
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
