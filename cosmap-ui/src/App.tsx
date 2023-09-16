import { useState, useEffect } from 'react';

import Point from './components/Point';
import './App.css';

import { CosmapStargateClient } from './cosmap-client/src/cosmap_stargateclient';
import { CosmapSigningStargateClient } from './cosmap-client/src/cosmap_signingstargateclient';
import { Window as KeplrWindow } from "@keplr-wallet/types"

import Long from "long";
import { Coordinate } from './cosmap-client/src/types/generated/cosmap/cosmap/coordinate';
import { cosmapChainId, getCosmapChainInfo } from './cosmap-client/src/types/cosmap/chain';
import { GasPrice } from '@cosmjs/stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { EventTypes, EventTypesEnum } from './cosmap-client/src/types/generated/cosmap/cosmap/event_types';

declare global {
  interface Window extends KeplrWindow {}
}

export interface AppProps {
  rpcUrl: string;
}

function App({rpcUrl} : AppProps) {
  const [points, setPoints] = useState<Coordinate[]>([]);
  const [queryClient, setQueryClient] = useState<CosmapStargateClient | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [signingClient, setSigningClient] = useState<CosmapSigningStargateClient | null>(null);

  const onClickMap = async(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const x = Long.fromNumber(e.pageX - e.currentTarget.offsetLeft);
    const y = Long.fromNumber(e.pageY - e.currentTarget.offsetTop);
    console.log("x: " + x + " y: " + y);
    const pos:Coordinate = { x, y };
    await signingClient!.reportEvent(address!, pos, {eventType: EventTypesEnum.EVENT_TYPES_UNKNOWN}, "auto")
  }

  const initClients = async() => {
    const client = await CosmapStargateClient.connect(rpcUrl);
    await getSigningStargateClient();
    setQueryClient(client);
  }

  const getSigningStargateClient = async() => {
    if (address && signingClient)
        return {
            address: address,
            signingClient: signingClient,
        }

    const { keplr } = window
    if (!keplr) {
        alert("You need to install Keplr")
        throw new Error("You need to install Keplr")
    }
    await keplr.experimentalSuggestChain(getCosmapChainInfo())
    await keplr.enable(cosmapChainId)
    const offlineSigner: OfflineSigner = keplr.getOfflineSigner!(cosmapChainId)
    const creator = (await offlineSigner.getAccounts())[0].address
    const client: CosmapSigningStargateClient = await CosmapSigningStargateClient.connectWithSigner(
        rpcUrl,
        offlineSigner,
        {
            gasPrice: GasPrice.fromString("1stake"),
        },
    )
    setAddress(creator)
    setSigningClient(client)
    return { address: creator, signingClient: client }
  }

  useEffect(() => {
    initClients();
  }, []);

  useEffect(() => {
    if (queryClient) {
      queryClient.getAllEvents().then((points) => {
        setPoints(points.map((point) => point.position!));
      });
    }
  }, [queryClient]);

  return (
    <>
      <header className="App-header">
        <h1> Cosmap </h1>
      </header>
      <div id='map' onClick={(e) => onClickMap(e)}>
        {
          points.map((point, index) => (
            <Point key={"point-" + index} x={point.x} y={point.y} type={"0"} index={index} />
          ))
        }
      </div>
    </>
  );
}

export default App;
