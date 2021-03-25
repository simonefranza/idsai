<template>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="93" height="93" viewBox="0 0 93 93" @click="rotate">
  <defs>
    <filter id="ellypse_13" x="0" y="0" width="80" height="80" filterUnits="userSpaceOnUse">
      <feOffset dx="-5" dy="-5" input="SourceAlpha"/>
      <feGaussianBlur stdDeviation="5" result="blur"/>
      <feFlood flood-color="#797979" flood-opacity="0.09"/>
      <feComposite operator="in" in2="blur"/>
      <feComposite in="SourceGraphic"/>
    </filter>
    <linearGradient id="linear-gradient" x1="1" y1="1" x2="0" gradientUnits="objectBoundingBox">
      <stop offset="0" stop-color="#242323"/>
      <stop offset="1" stop-color="#141414"/>
      <animateTransform attributeName="gradientTransform"
                        attributeType="XML"
                        type="rotate"
                        from="0 .5 .5"
                        to="180 .5 .5"
                        dur=".3s"
                        begin="indefinite"
                        fill="freeze"
                        id="circle-front-fwd" 
                        calcMode="spline"
                        keySplines="0.54 1 0 0.85"/>
      <animateTransform attributeName="gradientTransform"
                        attributeType="XML"
                        type="rotate"
                        from="180 .5 .5"
                        to="360 .5 .5"
                        dur=".3s"
                        begin="indefinite"
                        fill="freeze"
                        id="circle-front-bckw" 
                        calcMode="spline"
                        keySplines="0.54 1 0 0.85"/>
    </linearGradient>
    <filter id="ellypse_11" x="13" y="13" width="80" height="80" filterUnits="userSpaceOnUse">
      <feOffset dx="8" dy="8" input="SourceAlpha"/>
      <feGaussianBlur stdDeviation="5" result="blur-2"/>
      <feFlood flood-opacity="0.345"/>
      <feComposite operator="in" in2="blur-2"/>
      <feComposite in="SourceGraphic"/>
    </filter>
    <linearGradient id="linear-gradient-2" x1="1" y1="1" x2="0" gradientUnits="objectBoundingBox">
      <stop offset="0" stop-color="#151414"/>
      <stop offset="1" stop-color="#1f1f1f"/>
      <animateTransform attributeName="gradientTransform"
                        attributeType="XML"
                        type="rotate"
                        from="0 .5 .5"
                        to="-180 .5 .5"
                        dur=".3s"
                        begin="indefinite"
                        fill="freeze"
                        id="circle-back-fwd" 
                        calcMode="spline"
                        keySplines="0.54 1 0 0.85"/>
      <animateTransform attributeName="gradientTransform"
                        attributeType="XML"
                        type="rotate"
                        from="-180 .5 .5"
                        to="-360 .5 .5"
                        dur=".3s"
                        begin="indefinite"
                        fill="freeze"
                        id="circle-back-bckw" 
                        calcMode="spline"
                        keySplines="0.54 1 0 0.85"/>
    </linearGradient>
  </defs>
  <g id="Menu_Icon" data-name="Menu Icon" transform="translate(18 18)">
    <g id="Algo_Icon" data-name="Algo Icon" transform="translate(52 52) rotate(180)">
      <g transform="matrix(-1, 0, 0, -1, 70, 70)" filter="url(#ellypse_13)">
        <circle id="ellypse_13-2" data-name="ellypse 13" cx="25" cy="25" r="25" transform="translate(70 70) rotate(180)" fill="#242323"/>
      </g>
      <g transform="matrix(-1, 0, 0, -1, 70, 70)" filter="url(#ellypse_11)">
        <circle id="ellypse_11-2" data-name="ellypse 11" cx="25" cy="25" r="25" transform="translate(70 70) rotate(180)" fill="url(#linear-gradient)"/>
      </g>
      <circle id="ellypse_30" data-name="ellypse 30" cx="27" cy="27" r="27" transform="translate(-2 -2)" fill="url(#linear-gradient-2)"/>
      <circle id="ellypse_31" data-name="ellypse 31" cx="25" cy="25" r="25" fill="url(#linear-gradient)"/>
    </g>
    <g>
      <rect id="rectangle_4" data-name="rectangle 4" width="24" height="2" rx="1" fill="#f5d681"  transform="translate(15 20)">
      <animateTransform attributeName="transform"
                        attributeType="XML"
                        type="rotate"
                        from="0 12 1"
                        to="135 12 1"
                        dur=".3s"
                        begin="indefinite"
                        id="top-rect-rot-fwd" 
                        fill="freeze"
                        calcMode="spline"
                        keySplines="0.54 1 0 0.85"/>
      <animateTransform attributeName="transform"
                        attributeType="XML"
                        type="rotate"
                        from="135 12 1"
                        to="0 12 1"
                        dur=".3s"
                        begin="indefinite"
                        id="top-rect-rot-bckw" 
                        fill="freeze"
                        calcMode="spline"
                        keySplines="0.54 1 0 0.85"/>
      </rect>
      <animateTransform attributeName="transform"
                        attributeType="XML"
                        type="translate"
                        from="15 20"
                        to="15 27"
                        dur=".3s"
                        begin="indefinite"
                        id="top-rect-transl-fwd" 
                        fill="freeze"
                        calcMode="spline"
                        keySplines="0.54 1 0 0.85"/>
      <animateTransform attributeName="transform"
                        attributeType="XML"
                        type="translate"
                        from="15 27"
                        to="15 34"
                        dur=".3s"
                        begin="indefinite"
                        id="top-rect-transl-bckw" 
                        fill="freeze"
                        calcMode="spline"
                        keySplines="0.54 1 0 0.85"/>
    </g>
    <g>
      <rect id="rectangle_4-2" data-name="rectangle 4" width="16" height="2" rx="1" fill="#f5d681" transform="translate(19 27)">
      <animateTransform attributeName="transform"
                        attributeType="XML"
                        type="rotate"
                        from="0 8 1"
                        to="360 8 1"
                        dur=".3s"
                        begin="indefinite"
                        id="mid-rect-rot-fwd" 
                        fill="freeze"
                        calcMode="spline"
                        keySplines="0.54 1 0 0.85"/>
      <animateTransform attributeName="transform"
                        attributeType="XML"
                        type="rotate"
                        from="360 8 1"
                        to="0 8 1"
                        dur=".3s"
                        begin="indefinite"
                        id="mid-rect-rot-bckw" 
                        fill="freeze"
                        calcMode="spline"
                        keySplines="0.54 1 0 0.85"/>
      </rect>
      <animateTransform attributeName="transform"
                        attributeType="XML"
                        type="translate"
                        from="19 27"
                        to="19 27"
                        dur=".3s"
                        begin="indefinite"
                        id="mid-rect-transl-fwd" 
                        fill="freeze"
                        calcMode="spline"
                        keySplines="0.54 1 0 0.85"/>
      <animateTransform attributeName="transform"
                        attributeType="XML"
                        type="translate"
                        from="19 27"
                        to="19 27"
                        dur=".3s"
                        begin="indefinite"
                        id="mid-rect-transl-bckw" 
                        fill="freeze"
                        calcMode="spline"
                        keySplines="0.54 1 0 0.85"/>
      <animate id="mid-rect-fwd"
               attributeName="opacity"
               from="1" 
               to="0" 
               dur=".3s"
               begin="indefinite" 
               fill="freeze"
               calcMode="spline"
               keySplines="0.54 1 0 0.85"/> 
      <animate id="mid-rect-bckw"
               attributeName="opacity"
               from="0" 
               to="1" 
               dur=".3s"
               begin="indefinite" 
               fill="freeze"
               calcMode="spline"
               keySplines="0.54 1 0 0.85"/> 
    </g>
    <g>
      <rect id="rectangle_4-3" data-name="rectangle 4" width="24" height="2" rx="1" fill="#f5d681" transform="translate(15 34)">
      <animateTransform attributeName="transform"
                        attributeType="XML"
                        type="rotate"
                        from="0 12 1"
                        to="-135 12 1"
                        dur=".3s"
                        begin="indefinite"
                        id="bot-rect-rot-fwd" 
                        fill="freeze"
                        calcMode="spline"
                        keySplines="0.54 1 0 0.85"/>
      <animateTransform attributeName="transform"
                        attributeType="XML"
                        type="rotate"
                        from="-135 12 1"
                        to="0 12 1"
                        dur=".3s"
                        begin="indefinite"
                        id="bot-rect-rot-bckw" 
                        fill="freeze"
                        calcMode="spline"
                        keySplines="0.54 1 0 0.85"/>
      </rect>
      <animateTransform attributeName="transform"
                        attributeType="XML"
                        type="translate"
                        from="15 34"
                        to="15 27"
                        dur=".3s"
                        begin="indefinite"
                        id="bot-rect-transl-fwd" 
                        fill="freeze"
                        calcMode="spline"
                        keySplines="0.54 1 0 0.85"/>
      <animateTransform attributeName="transform"
                        attributeType="XML"
                        type="translate"
                        from="15 27"
                        to="15 20"
                        dur=".3s"
                        begin="indefinite"
                        id="bot-rect-transl-bckw" 
                        fill="freeze"
                        calcMode="spline"
                        keySplines="0.54 1 0 0.85"/>
    </g>
  </g>
