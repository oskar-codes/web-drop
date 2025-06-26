<script setup>
import FileInput from '@/components/FileInput.vue';
import NumberInput from '@/components/NumberInput.vue';
import Spinner from '@/components/Spinner.vue';
</script>

<template>
  <main>
    
    <nav>
      <h1>WebDrop</h1>
    </nav>

    <div class="content">
      <div class="content-container">
        <div class="send">
          <h1>Send</h1>
          <div v-if="!file">
            <FileInput @file="uploadFile" />
          </div>
          <div class="file-prepared" v-else>
            <div class="selected-file">
              <p>{{ file.name }}</p>
              <p>{{ fileSize }}</p>
  
            </div>
            <NumberInput v-model="otherId" />

            <button @click="send">Send</button>
          </div>
        </div>
        <div class="receive">
          <h1>Receive</h1>
          <div v-if="peer">
            <h3>Your ID is</h3>
            <div class="peer-id">
              {{ peer.originalId }}
            </div>
          </div>
          <div v-else>
            <Spinner />
          </div>
        </div>
      </div>
    </div>

  </main>
</template>


<style scoped>

main {
  display: flex;
  flex-direction: column;
  width: 100%;
  min-height: 100vh;
  padding: 2em;
  align-items: center;
  justify-content: center;
  gap: 20px;
}

nav h1 {
  font-weight: bold;
  font-size: 32px;
}

div.content {
  display: flex;
  width: 100%;
  height: 100%;
  max-width: 1080px;
}

div.content-container {
  display: flex;
  flex: 1;
}

div.content-container > div {
  flex: 1;
  position: relative;
  margin: 10px;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 10px rgba(0, 0, 0, 0.032);
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.file-prepared {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.selected-file {
  border: 3px solid var(--green);
  border-radius: 20px;
  display: flex;
  padding: 0.5em 1em;
  gap: 20px;
  justify-content: space-between;
}

.peer-id {
  font-size: 32px;
  font-weight: bold;
  letter-spacing: 10px;
}

@media only screen and (max-width: 720px) {
  div.content-container {
    flex-direction: column;
  }
}


</style>


<script>
import { usePeer } from '@/stores/peer.js';
import { storeToRefs } from 'pinia';
import { sendFile } from '@/assets/js/file-transfer.js';

export default {
  data() {
    const peerStore = usePeer();
    const { peer, receivedFile } = storeToRefs(peerStore);
    return {
      file: null,
      otherId: 0,
      peer,
      receivedFile,
    }
  },
  methods: {
    uploadFile(file) {
      this.file = file;
    },
    send() {
      sendFile(this.otherId, this.file);
    }
  },
  computed: {
    fileSize() {
      if (!this.file) return '';
      return (this.file.size / 1024).toFixed(1) + 'KB';
    }
  },
  watch: {
    receivedFile(file) {
      const a = document.createElement('a');
      const url = URL.createObjectURL(file);
      a.href = url;
      a.download = file.name;
      a.click();
    }
  }
}
</script>
