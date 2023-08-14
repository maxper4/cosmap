package keeper_test

import (
	"strconv"
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/query"
	"github.com/stretchr/testify/require"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	keepertest "github.com/maxper4/cosmap/testutil/keeper"
	"github.com/maxper4/cosmap/testutil/nullify"
	"github.com/maxper4/cosmap/x/cosmap/types"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func TestEventsQuerySingle(t *testing.T) {
	keeper, ctx := keepertest.CosmapKeeper(t)
	wctx := sdk.WrapSDKContext(ctx)
	msgs := createNEvents(keeper, ctx, 2)
	tests := []struct {
		desc     string
		request  *types.QueryGetEventsRequest
		response *types.QueryGetEventsResponse
		err      error
	}{
		{
			desc: "First",
			request: &types.QueryGetEventsRequest{
				Index: msgs[0].Index,
			},
			response: &types.QueryGetEventsResponse{Events: msgs[0]},
		},
		{
			desc: "Second",
			request: &types.QueryGetEventsRequest{
				Index: msgs[1].Index,
			},
			response: &types.QueryGetEventsResponse{Events: msgs[1]},
		},
		{
			desc: "KeyNotFound",
			request: &types.QueryGetEventsRequest{
				Index: strconv.Itoa(100000),
			},
			err: status.Error(codes.NotFound, "not found"),
		},
		{
			desc: "InvalidRequest",
			err:  status.Error(codes.InvalidArgument, "invalid request"),
		},
	}
	for _, tc := range tests {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := keeper.Events(wctx, tc.request)
			if tc.err != nil {
				require.ErrorIs(t, err, tc.err)
			} else {
				require.NoError(t, err)
				require.Equal(t,
					nullify.Fill(tc.response),
					nullify.Fill(response),
				)
			}
		})
	}
}

func TestEventsQueryPaginated(t *testing.T) {
	keeper, ctx := keepertest.CosmapKeeper(t)
	wctx := sdk.WrapSDKContext(ctx)
	msgs := createNEvents(keeper, ctx, 5)

	request := func(next []byte, offset, limit uint64, total bool) *types.QueryAllEventsRequest {
		return &types.QueryAllEventsRequest{
			Pagination: &query.PageRequest{
				Key:        next,
				Offset:     offset,
				Limit:      limit,
				CountTotal: total,
			},
		}
	}
	t.Run("ByOffset", func(t *testing.T) {
		step := 2
		for i := 0; i < len(msgs); i += step {
			resp, err := keeper.EventsAll(wctx, request(nil, uint64(i), uint64(step), false))
			require.NoError(t, err)
			require.LessOrEqual(t, len(resp.Events), step)
			require.Subset(t,
				nullify.Fill(msgs),
				nullify.Fill(resp.Events),
			)
		}
	})
	t.Run("ByKey", func(t *testing.T) {
		step := 2
		var next []byte
		for i := 0; i < len(msgs); i += step {
			resp, err := keeper.EventsAll(wctx, request(next, 0, uint64(step), false))
			require.NoError(t, err)
			require.LessOrEqual(t, len(resp.Events), step)
			require.Subset(t,
				nullify.Fill(msgs),
				nullify.Fill(resp.Events),
			)
			next = resp.Pagination.NextKey
		}
	})
	t.Run("Total", func(t *testing.T) {
		resp, err := keeper.EventsAll(wctx, request(nil, 0, 0, true))
		require.NoError(t, err)
		require.Equal(t, len(msgs), int(resp.Pagination.Total))
		require.ElementsMatch(t,
			nullify.Fill(msgs),
			nullify.Fill(resp.Events),
		)
	})
	t.Run("InvalidRequest", func(t *testing.T) {
		_, err := keeper.EventsAll(wctx, nil)
		require.ErrorIs(t, err, status.Error(codes.InvalidArgument, "invalid request"))
	})
}
