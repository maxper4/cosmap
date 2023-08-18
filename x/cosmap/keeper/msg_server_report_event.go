package keeper

import (
	"context"
	"strconv"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/maxper4/cosmap/x/cosmap/types"
)

func (k msgServer) ReportEvent(goCtx context.Context, msg *types.MsgReportEvent) (*types.MsgReportEventResponse, error) {
	ctx := sdk.UnwrapSDKContext(goCtx)

	systemInfo, found := k.Keeper.GetSystemInfo(ctx)
	if !found {
		panic("SystemInfo not found")
	}
	newIndex := strconv.FormatUint(systemInfo.NextId, 10)

	newEvent := types.Events{
		Index:     newIndex,
		Position:  msg.Position,
		Sender:    msg.Creator,
		Event:     msg.Event,
		Timestamp: 0, // TODO: Set timestamp
	}

	err := newEvent.Validate()
	if err != nil {
		return nil, err
	}

	k.SetEvents(ctx, newEvent)

	systemInfo.NextId++
	k.SetSystemInfo(ctx, systemInfo)

	return &types.MsgReportEventResponse{EventId: newIndex}, nil
}
