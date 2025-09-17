<template>
    <Transition name="fade">
      <div class="background" @click="$emit('update:modelValue', false)" v-if="modelValue">
      </div>
    </Transition>
    <Transition name="fade">
      <div v-if="modelValue" class="modal-content">
        <slot></slot>
      </div>
    </Transition>
</template>

<style scoped>
.background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: black;
  opacity: 0.5;
  z-index: 1000;
}

.modal-content {
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0px 0px 10px 10px rgba(0, 0, 0, 0.032);
  z-index: 1000;
  position: fixed;
  left: 50%; top: 50%;
  transform: translate(-50%, -50%);
  min-width: 80%;
  max-width: 800px;
  max-height: 100%;
  background-color: white;
  overflow-y: scroll;
}
</style>

<script>
export default {
  props: {
    modelValue: {
      type: Boolean,
      required: true
    }
  },
  emits: ['update:modelValue'],
  methods: {
    close() {
      this.$emit('update:modelValue', false);
    }
  }
}
</script>