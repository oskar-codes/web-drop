<script setup>
import FileInput from '@/components/FileInput.vue';
import NumberInput from '@/components/NumberInput.vue';
import Spinner from '@/components/Spinner.vue';
import Favicon from '/favicon.webp';
import Copy from '/images/copy.svg';
import Modal from '@/components/Modal.vue';
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


            <div v-if="mode === 'file'">
              <Transition name="fade" mode="out-in">
                <div v-if="files.length === 0">
                  <FileInput @file="uploadFiles" />
                  <hr />
                  <a @click="mode = 'text'">Or send text</a>
                </div>
                <div v-else class="input-column">
                  <div class="selected-payload" v-for="file in files" :key="file.name">
                    <p>{{ file.name }}</p>
                    <p>{{ fileSize(file) }}</p>
                  </div>
                  <NumberInput v-model="otherId" />
      
                  <div class="buttons">
                    <button @click="back">Back</button>
                    <button @click="send">Send</button>
                  </div>
                </div>
              </Transition>
            </div>


            <div v-else-if="mode === 'text'">
              <Transition name="fade" mode="out-in">
                <div v-if="!sendingText">
                  <div class="input-column">
                    <textarea v-model="text" type="text" placeholder="Enter the text to send" />
                    <button @click="validateText">Continue</button>
                  </div>

                  <hr />
                  <a @click="mode = 'file'">Or send files</a>
                </div>
                <div v-else class="input-column">
                  <div class="selected-payload">
                    <p>{{ text }}</p>
                  </div>

                  <NumberInput v-model="otherId" />
                  <div class="buttons">
                    <button @click="send">Send</button>
                    <button @click="back">Back</button>
                  </div>
                </div>
              </Transition>
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

    <Modal v-model="showTextModal">
      <div class="received-text-modal">
        <div class="modal-header">
          <h1>Received text</h1>
          <a class="copy" @click="copy">
            <img :src="Copy" />
          </a>
        </div>
        <p class="received-text">{{ receivedText }}</p>
        <button @click="showTextModal = false;">Close</button>
      </div>
    </Modal>

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

div.send, div.receive {
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

div.title-top div.send > div, div.title-top div.receive > div {
  display: flex;
  flex-direction: column;
  flex: 1;
  justify-content: center;
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

.input-column {
  display: flex;
  flex-direction: column;
  gap: 10px;
  max-width: 100%;
}

.selected-payload {
  border: 3px solid var(--blue);
  border-radius: 20px;
  display: flex;
  padding: 0.5em 1em;
  gap: 20px;
  justify-content: space-between;
}

.selected-payload > p:first-child {
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

.received-text {
  white-space: pre;
  overflow-x: scroll;
  background-color: var(--vt-c-divider-light-2);
  padding: 20px;
  border-radius: 10px;
}

.received-text-modal {
  display: flex;
  gap: 10px;
  flex-direction: column;
}

.received-text-modal > button {
  align-self: center;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header .copy {
  border-radius: 50%;
  background-color: var(--blue);
  padding: 10px;
  line-height: 0;
}

.modal-header .copy img {
  width: 20px;
  height: 20px;
}

@media only screen and (max-width: 720px) {
  div.content-container {
    flex-direction: column;
  }
  div.content {
    flex-direction: column;
  }
  .selected-payload {
    flex-direction: column;
    gap: 0px;
  }
  .selected-payload > p:first-child {
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
import { formatError, sendFiles, sendText } from '@/assets/js/file-transfer.js';

export default {
  data() {
    const peerStore = usePeer();
    const { peer, receivedFiles, receivedText } = storeToRefs(peerStore);

    this.register('error', e => {
      this.sending = false;
      toast.error(formatError(e.type), { position: 'bottom-center' });
      this.removeLoadingToast();
    });

    return {
      mode: 'file',
      files: [],
      text: '',
      sendingText: false,
      showTextModal: false,
      otherId: '',
      peer,
      receivedFiles,
      receivedText,
      loadingToast: '',
      sending: false
    }
  },
  methods: {
    uploadFiles(files) {
      this.files = files;
    },
    fileSize(file) {
      return (file.size / 1024).toFixed(1) + 'KB';
    },
    send() {
      if (!/^[0-9]{6}$/.test(this.otherId)) {
        toast.error('Invalid ID.', { position: 'bottom-center' });
        return;
      }
      if (this.peer.originalId === this.otherId) {
        toast.error('Try sending the data to someone else.', { position: 'bottom-center' });
        return;
      }
      if (this.mode === 'text' && this.text.trim() === '') return;

      if (!this.sending) {
        this.sending = true;
        this.loadingToast = toast.loading(`Sending ${this.mode}...`, { position: 'bottom-center' });

        if (this.mode === 'file') {

          sendFiles(this.otherId, this.files, () => {
            toast.success('Files sent!', { position: 'bottom-center' });
            this.removeLoadingToast();
            this.sending = false;
          }, e => {
            toast.error(formatError(e.type), { position: 'bottom-center' });
            this.removeLoadingToast();
            this.sending = false;
          });

        } else if (this.mode === 'text') {

          sendText(this.otherId, this.text.trim(), () => {
            toast.success('Text sent!', { position: 'bottom-center' });
            this.removeLoadingToast();
            this.sending = false;
          }, e => {
            toast.error(formatError(e.type), { position: 'bottom-center' });
            this.removeLoadingToast();
            this.sending = false;
          });

        }

      }
    },
    back() {
      this.sendingText = false;
      this.files = [];
    },
    dropHandler(e) {
      e.preventDefault();

      if (e.dataTransfer.items) {
        if (e.dataTransfer.items[0]?.kind === "file") {
          this.files = Array.from(e.dataTransfer.items).map(e => e.getAsFile());
        }
      } else {
        if (e.dataTransfer.files[0]) {
          this.files = e.dataTransfer.files;
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
    validateText() {
      if (this.text.trim() === '') return;
      this.sendingText = true;
    },
    copy() {
      navigator.clipboard.writeText(this.receivedText);
      toast.success('Text copied to clipboard!', { position: 'bottom-center' })
    },
    ...mapActions(usePeer, ['register']),
  },
  watch: {
    receivedFiles(files) {
      for (const file of files) {
        const formattedName = file.name.length < 20 ? file.name : file.name.slice(0, 17) + '...';
        toast.success(`Received file: ${formattedName}`, { position: 'bottom-center' });
        const a = document.createElement('a');
        const url = URL.createObjectURL(file);
        a.href = url;
        a.download = file.name;
        a.click();
      }
    },
    receivedText(text) {
      const URL_REGEX = /^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$/
      if (URL_REGEX.test(text)) {
        
        const a = document.createElement('a');
        a.href = text;
        a.click();

        return;
      }

      this.showTextModal = true;

    }
  }
}
</script>
