
export const connectionPrefix = '7b965b547af4fb240fd3c0de264928b3fda5763fdf70b9344b5cec4d43f0ff89';

export function createPeer() {
  const id = new Array(6).fill().map(e => Math.floor(Math.random() * 10)).join("").toString();
  const peer = new Peer(connectionPrefix + id);
  peer.originalId = id;
  return peer;
}

export const peerInstance = createPeer();

export function sendFile(otherId, file) {
  const connection = peerInstance.connect(connectionPrefix + otherId);
  connection.on('open', () => {
    connection.send({
      name: file.name,
      file
    });
  });
}