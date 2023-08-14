package types

import (
	"testing"

	sdkerrors "github.com/cosmos/cosmos-sdk/types/errors"
	"github.com/maxper4/cosmap/testutil/sample"
	"github.com/stretchr/testify/require"
)

func TestMsgReportEvent_ValidateBasic(t *testing.T) {
	tests := []struct {
		name string
		msg  MsgReportEvent
		err  error
	}{
		{
			name: "invalid address",
			msg: MsgReportEvent{
				Creator: "invalid_address",
			},
			err: sdkerrors.ErrInvalidAddress,
		}, {
			name: "valid address",
			msg: MsgReportEvent{
				Creator: sample.AccAddress(),
			},
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			err := tt.msg.ValidateBasic()
			if tt.err != nil {
				require.ErrorIs(t, err, tt.err)
				return
			}
			require.NoError(t, err)
		})
	}
}
