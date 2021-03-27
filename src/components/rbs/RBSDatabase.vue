<template>
  <span>
  <b-card class="dataCard" 
    :bg-variant="!darkTheme ? 'light' : 'dark'"
    :text-variant="!darkTheme ? '' : 'white'"
    v-if="isWideDevice">
    <b-card-text>
      <RBSFacts :currentFacts="currentFacts"
          :mapFrom="mapFrom"
          @deleteFact="deleteFact"/>
      <br/>
      <RBSRules :rules="rules"
          :mapFrom="mapFrom"
          :ruleHovered="ruleHovered"
          @deleteRule="deleteRule"/>
    </b-card-text>
  </b-card>
  <div :class="['db-small', 
                isWiderThanHigher ? 'db-small-wider' : 'db-small-higher',
                darkTheme ? 'dark-db-theme' : 'light-db-theme']"
    v-else>
    <RBSFacts :currentFacts="currentFacts"
       :mapFrom="mapFrom"
       @deleteFact="deleteFact"/>
    <RBSRules :rules="rules"
       :mapFrom="mapFrom"
       :ruleHovered="ruleHovered"
       @deleteRule="deleteRule"/>
  </div>
  </span>
</template>

<script>
import RBSFacts from '@/components/rbs/RBSFacts.vue';
import RBSRules from '@/components/rbs/RBSRules.vue';

export default {
  components: {
    RBSFacts,
    RBSRules,
  },
  data() {
    return {
    }
  },
  props: {
    currentFacts : {required: true},
    rules : {required: true},
    mapFrom : {required: true},
    mapTo : {required: true},
    ruleHovered : {required: true},
  },
  computed: {
    darkTheme() {
      return this.$store.state.darkTheme;
    },
    isWideDevice() {
      return this.$store.state.isWideDevice;
    },
    isWiderThanHigher() {
      return this.$store.state.isWiderThanHigher;
    },
    windowWidth() {
      return this.$store.state.windowWidth;
    },
    windowHeight() {
      return this.$store.state.windowHeight;
    },
  },
  methods: {
    deleteFact(index) {
      this.$emit('deleteFact', index);
    },
    deleteRule(index) {
      this.$emit('deleteRule', index);
    }
  }
}
</script>

<style lang="scss" scoped>
.db-small{
  height: 100%;
  max-height: calc(100vh - 2.5rem);
  display: flex;
  justify-content: space-evenly;
  &-wider {
    flex-direction: column;
    padding-right: 1.25em;
  }
  &-higher {
    flex-direction: row;
    padding-bottom: 1.25em;
  }
}

</style>
