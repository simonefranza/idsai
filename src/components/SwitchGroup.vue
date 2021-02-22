<template>
  <div id="switchGroup">
    <div class="groupEl" v-for="(setting, index) in settings" :key="setting.value">
      <span class="switchSpan">
        <ToggleSwitch :darkTheme="darkTheme" v-model="switchData[index]" />
      </span>
      <span class="switchText">{{setting.text}}</span>
    </div>
  </div>
</template>

<script>
import ToggleSwitch from './ToggleSwitch.vue'
export default {
  props: {
    settings: {
      required: true,
    },
    darkTheme: {
      required: true,
    },
    value: {
      required: true,
    }
  },
  components: {
    ToggleSwitch
  },
  data() {
    return {
      switchData : [],
      switchTemp : [],
    }
  },
  model: {
    event: "changed"
  },
  watch: {
    switchData: function(newV) {
        if(newV.length === this.switchTemp.length)
        {
          let isEqual = true;
          for(let i = 0; i < newV.length; i++)
          {
            if(newV[i] !== this.switchTemp[i])
            {
              isEqual = false;
              break;
            }
          }
          if(isEqual)
            return;
        }

        let temp = [];
        this.switchData.forEach((el, index) => {
          if(!el)
            return;
          temp.push(this.settings[index]['value']);
        });

        this.switchTemp.splice(0, this.switchTemp.length, ...newV);
        this.$emit("changed", temp);
    },
    value: function() {
      let activeId = [];
      this.settings.forEach(() => activeId.push(false));
      this.value.forEach(el => {
        let id = -1;
        for(let [index, setting] of this.settings.entries())
        {
          if(setting['value'].localeCompare(el) == 0)
          {
            id = index;
            break;
          }
        }
        if(id === -1)
          return;
        activeId[id] = true;
      });
      this.switchData.splice(0, this.switchData.length, ...activeId);
    }
  },

}
</script>

<style scoped>
#switchGroup {
  margin-top: 10px;
  margin-bottom: 10px;
}

.groupEl {
  display: flex;
}
.switchText {
  margin-left: 10px;
}

.switchSpan {
  display: flex;
  align-items:center;
}

</style>
