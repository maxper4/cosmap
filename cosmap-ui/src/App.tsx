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
import { EventTypesEnum, eventTypesEnumToJSON } from './cosmap-client/src/types/generated/cosmap/cosmap/event_types';
import { Events } from './cosmap-client/src/types/generated/cosmap/cosmap/events';
import { hover } from '@testing-library/user-event/dist/hover';
import { eventTypeToString } from './cosmap-client/src/types/cosmap/events';

declare global {
  interface Window extends KeplrWindow {}
}

export interface AppProps {
  rpcUrl: string;
}

function App({rpcUrl} : AppProps) {
  const [allEvents, setAllEvents] = useState<Events[]>([]);
  const [queryClient, setQueryClient] = useState<CosmapStargateClient | null>(null);
  const [address, setAddress] = useState<string | null>(null);
  const [signingClient, setSigningClient] = useState<CosmapSigningStargateClient | null>(null);
  const [mousePosition, setMousePosition] = useState<Coordinate>({ x: Long.fromNumber(0), y: Long.fromNumber(0)});
  const [mouseHoverMap, setMouseHoverMap] = useState<boolean>(false); 
  const [mouseHoverEvent, setMouseHoverEvent] = useState<boolean>(false);
  const [hoveredEvent, setHoveredEvent] = useState<Events | null>(null);

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

      setAllEvents([...allEvents, newEvent!])
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
      queryClient.getAllEvents().then((events) => {
        setAllEvents(events);
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
          allEvents.map((event, index) => (
            <Point key={"point-" + index} x={event.position!.x} y={event.position!.y} type={event.event} setMouseHover={(value:boolean) => { setMouseHoverEvent(value); setHoveredEvent(event)}}/>
          ))
        }
      </div>
      <div>
        {
          mouseHoverMap &&
          <p>Mouse position: {mousePosition.x.toString()} {mousePosition.y.toString()}</p>
        }
        {
          mouseHoverEvent &&
          <>
          <ul>
            <li>Id: {hoveredEvent!.index}</li>
            <li>Type: {eventTypeToString(hoveredEvent!.event!.eventType!)}</li>
            <li>Reported at: {hoveredEvent!.timestamp.toString()}</li>
            <li>Creator: {hoveredEvent!.sender}</li>
          </ul>
          </>
        }

      </div>
    </>
    }
    </>
  );
}

export default App;
