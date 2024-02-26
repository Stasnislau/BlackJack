import { HubConnectionBuilder } from "@microsoft/signalr";

export const connection = new HubConnectionBuilder()
  .withUrl(`${import.meta.env.VITE_SOCKET_URL}/gameHub`)
  .withAutomaticReconnect()
  .build();
