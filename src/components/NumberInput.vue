

<template>
  <div>
    <input type="number" v-model.number="id" @change="emit">
  </div>
</template>

<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  data() {
    return {
      id: 0
    }
  },
  methods: {
    emit() {
      this.$emit('update:modelValue', this.id)
    }
  }
}
</script>