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
                      :class="['cyclesIconLeft', invalidNames ? 'iconDisabled' : 'iconEnabled', darkTheme ? 'iconDark' : 'iconLight', 'verticallyCentered']" 
                      v-else
                      ></b-icon>
           </template>
          
          <template #head()="data">
            <span v-if="!editNodeNames">{{savedNames[parseInt(data.column)-1]}}</span>
            <b-form-input v-else
                          :class="{'darkInputForm' : darkTheme, 'horizontallyCentered' : 'true'}"
                          v-model="savedNames[parseInt(data.column) - 1]" 
                          placeholder="Type or cancel" 
                          @keyup.enter="saveNodeNames()"></b-form-input>
          </template>

          <template #cell(0)="data">
            <span class="firstColumn">{{savedNames[parseInt(data.value)-1]}}</span>
          </template>


          <template #cell()="data">
            <span @mouseenter="hoverData({row:data.index + 1,
              col:parseInt(data.field.key)})"
              @mouseleave="leftField"
                      v-if="editMatrixRow !== data.index || !(parseInt(data.field.key) - 1 > data.index)">
              {{data.value}}
            </span>
            <b-form-input v-else
                          size="sm"
                          :class="{'darkInputForm' : darkTheme, 'miniInput' : 'true', 'horizontallyCentered' : 'true'}" 
                          v-model="copyMatrix[data.index][data.field.key]" 
                          @keyup.enter="saveMatrixRow(data.index)"></b-form-input>
          </template>

          <template #cell(edit)="data">
            <span v-if="data.index !== matrixSize - 1">
              <b-icon icon="pencil-square" 
                      aria-hidden="true"
                      @click="startEditingRow(data.index)"
                      v-if="editMatrixRow !== data.index"
                      :class="['cyclesIconLeft', 
                                editMatrixRow !== data.index && editMatrixRow !== -1 ? 'iconDisabled' : 'iconEnabled', 
                                darkTheme ? 'iconDark' : 'iconLight', ]" ></b-icon>
              <b-icon icon="check-circle" 
                      aria-hidden="true" 
                      @click="saveMatrixRow(data.index)" 
                      :class="['cyclesIconLeft', invalidNewRow ? 'iconDisabled' : 'iconEnabled', darkTheme ? 'iconDark' : 'iconLight']" 
                      v-else
                      ></b-icon>
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
      tempMatrix: [],
      copyMatrix: [],
      editMatrixRow : -1,
    }
  },
  computed: {
    nodeNames() {
      let arr = {};
      return arr;
    },

    matrix: function() {
      let mat = [];
      for(let row = 0; row < this.matrixSize; row++)
      {
        mat.push([]);
        for(let col = 0; col < this.matrixSize; col++)
        {
          mat[row].push(0);
          if(col < row)
            mat[row][col] = mat[col][row];
          else if(col > row && 
                  this.tempMatrix && 
                  this.tempMatrix.length > row &&
                  this.tempMatrix[row].length > col && 
                  this.tempMatrix[row][col] !== -1)
          {
            mat[row][col] = this.tempMatrix[row][col];
          }
          else if(this.copyMatrix.length > row && Object.values(this.copyMatrix[row]).length > col)
          {
            let val = parseInt(Object.values(this.copyMatrix[row])[col]);
            mat[row][col] = val ? val : 0;
          }
          else if(col > row && 
                  this.tempMatrix && 
                  this.tempMatrix.length > row && 
                  this.tempMatrix[row].length > col &&
                  this.tempMatrix[row][col] === -1)
          {
            mat[row][col] = Math.random() >= 0.5 ? 1 : 0;
          }
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
    },
    invalidNames() {
      if(!this.editNodeNames)
        return false;

      for(let [index, name] of this.savedNames.entries())
      {
        let currId = this.savedNames.indexOf(name.trim());
        if((currId !== index && currId !== -1) || !name.trim())
          return true;
      }
      return false;
    },
    invalidNewRow() {
      if(this.editMatrixRow === -1)
        return false;
      let val = Object.values(this.copyMatrix[this.editMatrixRow]);
      for(let el of val)
      {
        if(!parseInt(el))
          continue;
        if(isNaN(el) || !Number.isInteger(parseFloat(el)) || parseInt(el) < 0 || 
          parseInt(el) > 1)
          return true;
      }
      return false;
    }
  },
  model: {
    event: "newMatrix"
  },
  methods: {
    startEditingRow(row) {
      if(this.editMatrixRow !== -1)
        return;
      this.editMatrixRow = row; 
    },
    saveNodeNames() {
      if(this.invalidNames)
        return;
      this.savedNames = this.savedNames.map(el => el.trim());
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
    },
    regenTempMatrix() {
      this.tempMatrix = [];
      for(let row = 0; row < this.matrixSize; row++) 
      {
        let row = [];
        for(let col = 0; col < this.matrixSize; col++)
          row.push(-1);
        this.tempMatrix.push([...row]);
      }
    },
    regenCopyMatrix() {
      this.copyMatrix = [];
      this.matrix.forEach(row => {
        let obj = {};
        row.forEach((el, index) => {
          obj[this.savedNames[index]] = el;
        });
        this.copyMatrix.push(obj);
      });
    },
    saveMatrixRow(row) {
      if(this.invalidNewRow)
        return;
      Object.entries(this.copyMatrix[row]).forEach(([key, val],index) => {
        let newVal = parseInt(val);
        if(!newVal)
        {
          newVal = 0;
          this.copyMatrix[row][key] = newVal;
        }
        if(this.matrix[row][index] !== newVal)
          this.tempMatrix[row].splice(index, 1, newVal);
      });
      this.editMatrixRow = -1;
    },
  },
  watch: {
    value() {
      if(!this.value.length)
        this.reload = Math.random();
    },
    matrix() {
//      this.savedNames = [];
//      for(let i = 1; i <= this.matrixSize; i++)
//        this.savedNames.push(i.toString());
    },
    matrixSize() {
      this.regenTempMatrix();
      this.savedNames = [];
      for(let i = 1; i <= this.matrix.length; i++)
        this.savedNames.push(i.toString());
      this.regenCopyMatrix();
    },
  },
  created() {
    this.regenTempMatrix();
    for(let i = 1; i <= this.matrix.length; i++)
      this.savedNames.push(i.toString());
    this.regenCopyMatrix();
    this.$emit("newNodeNames", this.savedNames);
  }
}
</script>


<style scoped lang="scss">
.firstColumn {
  font-weight: bold;
}
</style>
