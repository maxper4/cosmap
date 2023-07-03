package keeper_test

import (
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/stretchr/testify/require"
	"google.golang.org/grpc/codes"
	"google.golang.org/grpc/status"

	keepertest "github.com/maxper4/cosmap/testutil/keeper"
	"github.com/maxper4/cosmap/testutil/nullify"
	"github.com/maxper4/cosmap/x/cosmap/types"
)

func TestSystemInfoQuery(t *testing.T) {
	keeper, ctx := keepertest.CosmapKeeper(t)
	wctx := sdk.WrapSDKContext(ctx)
	item := createTestSystemInfo(keeper, ctx)
	tests := []struct {
		desc     string
		request  *types.QueryGetSystemInfoRequest
		response *types.QueryGetSystemInfoResponse
		err      error
	}{
		{
			desc:     "First",
			request:  &types.QueryGetSystemInfoRequest{},
			response: &types.QueryGetSystemInfoResponse{SystemInfo: item},
		},
		{
			desc: "InvalidRequest",
			err:  status.Error(codes.InvalidArgument, "invalid request"),
		},
	}
	for _, tc := range tests {
		t.Run(tc.desc, func(t *testing.T) {
			response, err := keeper.SystemInfo(wctx, tc.request)
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
