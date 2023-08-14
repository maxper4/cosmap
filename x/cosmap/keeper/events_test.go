package keeper_test

import (
	"strconv"
	"testing"

	sdk "github.com/cosmos/cosmos-sdk/types"
	keepertest "github.com/maxper4/cosmap/testutil/keeper"
	"github.com/maxper4/cosmap/testutil/nullify"
	"github.com/maxper4/cosmap/x/cosmap/keeper"
	"github.com/maxper4/cosmap/x/cosmap/types"
	"github.com/stretchr/testify/require"
)

// Prevent strconv unused error
var _ = strconv.IntSize

func createNEvents(keeper *keeper.Keeper, ctx sdk.Context, n int) []types.Events {
	items := make([]types.Events, n)
	for i := range items {
		items[i].Index = strconv.Itoa(i)

		keeper.SetEvents(ctx, items[i])
	}
	return items
}

func TestEventsGet(t *testing.T) {
	keeper, ctx := keepertest.CosmapKeeper(t)
	items := createNEvents(keeper, ctx, 10)
	for _, item := range items {
		rst, found := keeper.GetEvents(ctx,
			item.Index,
		)
		require.True(t, found)
		require.Equal(t,
			nullify.Fill(&item),
			nullify.Fill(&rst),
		)
	}
}
func TestEventsRemove(t *testing.T) {
	keeper, ctx := keepertest.CosmapKeeper(t)
	items := createNEvents(keeper, ctx, 10)
	for _, item := range items {
		keeper.RemoveEvents(ctx,
			item.Index,
		)
		_, found := keeper.GetEvents(ctx,
			item.Index,
		)
		require.False(t, found)
	}
}

func TestEventsGetAll(t *testing.T) {
	keeper, ctx := keepertest.CosmapKeeper(t)
	items := createNEvents(keeper, ctx, 10)
	require.ElementsMatch(t,
		nullify.Fill(items),
		nullify.Fill(keeper.GetAllEvents(ctx)),
	)
}
