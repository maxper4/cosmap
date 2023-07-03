package keeper_test

import (
	"testing"

	testkeeper "github.com/maxper4/cosmap/testutil/keeper"
	"github.com/maxper4/cosmap/x/cosmap/types"
	"github.com/stretchr/testify/require"
)

func TestGetParams(t *testing.T) {
	k, ctx := testkeeper.CosmapKeeper(t)
	params := types.DefaultParams()

	k.SetParams(ctx, params)

	require.EqualValues(t, params, k.GetParams(ctx))
}
