<template>
  <div>
    <b-card title="Adjacency Matrix" 
            :bg-variant="!darkTheme ? 'light' : 'dark'" 
            :text-variant="!darkTheme ? '' : 'white'">
        <b-table striped hover 
          :items="printableMatrix" 
          :dark="darkTheme" >

          <template #head(0)="">
            <span />
          </template>

          <template #head(edit)="">
              <b-icon icon="pencil-square" 
                      aria-hidden="true" 
                      @click="editNodeNames = !editNodeNames"
                      :class="['cyclesIconLeft', 'iconEnabled', darkTheme ? 'iconDark' : 'iconLight']" 
                      v-if="!editNodeNames"></b-icon>
              <b-icon icon="check-circle" 
                      aria-hidden="true" 
                      @click="saveNodeNames()" 
                      :class="['alignMiddle', 'cyclesIconLeft', 'iconEnabled', darkTheme ? 'iconDark' : 'iconLight']" 
                      v-else
                      ></b-icon>
           </template>
          
          <template #head()="data">
            <span v-if="!editNodeNames">{{savedNames[parseInt(data.column)-1]}}</span>
            <span v-else>
              <b-form-input :class="{'darkInputForm' : darkTheme}" 
                  v-model="savedNames[parseInt(data.column) - 1]" 
                  placeholder="Type or cancel" 
                  @keyup.enter="saveNodeNames()"></b-form-input>
            </span>
          </template>

          <template #cell(0)="data">
            <span class="firstColumn">{{savedNames[parseInt(data.value)-1]}}</span>
          </template>

          <template #cell(edit)="">
              <b-icon icon="pencil-square" 
                      aria-hidden="true" 
                      :class="['cyclesIconLeft', 'iconEnabled', darkTheme ? 'iconDark' : 'iconLight']" ></b-icon>
          </template>

          <template #cell()="data">
            <span @mouseenter="hoverData({row:data.index + 1,
              col:parseInt(data.field.key)})"
              @mouseleave="leftField">
              {{data.value}}
            </span>
          </template>
        </b-table>
    </b-card>
  </div>
</template>

<script>
export default {
  props: {
    darkTheme: {
      required: true,
      type: Boolean,
    },
    matrixSize: {
      required: true,
      type: Number,
    },
    value : {
      required: true,
    }

  },
  data() {
    return {
      reload: 0,
      editNodeNames: false,
      savedNames: [],
    }
  },
  computed: {
    nodeNames() {
      let arr = {};
      return arr;
    },
    matrix: function() {
      this.reload;
      let mat = [];
      for(let row = 0; row < this.matrixSize; row++)
      {
        mat.push([]);
        for(let col = 0; col < this.matrixSize; col++)
        {
          mat[row].push(0);
          if(col < row)
            mat[row][col] = mat[col][row];
          else if(col > row)
            mat[row][col] = Math.random() >= 0.5 ? 1 : 0;
        }
      }
      this.emitChange(mat);
      return mat;
    },
    printableMatrix: function() {
      let mat = [];
      this.matrix.forEach((row, rowNum) => {
        let newRow = {'0': rowNum + 1};
        row.forEach((el, colNum) => {
          newRow[(colNum+1).toString()] = el;
        });
        newRow.edit = '';
        mat.push(newRow);
      });
      return mat;
    }
  },
  model: {
    event: "newMatrix"
  },
  methods: {
    saveNodeNames() {
      this.editNodeNames = false;
      this.$emit("newNodeNames", this.savedNames);
    },
    emitChange: function(mat) {
      this.$emit("newMatrix", mat);
    },
    hoverData(e) {
      this.$emit('hoverElement', e); 
    },
    leftField() {
      this.$emit('hoverElement', {row: -1, col: -1}); 
    }
  },
  watch: {
    value() {
      if(!this.value.length)
        this.reload = Math.random();
    },
    matrix() {
      this.savedNames = [];
      for(let i = 1; i <= this.matrix.length; i++)
        this.savedNames.push(i.toString());
    }
  },
  created() {
    for(let i = 1; i <= this.matrix.length; i++)
      this.savedNames.push(i.toString());
    this.$emit("newNodeNames", this.savedNames);
  }
}
</script>

<style scoped lang="scss">
.firstColumn {
  font-weight: bold;
}
</style>
