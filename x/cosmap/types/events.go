package types

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
