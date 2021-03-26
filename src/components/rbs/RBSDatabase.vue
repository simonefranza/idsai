<template>
  <b-card class="dataCard" 
    :bg-variant="!darkTheme ? 'light' : 'dark'"
    :text-variant="!darkTheme ? '' : 'white'">
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
    }
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
