import { io } from 'socket.io-client';
import { UMI_APP_WEBSOCKET_API } from './config';

export const socket = io(UMI_APP_WEBSOCKET_API, {
  extraHeaders: {
    Authorization: sessionStorage.getItem('token') ?? '',
  },
});
