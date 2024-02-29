import { HubConnectionBuilder, LogLevel } from "@microsoft/signalr";

export const connection = new HubConnectionBuilder()
  .withUrl(`${import.meta.env.VITE_SOCKET_URL}/gameHub`)
  .configureLogging(LogLevel.Information)
  .withAutomaticReconnect()
  .build();
