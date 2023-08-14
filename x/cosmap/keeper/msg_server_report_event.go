package keeper

import (
	"context"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/maxper4/cosmap/x/cosmap/types"
)

func (k msgServer) ReportEvent(goCtx context.Context, msg *types.MsgReportEvent) (*types.MsgReportEventResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	// TODO: Handling the message
	_ = ctx

	return &types.MsgReportEventResponse{}, nil
}
