package keeper

import (
	"context"

	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/query"
	"github.com/maxper4/cosmap/x/cosmap/types"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"
)

func (k Keeper) EventsAll(goCtx context.Context, req *types.QueryAllEventsRequest) (*types.QueryAllEventsResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}

	var eventss []types.Events
	ctx := sdk.UnwrapSDKContext(goCtx)

	store := ctx.KVStore(k.storeKey)
	eventsStore := prefix.NewStore(store, types.KeyPrefix(types.EventsKeyPrefix))

	pageRes, err := query.Paginate(eventsStore, req.Pagination, func(key []byte, value []byte) error {
		var events types.Events
		if err := k.cdc.Unmarshal(value, &events); err != nil {
			return err
		}

		eventss = append(eventss, events)
		return nil
	})

	if err != nil {
		return nil, status.Error(codes.Internal, err.Error())
	}

	return &types.QueryAllEventsResponse{Events: eventss, Pagination: pageRes}, nil
}

func (k Keeper) Events(goCtx context.Context, req *types.QueryGetEventsRequest) (*types.QueryGetEventsResponse, error) {
	if req == nil {
		return nil, status.Error(codes.InvalidArgument, "invalid request")
	}
	ctx := sdk.UnwrapSDKContext(goCtx)

	val, found := k.GetEvents(
		ctx,
		req.Index,
	)
	if !found {
		return nil, status.Error(codes.NotFound, "not found")
	}

	return &types.QueryGetEventsResponse{Events: val}, nil
}
