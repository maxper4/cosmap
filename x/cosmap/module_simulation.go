package cosmap

import (
	"math/rand"

	"github.com/cosmos/cosmos-sdk/baseapp"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/cosmos/cosmos-sdk/types/module"
	simtypes "github.com/cosmos/cosmos-sdk/types/simulation"
	"github.com/cosmos/cosmos-sdk/x/simulation"
	"github.com/maxper4/cosmap/testutil/sample"
	cosmapsimulation "github.com/maxper4/cosmap/x/cosmap/simulation"
	"github.com/maxper4/cosmap/x/cosmap/types"
)

// avoid unused import issue
var (
	_ = sample.AccAddress
	_ = cosmapsimulation.FindAccount
	_ = simulation.MsgEntryKind
	_ = baseapp.Paramspace
	_ = rand.Rand{}
)

const (
	opWeightMsgReportEvent = "op_weight_msg_report_event"
	// TODO: Determine the simulation weight value
	defaultWeightMsgReportEvent int = 100

	// this line is used by starport scaffolding # simapp/module/const
)

// GenerateGenesisState creates a randomized GenState of the module.
func (AppModule) GenerateGenesisState(simState *module.SimulationState) {
	accs := make([]string, len(simState.Accounts))
	for i, acc := range simState.Accounts {
		accs[i] = acc.Address.String()
	}
	cosmapGenesis := types.GenesisState{
		Params: types.DefaultParams(),
		// this line is used by starport scaffolding # simapp/module/genesisState
	}
	simState.GenState[types.ModuleName] = simState.Cdc.MustMarshalJSON(&cosmapGenesis)
}

// RegisterStoreDecoder registers a decoder.
func (am AppModule) RegisterStoreDecoder(_ sdk.StoreDecoderRegistry) {}

// ProposalContents doesn't return any content functions for governance proposals.
func (AppModule) ProposalContents(_ module.SimulationState) []simtypes.WeightedProposalContent {
	return nil
}

// WeightedOperations returns the all the gov module operations with their respective weights.
func (am AppModule) WeightedOperations(simState module.SimulationState) []simtypes.WeightedOperation {
	operations := make([]simtypes.WeightedOperation, 0)

	var weightMsgReportEvent int
	simState.AppParams.GetOrGenerate(simState.Cdc, opWeightMsgReportEvent, &weightMsgReportEvent, nil,
		func(_ *rand.Rand) {
			weightMsgReportEvent = defaultWeightMsgReportEvent
		},
	)
	operations = append(operations, simulation.NewWeightedOperation(
		weightMsgReportEvent,
		cosmapsimulation.SimulateMsgReportEvent(am.accountKeeper, am.bankKeeper, am.keeper),
	))

	// this line is used by starport scaffolding # simapp/module/operation

	return operations
}

// ProposalMsgs returns msgs used for governance proposals for simulations.
func (am AppModule) ProposalMsgs(simState module.SimulationState) []simtypes.WeightedProposalMsg {
	return []simtypes.WeightedProposalMsg{
		simulation.NewWeightedProposalMsg(
			opWeightMsgReportEvent,
			defaultWeightMsgReportEvent,
			func(r *rand.Rand, ctx sdk.Context, accs []simtypes.Account) sdk.Msg {
				cosmapsimulation.SimulateMsgReportEvent(am.accountKeeper, am.bankKeeper, am.keeper)
				return nil
			},
		),
		// this line is used by starport scaffolding # simapp/module/OpMsg
	}
}
