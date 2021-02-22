<!-- Inspired from https://www.w3schools.com/howto/howto_css_switch.asp -->
<template>
  <label :class="['switch']">
    <input :checked="currValue" type="checkbox" @click="toggle">
    <span :class="['slider', 'round', darkTheme ? 'darkSlider' : 'lightSlider']"></span>
  </label>
</template>


<script>
export default {
  data() {
    return {
      currValue: false,
    }
  },
  props: {
    darkTheme: {
      required: true,
      type: Boolean,
    },
    value: {
      required: true,
    }
  },
  model: {
    event: "toggle"
  },
  methods: {
    toggle: function() {
      this.$emit("toggle", this.currValue = !this.currValue);
    }
  },
  watch: {
    value(newV) {
      this.currValue = newV;
    }
  },
  created() {
    this.currValue = this.value;
  }
}

</script>

<style scoped>
/* The switch - the box around the slider */
.switch {
  position: relative;
  display: flex;
  width: 38px;
  height: 21px;
  margin: 0;
}

/* Hide default HTML checkbox */
.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

/* The slider */
.slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  -webkit-transition: .1s;
  transition:  .1s;
}
.lightSlider {
  background-color: #fff;
  border: 1px solid #999;
}
.darkSlider{
  background-color: #303131;
  border: 1px solid #111;
}

.slider:before {
  position: absolute;
  content: "";
  height: 17px;
  width: 17px;
  left: 2px;
  bottom: 1px;
  background-color: #999;
  -webkit-transition: .1s;
  transition: .1s;
}

input:checked + .lightSlider{
  background-color: #057bfe;
  border: 1px solid #057bfe;
}


input:checked + .lightSlider:before {
  background-color: #fff;
}
input:checked + .darkSlider:before{
  background-color: #f5d782;
}

input:focus + .lightSlider{
  box-shadow: 0 0 1px #057bfe;
}
input:focus + .darkSlider{
  box-shadow: 0 0 1px #111;
}

input:checked + .slider:before {
  -webkit-transform: translateX(15px);
  -ms-transform: translateX(15px);
  transform: translateX(15px);
}

/* Rounded sliders */
.slider.round {
  border-radius: 20px;
}

.slider.round:before {
  border-radius: 50%;
}
</style>
