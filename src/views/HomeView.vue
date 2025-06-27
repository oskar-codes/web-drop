<script setup>
import FileInput from '@/components/FileInput.vue';
import NumberInput from '@/components/NumberInput.vue';
import Spinner from '@/components/Spinner.vue';
import Favicon from '../../public/favicon.webp';
import { Toaster, toast } from "@steveyuowo/vue-hot-toast";
import "@steveyuowo/vue-hot-toast/vue-hot-toast.css";
</script>

<template>
  <main @drop="dropHandler" @dragover="dragOverHandler">
    
    <nav>
      <img :src="Favicon">
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

  <Toaster />
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

nav {
  display: flex;
  gap: 20px;
  align-items: center;
}

nav h1 {
  font-weight: bold;
  font-size: 32px;
}

nav img {
  width: 50px;
  height: 50px;
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
  border: 3px solid var(--blue);
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
import { storeToRefs, mapActions } from 'pinia';
import { formatError, sendFile } from '@/assets/js/file-transfer.js';

export default {
  data() {
    const peerStore = usePeer();
    const { peer, receivedFile } = storeToRefs(peerStore);

    this.register('error', e => {
      this.sending = false;
      toast.error(formatError(e.type), { position: 'bottom-center' });
      this.removeLoadingToast();
    });

    return {
      file: null,
      otherId: "",
      peer,
      receivedFile,
      loadingToast: "",
      sending: false
    }
  },
  methods: {
    uploadFile(file) {
      this.file = file;
    },
    send() {
      if (!/^[0-9]{6}$/.test(this.otherId)) {
        toast.error('Invalid ID.', { position: 'bottom-center' });
        return;
      }

      if (!this.sending) {
        this.sending = true;
        this.loadingToast = toast.loading('Sending file...', { position: 'bottom-center' });

        sendFile(this.otherId, this.file, () => {
          toast.success('File sent', { position: 'bottom-center' });
          this.removeLoadingToast();
          this.sending = false;
        }, e => {
          toast.error(formatError(e.type), { position: 'bottom-center' });
          this.removeLoadingToast();
          this.sending = false;
        });
      }
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
    },
    removeLoadingToast() {
      if (this.loadingToast === "") return;
      toast.update(this.loadingToast, {
        duration: 0
      });
      this.loadingToast = "";
    },
    ...mapActions(usePeer, ['register']),
  },
  computed: {
    fileSize() {
      if (!this.file) return '';
      return (this.file.size / 1024).toFixed(1) + 'KB';
    }
  },
  watch: {
    receivedFile(file) {
      const formattedName = file.name.length < 20 ? file.name : file.name.slice(0, 17) + '...';
      toast.success(`Received file: ${formattedName}`, { position: 'bottom-center' });
      const a = document.createElement('a');
      const url = URL.createObjectURL(file);
      a.href = url;
      a.download = file.name;
      a.click();
    }
  }
}
</script>
