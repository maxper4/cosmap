import { useState, useEffect } from 'react';

import Point from './components/Point';
import './App.css';
import Loader from "./components/Loader"

import { CosmapStargateClient } from './cosmap-client/src/cosmap_stargateclient';
import { CosmapSigningStargateClient } from './cosmap-client/src/cosmap_signingstargateclient';
import { Window as KeplrWindow } from "@keplr-wallet/types"

import Long from "long";
import { Coordinate } from './cosmap-client/src/types/generated/cosmap/cosmap/coordinate';
import { cosmapChainId, getCosmapChainInfo } from './cosmap-client/src/types/cosmap/chain';
import { GasPrice } from '@cosmjs/stargate';
import { OfflineSigner } from '@cosmjs/proto-signing';
import { EventTypesEnum } from './cosmap-client/src/types/generated/cosmap/cosmap/event_types';

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
  const [mousePosition, setMousePosition] = useState<Coordinate>({ x: Long.fromNumber(0), y: Long.fromNumber(0)});
  const [mouseHoverMap, setMouseHoverMap] = useState<boolean>(false); 

  const [ready, setReady] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<string>("Initializing...");

  const onClickMap = async(e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const x = Long.fromNumber(e.pageX - e.currentTarget.offsetLeft);
    const y = Long.fromNumber(e.pageY - e.currentTarget.offsetTop);
    const pos:Coordinate = { x, y };
    try{
      const eventId = await signingClient!.reportEvent(address!, pos, {eventType: EventTypesEnum.EVENT_TYPES_UNKNOWN}, "auto")
      const newEvent = await queryClient!.getEventById(eventId)
      if (newEvent == undefined) {
        console.log("Could not find event with id " + eventId);
        return;
      }

      setPoints([...points, newEvent.position!])
    }
    catch (e) {
      console.log("Could not report event: " + e);
      return;
    }
  }

  const onMouseMoveMap = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const x = Long.fromNumber(e.pageX - e.currentTarget.offsetLeft);
    const y = Long.fromNumber(e.pageY - e.currentTarget.offsetTop);
    setMousePosition({ x, y });
  }

  const initClients = async() => {
    setReady(false);
    setLoadingState("Connecting query client...");
    try {
      const client = await CosmapStargateClient.connect(rpcUrl);
      setQueryClient(client);
      setLoadingState("Query client connected!");
    }
    catch (e) {
      console.log("Could not connect to RPC: " + e);
      setLoadingState("ERROR: Could not connect to RPC: " + e);
      return;
    }
    
    setLoadingState("Connecting signing client...")
    const { keplr } = window
    if (!keplr) {
        setLoadingState("ERROR: You need to install Keplr!")
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
    setLoadingState("Signing client connected!");
    setReady(true);
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
    {
      !ready &&
      <Loader title={loadingState} /> ||
      <>
      <header className="App-header">
        <h1> Cosmap </h1>
      </header>
      <div id='map' onClick={(e) => onClickMap(e)} onMouseMove={(e) => onMouseMoveMap(e)} onMouseEnter={(e) => setMouseHoverMap(true)}
        onMouseLeave={(e) => setMouseHoverMap(false)}
      >
        {
          points.map((point, index) => (
            <Point key={"point-" + index} x={point.x} y={point.y} type={"0"} index={index} />
          ))
        }
      </div>
      <div id='mouse-position'>
        {
          mouseHoverMap &&
          <p>Mouse position: {mousePosition.x.toString()} {mousePosition.y.toString()}</p>
        }
      </div>
    </>
    }
    </>
  );
}

export default App;
