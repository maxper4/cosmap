package types

import (
	sdk "github.com/cosmos/cosmos-sdk/types"
	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
)

const TypeMsgReportEvent = "report_event"

var _ sdk.Msg = &MsgReportEvent{}

func NewMsgReportEvent(creator string, position *Coordinate, event *EventTypes) *MsgReportEvent {
	return &MsgReportEvent{
		Creator:  creator,
		Position: position,
		Event:    event,
	}
}

func (msg *MsgReportEvent) Route() string {
	return RouterKey
}

func (msg *MsgReportEvent) Type() string {
	return TypeMsgReportEvent
}

func (msg *MsgReportEvent) GetSigners() []sdk.AccAddress {
	creator, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		panic(err)
	}
	return []sdk.AccAddress{creator}
}

func (msg *MsgReportEvent) GetSignBytes() []byte {
	bz := ModuleCdc.MustMarshalJSON(msg)
	return sdk.MustSortJSON(bz)
}

func (msg *MsgReportEvent) ValidateBasic() error {
	_, err := sdk.AccAddressFromBech32(msg.Creator)
	if err != nil {
		return sdkerrors.Wrapf(sdkerrors.ErrInvalidAddress, "invalid creator address (%s)", err)
	}
	return nil
}
