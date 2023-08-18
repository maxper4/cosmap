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
		Timestamp: uint64(ctx.BlockTime().Unix()),
	}

	err := newEvent.Validate()
	if err != nil {
		return nil, err
	}

	k.SetEvents(ctx, newEvent)

	systemInfo.NextId++
	k.SetSystemInfo(ctx, systemInfo)

	ctx.GasMeter().ConsumeGas(types.RegisterEventGas, "Register an event")

	ctx.EventManager().EmitEvent(
		sdk.NewEvent(types.EventRegisteredEventType,
			sdk.NewAttribute(types.EventRegisteredEventCreator, msg.Creator),
			sdk.NewAttribute(types.EventRegisteredEventEventIndex, newIndex),
			sdk.NewAttribute(types.EventRegisteredEventEventType, msg.Event.EventType.String()),
		),
	)

	return &types.MsgReportEventResponse{EventId: newIndex}, nil
}
