<script setup>
import FileInput from '@/components/FileInput.vue';
import NumberInput from '@/components/NumberInput.vue';
import Spinner from '@/components/Spinner.vue';
</script>

<template>
  <main @drop="dropHandler" @dragover="dragOverHandler">
    
    <nav>
      <h1>WebDrop</h1>
    </nav>

    <div class="content">
      <div class="content-container">
        <div class="send">
          <h1>Send</h1>
          <Transition name="fade" mode="out-in">
            <div v-if="!file">
              <FileInput @file="uploadFile" />
            </div>
            <div class="file-prepared" v-else>
              <div class="selected-file">
                <p>{{ file.name }}</p>
                <p>{{ fileSize }}</p>
              </div>
              <NumberInput v-model="otherId" />
  
              <div class="buttons">
                <button @click="back">Back</button>
                <button @click="send">Send</button>
              </div>
            </div>
          </Transition>
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
  max-width: 900px;
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
  overflow: hidden;
  gap: 10px;
}

div.send .buttons {
  display: flex;
  justify-content: center;
  flex-direction: row;
  gap: 10px;
}

div.send .buttons button {
  width: 100px;
}

.file-prepared {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 100%;
}

.selected-file {
  border: 3px solid var(--green);
  border-radius: 20px;
  display: flex;
  padding: 0.5em 1em;
  gap: 20px;
  justify-content: space-between;
}

.selected-file > p:first-child {
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
  div.content {
    flex-direction: column;
  }
  .selected-file {
    flex-direction: column;
    gap: 0px;
  }
  .selected-file > p:first-child {
    max-width: 100%;
  }
  main {
    padding: 5px;
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
      otherId: "",
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
    },
    back() {
      this.file = null
    },
    dropHandler(e) {
      e.preventDefault();

      if (e.dataTransfer.items) {
        if (e.dataTransfer.items[0]?.kind === "file") {
          this.file = e.dataTransfer.items[0].getAsFile();
        }
      } else {
        if (e.dataTransfer.files[0]) {
          this.file = e.dataTransfer.files[0];
        }
      }
    },
    dragOverHandler(e) {
      e.preventDefault();
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