</svg>

</template>

<script>
export default {
  data() {
    return {
      isPressed: false,
    }
  },
  computed: {
    isMenuOpen() {
      return this.$store.state.isMenuOpen;
    }

  },
  methods: {
    animate() {
      let end = this.isPressed ? 'bckw' : 'fwd';
      document.getElementById(`circle-front-${end}`).beginElement();
        document.getElementById(`circle-back-${end}`).beginElement();
        document.getElementById(`top-rect-rot-${end}`).beginElement();
        document.getElementById(`top-rect-transl-${end}`).beginElement();
        document.getElementById(`mid-rect-${end}`).beginElement();
        document.getElementById(`mid-rect-rot-${end}`).beginElement();
        document.getElementById(`mid-rect-transl-${end}`).beginElement();
        document.getElementById(`bot-rect-rot-${end}`).beginElement();
        document.getElementById(`bot-rect-transl-${end}`).beginElement();
    },
    rotate() {
      console.log("rotate");
      this.animate();
      this.isPressed = !this.isPressed;
      this.$store.dispatch('updateMenuOpen', this.isPressed);
    },
  },
  watch: {
    isMenuOpen() {
      if(this.isPressed === this.isMenuOpen)
        return;
    console.log("changed");
      this.animate();
      this.isPressed = this.isMenuOpen;
    }
  }
  
}
</script>

<style lang="scss" scoped>
</style>
