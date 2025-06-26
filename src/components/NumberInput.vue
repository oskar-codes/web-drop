

<template>
  <div ref="input">
    <input
      v-for="i in 6"
      :key="i"
      type="text"
      v-model="numbers[i - 1]"
      @input="emit"
      @keyup="moveCaret($event, i - 1)"
      @keydown="backspace($event, i - 1)"
      maxlength="1"
      pattern="[0-9]"
      >
  </div>
</template>

<style scoped>
div {
  display: flex;
  gap: 3px;
  justify-content: center;
  width: 100%;
}

div > input[type='text'] {
  width: 50px;
  height: 70px;
  border: 2px solid rgb(160, 160, 160);
  color: var(--color-text);
  border-radius: 10px;
  outline: none;
  font-size: 26px;
  font-weight: bold;
  text-align: center;
}

div > input[type='text']:focus {
  border: 2px solid rgb(64, 64, 64);
}

@media only screen and (max-width: 720px) {
  div > input[type='text'] {
    max-width: 15%;
    width: inherit;
    height: initial;
    aspect-ratio: 3/4;
    font-size: 18px;
  }
}

</style>

<script>
export default {
  props: ['modelValue'],
  emits: ['update:modelValue'],
  data() {
    return {
      numbers: []
    }
  },
  computed: {
    id() {
      return this.numbers.join("");
    }
  },
  methods: {
    emit() {
      this.$emit('update:modelValue', this.id)
    },
    moveCaret(e, i) {
      if (/[0-9]/.test(e.key)) {
        if (i === 5 || e.target.value === "") return;
        this.$refs.input.children[i + 1].focus();
      }
    },
    backspace(e, i) {
      if (e.key === "Backspace") {
        if (i === 0) return;
        if (e.target.value === "") {
          this.$refs.input.children[i - 1].focus();
        }
      }
    }
  }
}
</script>