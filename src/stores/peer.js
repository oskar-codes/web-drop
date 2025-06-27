import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { peerInstance } from '@/assets/js/file-transfer'

export const usePeer = defineStore('peer', () => {
  const peer = new ref(null);
  const receivedFile = new ref(null);

  peerInstance.on('open', () => {
    peer.value = peerInstance;
  });

  peerInstance.on('connection', connection => {
    connection.on('data', data => {
      const file = new File([data.file], data.name);
      receivedFile.value = file;
      connection.close();
    });
  });

  peerInstance.on('error', e => {
    console.error(e);
  });

  const register = (name, callback) => peerInstance.on(name, callback);

  return {
    peer,
    receivedFile,
    register
  }
})
