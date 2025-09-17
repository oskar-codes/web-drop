
export const connectionPrefix = '7b965b547af4fb240fd3c0de264928b3fda5763fdf70b9344b5cec4d43f0ff89';

export function createPeer() {
  const id = new Array(6).fill().map(_ => Math.floor(Math.random() * 10)).join("").toString();
  const peer = new Peer(connectionPrefix + id);
  peer.originalId = id;
  return peer;
}

export const peerInstance = createPeer();

export function sendFile(otherId, file, success, error) {
  const connection = peerInstance.connect(connectionPrefix + otherId);
  connection.on('open', () => {
    connection.send({
      type: 'file',
      name: file.name,
      file
    });
  });
  if (success) connection.on('close', success)
  if (error) connection.on('error', error)
}

export function sendText(otherId, text, success, error) {
  const connection = peerInstance.connect(connectionPrefix + otherId);
  connection.on('open', () => {
    connection.send({
      type: 'text',
      text
    });
  });
  if (success) connection.on('close', success)
  if (error) connection.on('error', error)
}

export function formatError(e) {
  switch (e) {
    case 'browser-incompatible':
      return 'Your browser does not support WebRTC.'
    case 'disconnected':
      return 'You were disconnected. Please reload the page.'
    case 'network':
      return 'Could not establish a connection. Check your internet.'
    case 'peer-unavailable':
      return 'The ID you entered does not exist.'
    case 'ssl-unavailable':
      return 'SSL error on cloud server.'
    case 'server-error':
      return 'Unable to reach the server.'
    case 'socket-error':
      return 'An error occurred with the socket.'
    case 'socket-closed':
      return 'The socket closed unexpectedly.'
    case 'unavailable-id':
      return 'Duplicate IDs. Please reload the page.'
    case 'webrtc':
      return 'An error occurred with WebRTC.'
    default:
      return 'An unknown error occurred.'
  }
}