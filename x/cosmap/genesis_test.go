package cosmap_test

import (
	"testing"

	keepertest "github.com/maxper4/cosmap/testutil/keeper"
	"github.com/maxper4/cosmap/testutil/nullify"
	"github.com/maxper4/cosmap/x/cosmap"
	"github.com/maxper4/cosmap/x/cosmap/types"
	"github.com/stretchr/testify/require"
)

func TestGenesis(t *testing.T) {
	genesisState := types.GenesisState{
		Params: types.DefaultParams(),

		SystemInfo: types.SystemInfo{
			NextId: 27,
		},
		// this line is used by starport scaffolding # genesis/test/state
	}

	k, ctx := keepertest.CosmapKeeper(t)
	cosmap.InitGenesis(ctx, *k, genesisState)
	got := cosmap.ExportGenesis(ctx, *k)
	require.NotNil(t, got)

	nullify.Fill(&genesisState)
	nullify.Fill(got)

	require.Equal(t, genesisState.SystemInfo, got.SystemInfo)
	// this line is used by starport scaffolding # genesis/test/assert
}
