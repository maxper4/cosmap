package cli

import (
	"strconv"

	"encoding/json"
	"github.com/cosmos/cosmos-sdk/client"
	"github.com/cosmos/cosmos-sdk/client/flags"
	"github.com/cosmos/cosmos-sdk/client/tx"
	"github.com/maxper4/cosmap/x/cosmap/types"
	"github.com/spf13/cobra"
)

var _ = strconv.Itoa(0)

func CmdReportEvent() *cobra.Command {
	cmd := &cobra.Command{
		Use:   "report-event [position] [event]",
		Short: "Broadcast message reportEvent",
		Args:  cobra.ExactArgs(2),
		RunE: func(cmd *cobra.Command, args []string) (err error) {
			argPosition := new(types.Coordinate)
			err = json.Unmarshal([]byte(args[0]), argPosition)
			if err != nil {
				return err
			}
			argEvent := new(types.EventTypes)
			err = json.Unmarshal([]byte(args[1]), argEvent)
			if err != nil {
				return err
			}

			clientCtx, err := client.GetClientTxContext(cmd)
			if err != nil {
				return err
			}

			msg := types.NewMsgReportEvent(
				clientCtx.GetFromAddress().String(),
				argPosition,
				argEvent,
			)
			if err := msg.ValidateBasic(); err != nil {
				return err
			}
			return tx.GenerateOrBroadcastTxCLI(clientCtx, cmd.Flags(), msg)
		},
	}

	flags.AddTxFlagsToCmd(cmd)

	return cmd
}
