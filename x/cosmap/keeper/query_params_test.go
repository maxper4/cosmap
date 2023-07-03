package keeper_test

import (
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
	testkeeper "github.com/maxper4/cosmap/testutil/keeper"
	"github.com/maxper4/cosmap/x/cosmap/types"
	"github.com/stretchr/testify/require"
)

func TestParamsQuery(t *testing.T) {
	keeper, ctx := testkeeper.CosmapKeeper(t)
	wctx := sdk.WrapSDKContext(ctx)
	params := types.DefaultParams()
	keeper.SetParams(ctx, params)

	response, err := keeper.Params(wctx, &types.QueryParamsRequest{})
	require.NoError(t, err)
	require.Equal(t, &types.QueryParamsResponse{Params: params}, response)
}
