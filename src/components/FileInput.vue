

<template>
  <div class="input" @click="selectFile">
    <div class="drop-zone">

      <img src="/images/share.png">

      <p>Select or drop files</p>
    </div>

    <input type="file" ref="input" @change="uploadFile">
  </div>
</template>

<style scoped>
.input {
  display: inline-block;
  padding: 1em;
}

.drop-zone {
  cursor: pointer;
  padding: 1em 2em;
  border-radius: 20px;
  border: 3px dashed var(--green);
}

.drop-zone img {
  max-width: 50px;
}

input[type='file'] {
  display: none;
}
</style>

<script>
export default {
  emits: ['file'],
  data() {
    return {
      file: null
    } 
  },
  methods: {
    selectFile() {
      this.$refs.input.click();
    },
    uploadFile(e) {
      const file = e.target.files[0];
      if (!file) return;

      this.$emit('file', file);
      this.file = file;
    }
  }
}
</script>