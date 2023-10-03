import * as Y from 'yjs';
import { WebsocketProvider } from 'y-websocket';

let ydoc;
let wsProvider;
let ytext;

export function initYjs(room) {
  if (!ydoc) {
    ydoc = new Y.Doc();
    wsProvider = new WebsocketProvider('ws://localhost:3001', room, ydoc);
  }
  if (!ytext) {
    ytext = ydoc.getText('shared');
  }
}

export function getYText() {
  if (!ytext) {
    throw new Error("ytext has not been initialized. Please call initYjs first.");
  }
  return ytext;
}
