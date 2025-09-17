import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { peerInstance } from '@/assets/js/file-transfer'

export const usePeer = defineStore('peer', () => {
  const peer = new ref(null);
  const receivedFiles = new ref([]);
  const receivedText = new ref('');

  peerInstance.on('open', () => {
    peer.value = peerInstance;
  });

  peerInstance.on('connection', connection => {
    connection.on('data', data => {

      if (data.type === 'file') {
        const files = data.files.map(f => new File([f.file], f.name));
        receivedFiles.value = files;
        connection.close();
      } else if (data.type === 'text') {
        receivedText.value = data.text;
        connection.close();
      }

    });
  });

  peerInstance.on('error', e => {
    console.error(e);
  });

  const register = (name, callback) => peerInstance.on(name, callback);

  return {
    peer,
    receivedFiles,
    receivedText,
    register
  }
})
