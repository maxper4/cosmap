package keeper

import (
	"github.com/cosmos/cosmos-sdk/store/prefix"
	sdk "github.com/cosmos/cosmos-sdk/types"
	"github.com/maxper4/cosmap/x/cosmap/types"
)

// SetEvents set a specific events in the store from its index
func (k Keeper) SetEvents(ctx sdk.Context, events types.Events) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.EventsKeyPrefix))
	b := k.cdc.MustMarshal(&events)
	store.Set(types.EventsKey(
		events.Index,
	), b)
}

// GetEvents returns a events from its index
func (k Keeper) GetEvents(
	ctx sdk.Context,
	index string,

) (val types.Events, found bool) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.EventsKeyPrefix))

	b := store.Get(types.EventsKey(
		index,
	))
	if b == nil {
		return val, false
	}

	k.cdc.MustUnmarshal(b, &val)
	return val, true
}

// RemoveEvents removes a events from the store
func (k Keeper) RemoveEvents(
	ctx sdk.Context,
	index string,

) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.EventsKeyPrefix))
	store.Delete(types.EventsKey(
		index,
	))
}

// GetAllEvents returns all events
func (k Keeper) GetAllEvents(ctx sdk.Context) (list []types.Events) {
	store := prefix.NewStore(ctx.KVStore(k.storeKey), types.KeyPrefix(types.EventsKeyPrefix))
	iterator := sdk.KVStorePrefixIterator(store, []byte{})

	defer iterator.Close()

	for ; iterator.Valid(); iterator.Next() {
		var val types.Events
		k.cdc.MustUnmarshal(iterator.Value(), &val)
		list = append(list, val)
	}

	return
}
