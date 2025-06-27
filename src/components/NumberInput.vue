

<template>
  <div ref="input">
    <input
      v-for="i in 6"
      :key="i"
      type="number"
      v-model="numbers[i - 1]"
      @input="emit"
      @keyup="moveCaret($event, i - 1)"
      @keydown="backspace($event, i - 1)"
      @keypress="prevent"
      maxlength="1"
      pattern="\d"
      min="0"
      max="9"
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

div > input[type='number'] {
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

div > input[type='number']:focus {
  border: 2px solid var(--blue);
}

input[type=number]::-webkit-inner-spin-button, 
input[type=number]::-webkit-outer-spin-button { 
    -webkit-appearance: none;
    -moz-appearance: none;
    appearance: none;
    margin: 0; 
}

input[type=number] {
  -moz-appearance: textfield;
  appearance: textfield;
}

@media only screen and (max-width: 720px) {
  div > input[type='number'] {
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
    },
    prevent(e) {
      if (e.which < 48 || e.which > 57) {
        e.preventDefault();
      }
    }
  }
}
</script>
