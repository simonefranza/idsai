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
          <template #cell(0)="data">
            <span class="firstColumn">{{data.value}}</span>
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
    }
  },
  computed: {
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
        mat.push(newRow);
      });
      return mat;
    }
  },
  model: {
    event: "newMatrix"
  },
  methods: {
    emitChange: function(mat) {
      this.$emit("newMatrix", mat);
    },
  },
  watch: {
    value() {
      if(!this.value.length)
        this.reload = Math.random();
    }
  }
}
</script>

<style scoped lang="scss">
.firstColumn {
  font-weight: bold;
}
</style>
