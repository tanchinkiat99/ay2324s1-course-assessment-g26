import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

export function initYjs(room) {
  const ydoc = new Y.Doc();
  const wsProvider = new WebsocketProvider('ws://localhost:5555', room, ydoc);
  const ytext = ydoc.getText('shared');
  return { ydoc, ytext };
}

// export function getYText() {
//   if (!ytext) {
//     throw new Error("ytext has not been initialized. Please call initYjs first.");
//   }
//   return ytext;
// }