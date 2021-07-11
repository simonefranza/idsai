<template>
  <div class="recc-sys">
    <div class="row">
      <div 
        :class="{'text-card' : true,
                 'text-card-dark' : darkTheme,
                 'text-card-light' : !darkTheme, 'col-4': true, 'text-card-spaced': true}">
                 <h4 style="text-align: center; position: relative; z-index: 100" >Control Panel</h4>
        <div class="row">
          <div class="col-6 panelSwitches">
            <SwitchGroup :settings="settingsCol1" v-model="selectedSettingsCol1"/>
          </div>
          <div class="col-6 panelSwitches">
            <SwitchGroup :settings="settingsCol2" v-model="selectedSettingsCol2"/>
          </div>
        </div>
        <div class="precDiv">
          <span>User-based similarity threshold</span>
          <span>[{{neighbour_precisionUB}}]</span>
          <input type="range" min="-1.0" max="1.0" value="0.5" step="0.01" 
            v-model="neighbour_precisionUB" :class="['slider', darkTheme? 'darkSlider' : 'lightSlider']" id="range-1" v-b-tooltip.hover :title="neighbour_precisionUB"/>
        </div>
        <div class="precDiv">
          <span>Item-based similarity threshold</span>
          <span>[{{neighbour_precisionIB}}]</span>
          <input type="range" min="-1.0" max="1.0" value="0.5" step="0.01" 
            v-model="neighbour_precisionIB" :class="['slider', darkTheme? 'darkSlider' : 'lightSlider']" id="range-1" v-b-tooltip.hover :title="neighbour_precisionIB"/>
        </div>
      </div>

    <div 
        :class="{'text-card' : true,
                 'text-card-dark' : darkTheme,
                 'text-card-light' : !darkTheme, 'col': true, 'text-card-spaced': true}">
                 <h4 style="text-align: center; position: relative; z-index: 100" >Data</h4>
      <b-table striped hover :items="finalTable" v-bind:dark="darkTheme" style="z-index: 1">

          <template #cell()="data">
            <span v-if="editMatrixRow !== data.index || data.field.key == 'name'">
              {{data.value}}
            </span>
            <b-form-input v-else
                          size="sm"
                          :class="{'darkInputForm' : darkTheme, 'miniInput' : 'true', 'horizontallyCentered' : 'true'}" 
                          v-model="copyMatrix[data.index][data.field.key]" 
                          @keyup.enter="saveMatrixRow(data.index)"></b-form-input>
          </template>
          <template #cell(edit)="data">
              <b-icon icon="pencil-square" 
                      aria-hidden="true"
                      @click="startEditingRow(data.index)"
                      v-if="editMatrixRow !== data.index"
                      :class="['cyclesIconLeft', 
                              editMatrixRow !== data.index && 
                              editMatrixRow !== -1 ? 'iconDisabled' : 'iconEnabled', 
                                darkTheme ? 'iconDark' : 'iconLight', ]" ></b-icon>
              <b-icon icon="check-circle" 
                      aria-hidden="true" 
                      @click="saveMatrixRow(data.index)" 
                      :class="['cyclesIconLeft', invalidNewRow ? 'iconDisabled' : 'iconEnabled', darkTheme ? 'iconDark' : 'iconLight']" 
                      v-else
                      ></b-icon>
          </template>

      </b-table>
    </div>
    </div>
    <div class="row">
      <div class="col" v-if="!(selectedSettingsCol1.includes('avg') && selectedSettingsCol2.includes('norm') &&
                               selectedSettingsCol1.includes('ubsim') && selectedSettingsCol2.includes('ibsim'))"/>
      <div 
        :class="{'text-card' : true,
      'text-card-dark' : darkTheme,
      'text-card-light' : !darkTheme, 'col-2': true, 'text-card-spaced': true}"
      v-if="selectedSettingsCol1.includes('avg')">
      <h5 style="text-align: center; position: relative; z-index: 100" >Average ratings</h5>
        <b-table striped hover :items="averagesTable" v-bind:dark="darkTheme"/> 
      </div>
      <div 
        :class="{'text-card' : true,
      'text-card-dark' : darkTheme,
      'text-card-light' : !darkTheme, 'col-5': true, 'text-card-spaced': true}"
      v-if="selectedSettingsCol2.includes('norm')">
      <h5 style="text-align: center; position: relative; z-index: 100" >Normalised vectors</h5>
        <b-table striped hover :items="centeredVecTable" v-bind:dark="darkTheme"/> 
      </div>
      <div 
        :class="{'text-card' : true,
      'text-card-dark' : darkTheme,
      'text-card-light' : !darkTheme, 'col-2': true, 'text-card-spaced': true}"
      v-if="selectedSettingsCol1.includes('ubsim')">
      <h5 style="text-align: center; position: relative; z-index: 100" >User-based similarity</h5>
        <b-table striped hover :items="simUBTable" v-bind:dark="darkTheme"/> 
      </div>
      <div 
        :class="{'text-card' : true,
      'text-card-dark' : darkTheme,
      'text-card-light' : !darkTheme, 'col-2': true, 'text-card-spaced': true}"
      v-if="selectedSettingsCol2.includes('ibsim')">
      <h5 style="text-align: center; position: relative; z-index: 100" >Item-based similarity</h5>
        <b-table striped hover :items="simIBTable" v-bind:dark="darkTheme"/> 
      </div>
      <div class="col" v-if="!(selectedSettingsCol1.includes('avg') && selectedSettingsCol2.includes('norm') &&
                               selectedSettingsCol1.includes('ubsim') && selectedSettingsCol2.includes('ibsim'))"/>
    </div>

    <div class="row">
      <div class="col"/>
      <div
        :class="{'text-card' : true,
      'text-card-dark' : darkTheme,
      'text-card-light' : !darkTheme, 'col-2': true, 'text-card-spaced': true}"
      v-if="selectedSettingsCol1.includes('ubcf')">
      <h5 style="text-align: center; position: relative; z-index: 100" >User-based CF</h5>
      <p v-if="isUBPossible">{{userBasedPrediction}}<br/>(based on: {{ neighbourUsersUB }})</p>
    <p v-else-if="!isUBPossible">No users are similar enough, try changing the threshold</p>
  </div>

  <div 
    :class="{'text-card' : true,
  'text-card-dark' : darkTheme,
  'text-card-light' : !darkTheme, 'col-2': true, 'text-card-spaced': true}"
  v-if="selectedSettingsCol2.includes('ibcf')">
  <h5 style="text-align: center; position: relative; z-index: 100" >Item-based CF</h5>
  <p v-if="isIBPossible">{{itemBasedPrediciton}}<br/>(based on: {{ neighbourUsersIB }})</p>
<p v-else-if="!isIBPossible">No items are similar enough, try changing the threshold</p>
  </div>
  <div class="col"/>
</div>
  </div>
</template>

<script>
import Book from '../data/book.js'
import Person from '../data/person.js'
import SwitchGroup from '@/components/extra/SwitchGroup.vue'
export default {
  name: 'RecSys',
  components: {
    SwitchGroup
  },
  data() {
    return {
      test: false,
      test2: false,
      names: ["Emma", "Franz", "Paula", "Sebastian", "Hermine", "Cristoph"],
      bookNames : ["Gnadenlos", "Im Sturm", "Mit aller Gewalt", "Die Macht des Präsident",
        "Pflicht und Ehre"],
      neighbour_precisionUB: '0.5',
      neighbour_precisionIB: '0.5',
      showCF : false,
      selectedSettingsCol1 : [],
      selectedSettingsCol2 : [],
      allCol1Sett : ['avg', 'ubcf', 'ubsim'],
      allCol2Sett : ['ibcf', 'ibsim', 'norm'],
      allCol1Selected: false,
      allCol2Selected: false,
      settingsCol1 : [
        { text: 'Average ratings', value: 'avg' },
        { text: 'User-based similarity', value: 'ubsim' },
        { text: 'User-based CF', value: 'ubcf' },
        {text: "Toggle all", value: 'toggle' }
        ],
      settingsCol2 : [
        { text: 'Normalised vectors', value: 'norm' },
        { text: 'Item-based similarity', value: 'ibsim' },
        { text: 'Item-based CF', value: 'ibcf' },
      ],
      editMatrixRow: -1,
      tempMatrix: [],
      copyMatrix: [],
      updateTable: 0,
      
    }
  },
  computed: {
    darkTheme() {
      return this.$store.state.darkTheme;
    },
    book_missing_rating: function() {
      return this.bookNames[this.bookNames.length - 1];
    },
    person_missing_rating: function() {
      return this.personList[0];
    },
    personList:  function() {
      var persons =  [];
      for(var i = 0; i < this.names.length; i++)
      {
        var pers = new Person(this.names[i]);
        persons.push(pers);
      }
      return persons;
    },
    booksList: function() {
      var books = [];
      for(var i = 0; i < this.bookNames.length; i++)
      {
        var book = new Book(this.bookNames[i]);
        var loop_num = (i == this.bookNames.length - 1 ? this.personList.length - 1 : 
          this.personList.length);
        for(var j = this.names.length - loop_num; j < this.names.length; j++)
        {
          var pers = this.personList[j];
          var rand = Math.floor(Math.random() * 6); // TODO: like this only values 1 <= x <= 5
          book.addRating(pers, rand);
          pers.addRating(this.bookNames[i], rand);
        }
        books.push(book);
      }
      return books;
    },
    finalTable: function() {
      console.log("final");
      this.updateTable;
      var list = [];
      var bookList = this.tempMatrix;
      var ratings;

      for(var i = 0; i < this.names.length; i++)
      {
        list.push({name: this.personList[i].getName()});
        for(var j = 0; j < bookList.length; j++)
        {
          ratings = bookList[j].getRatings();
          var rating = ratings.has(this.personList[i]) ? ratings.get(this.personList[i]) : '?';

          list[list.length - 1][bookList[j].getTitle()] = rating;
          if(rating == '?')
          {
            list[list.length - 1]['_cellVariants'] = { [bookList[j].getTitle()] : this.darkTheme ? 'secondary' : 'info' };
          }
        }
      }
      let mat = [];
      list.forEach((row) => {
        console.log(row);
        row.edit = '';
        mat.push(row);
      });
      console.log(mat)
      return mat;
    },
    averages: function() {
      this.updateTable;
      var persons = this.personList;
      var averages = new Map();
      for(var i = 0; i < persons.length; i++)
      {
        const persons_ratings = persons[i].getRatings();
        //ignore book for which we are searching the rating
        const valid_ratings = new Map([...persons_ratings].filter(([k, ]) => 
          k.localeCompare(this.book_missing_rating)));

        const ratings = Array.from(valid_ratings.values());
        var avg = ratings.reduce((a,b) => a + b, 0) / ratings.length;
        averages.set(persons[i], avg);
      }
      console.log({avg: averages});
      return averages;
    },
    averagesTable: function() {
      let table = [];
      this.averages.forEach((avg, person) => {
        table.push({name: person.getName(), average: avg});
      });
      console.log(table);
      return table;
    },
    centeredVectors: function() {
      let centeredVectors = new Map();
      var persons = this.personList;
      for(var i = 0; i < persons.length; i++)
      {
        let centered = {};
        for(let [bookTitle, rating] of persons[i].getRatings())
        {
          var centered_vec = rating - this.averages.get(persons[i]);
          centered[bookTitle] = centered_vec;
        }
        centeredVectors.set(persons[i], centered);
      }
      console.log({centeredVec: centeredVectors});
      return centeredVectors;
    },
    centeredVecTable: function() {
      let table = [];
      this.centeredVectors.forEach((centeredRatings, person) => {
        let row = {};
        row['name'] = person.getName();
        let keys = Object.keys(centeredRatings);
        keys.forEach((key) => row[key] = centeredRatings[key]);
        table.push(row);
      });
      return table;
    },
    similaritiesIB: function() {
      let similarities = new Map();
      let books = this.tempMatrix;
      let missing_book = books[books.length - 1];
      for(let i = 0; i < books.length - 1; i++)
      {
        var numerator = 0;
        var denominator = 0;
        var sum_centered_a = 0;
        var sum_centered_b = 0;
        let current_book = books[i];
        for(let j = 0; j < this.personList.length; j++)
        {
          if(this.personList[j] === this.person_missing_rating)
            continue;

          let curr_person = this.personList[j];
          let centered_curr_person = this.centeredVectors.get(curr_person);
          let centered_vec_a = centered_curr_person[missing_book.getTitle()]; 
          let centered_vec_b = centered_curr_person[current_book.getTitle()];
          numerator += centered_vec_a * centered_vec_b;
          sum_centered_a += centered_vec_a ** 2;
          sum_centered_b += centered_vec_b ** 2;
        }

        denominator = Math.sqrt(sum_centered_a) * Math.sqrt(sum_centered_b);
        var sim = numerator / denominator;
        similarities.set(current_book, sim);
      }
      console.log({simIB: similarities});
      return similarities;
    },
    similaritiesUB: function() {
      var persons = this.personList;
      let similarities = new Map();
      for(var i = 1; i < persons.length; i++)
      {
        var numerator = 0;
        var denominator = 0;
        var sum_centered_a = 0;
        var sum_centered_b = 0;
        let centered_first_p = this.centeredVectors.get(persons[0]);
        for(let bookTitle in centered_first_p)
        {
          var centered_vec_a = centered_first_p[bookTitle];
          var centered_vec_b = this.centeredVectors.get(persons[i])[bookTitle];
          numerator += centered_vec_a * centered_vec_b;
          sum_centered_a += centered_vec_a ** 2;
          sum_centered_b += centered_vec_b ** 2;
        }

        denominator = Math.sqrt(sum_centered_a) * Math.sqrt(sum_centered_b);
        var sim = numerator / denominator;
        similarities.set(persons[i], sim);
      }
      console.log({simUB: similarities});
      return similarities;
    },
    simIBTable: function() {
      let table = [];
      this.similaritiesIB.forEach((sym, book) => table.push({book: book.getTitle(), similarity: sym.toFixed(4)}));
      return table;
    },
    simUBTable: function() {
      let table = [];
      this.similaritiesUB.forEach((sym, person) => table.push({name: person.getName(), similarity: sym.toFixed(4)}));
      return table;
    },
    neighbours_mapUB: function() {
      const neighbours = new Map([...this.centeredVectors].filter(([k, ]) => 
        this.similaritiesUB.get(k) >= this.neighbour_precisionUB));
      console.log({neighUB: neighbours});
      return neighbours;
    },
    neighbours_mapIB: function() {
      const neighbours = this.tempMatrix.filter(b => 
        this.similaritiesIB.get(b) >= this.neighbour_precisionIB);
      console.log({neighIB: neighbours});
      return neighbours;
    },
    itemBasedPrediciton: function() {
      let numerator = 0;
      let denominator = 0;
      for(let book of this.neighbours_mapIB)
      {
        numerator += this.similaritiesIB.get(book) * book.getRatings().get(this.person_missing_rating);
        denominator += this.similaritiesIB.get(book);
      }
      let prediction = numerator / denominator;
      console.log({IBPrediction: prediction});
      return +parseFloat(prediction).toFixed(2);
    },
    userBasedPrediction: function() {
      let numerator = 0;
      let denominator = 0;
      for(let [name, centered_values] of this.neighbours_mapUB)
      {
        numerator += this.similaritiesUB.get(name) * centered_values[this.book_missing_rating];
        denominator += this.similaritiesUB.get(name);
      }
      let prediction = this.averages.get(this.personList[0]);
      prediction += numerator / denominator;
      console.log({UBPrediction: prediction});
      return +parseFloat(prediction).toFixed(2);
    },
    neighbourUsersUB: function() {
      let persons = this.neighbours_mapUB.keys();
      let str = "";
      for(let person of persons)
      {
        str += person.getName() + ", ";
      }
      return str.slice(0, -2);
    },
    neighbourUsersIB: function() {
      let str = "";
      for(let book of this.neighbours_mapIB)
      {
        str += book.getTitle() + ", ";
      }
      return str.slice(0, -2);
    },
    isUBPossible: function() {
      return this.neighbours_mapUB.size != 0;
    },
    isIBPossible: function() {
      return this.neighbours_mapIB.length != 0;
    },
    invalidNewRow: function() {
      if(this.editMatrixRow === -1)
        return false;
      let val = Object.values(this.copyMatrix[this.editMatrixRow]);
      console.log();
      let numBooks = this.booksList.length;
      console.log("val", val.slice(1, 1 + numBooks));
      for(let el of val.slice(1, 1 + numBooks))
      {
        if(!parseInt(el) && el == "?")
          continue;

        if(isNaN(el) || !Number.isInteger(parseFloat(el)) || parseInt(el) < 0 || 
          parseInt(el) > 5)
          return true;
      }
      return false;
    },
    matrixRows: function() {
      return this.finalTable.length;
    },
    matrixCols: function() { 
      return 5;
    }
  },
  methods: {
    startEditingRow(row) {
      if(this.editMatrixRow !== -1)
        return;
      this.editMatrixRow = row;
    },
    regenTempMatrix() {
      this.tempMatrix = [];
      this.booksList.forEach(el => this.tempMatrix.push(el));
      //      for(let row = 0; row < this.matrixRows; row++) 
      //      {
      //        let rowArr = [];
      //        for(let col = 0; col < this.matrixCols; col++) 
      //        {
      //          rowArr.push(-1);
      //        }
      //        this.tempMatrix.push([...rowArr]);
      //      }
    },
    regenCopyMatrix() {
      this.copyMatrix = [];
      this.finalTable.forEach((el, ) => {
        let newRow = {};
        Object.entries(el).forEach(([key, val],) => {
          newRow[key] = val;
        });
        this.copyMatrix.push(newRow);
      });
    },
    saveMatrixRow(row) {
      if(this.invalidNewRow)
        return;
      let values = Object.entries(this.copyMatrix[row]);
      let userName = values[0][1];
      let numEl = values.length;
      values.forEach(([, val],index) => {
        if(index < 1 || index >= numEl - 1 || isNaN(val))
          return;
        console.log(val);
        let newVal = parseInt(val);
        console.log(val, newVal);
        let book = this.tempMatrix[index-1];
        console.log(book);
        let person = null;

        console.log(book.getRatings().entries());
        for(let [personTemp, rating] of book.getRatings().entries())
        {
          console.log(personTemp, rating);
          console.log(personTemp.getName(), userName, personTemp.getName() == userName);
          if(personTemp.getName() == userName)
          {
            person = personTemp;
            break;
          }
        }
        console.log(person);
        person.addRating(book.getTitle(), newVal);
        console.log(person);
        book.getRatings().set(person, newVal);
        console.log("new Rat", book.getRatings().get(person));
        console.log(this.tempMatrix);
        this.updateTable = Math.random();
        //        if(this.matrix[row][index] !== newVal)
        //          this.tempMatrix[row].splice(index, 1, newVal);
      });
      this.editMatrixRow = -1;
    }
  },
  watch :{
    selectedSettingsCol2(newVal)
    {
      let temp = [...newVal];
      temp.sort();
      if(this.allCol2Sett.length !== temp.length)
      {
        this.allCol2Selected = false;
      }
      else
      {
        let isEqual = true;
        this.allCol2Sett.sort();
        this.allCol2Sett.forEach((word, idx) => {
          isEqual = temp[idx].localeCompare(word) ? false : isEqual;});
        this.allCol2Selected = isEqual;
      }

      if(this.allCol1Selected && this.allCol2Selected && !this.selectedSettingsCol1.includes("toggle"))
      {
        this.selectedSettingsCol1.push("toggle");
      }
      else if(this.selectedSettingsCol1.includes("toggle") && !(this.allCol1Selected && this.allCol2Selected)) 
      {
        let id = this.selectedSettingsCol1.indexOf("toggle");
        this.selectedSettingsCol1.splice(id, 1);
      }
    },
    selectedSettingsCol1(newVal, oldVal)
    {
      if(newVal.includes("toggle") && !oldVal.includes("toggle"))
      {
        this.selectedSettingsCol2 = this.allCol2Sett.slice();
        this.selectedSettingsCol1.push(...this.allCol1Sett);
        this.allCol1Selected= true;
        this.allCol2Selected= true;
        return;
      }
      else if(oldVal.includes("toggle") && !newVal.includes("toggle"))
      {
        this.selectedSettingsCol1.splice(0, this.selectedSettingsCol1.length);
        this.selectedSettingsCol2.splice(0, this.selectedSettingsCol2.length);
        this.allCol1Selected = false;
        this.allCol2Selected = false;
        return;
      }
      let temp = [...newVal];
      temp.sort();
      this.allCol1Sett.sort();
      let isEqual = true;
      this.allCol1Sett.forEach(word => {
        isEqual = temp.includes(word) ? isEqual : false;});
      this.allCol1Selected = isEqual;

      if(this.allCol1Selected && this.allCol2Selected && !this.selectedSettingsCol1.includes("toggle"))
      {
        this.selectedSettingsCol1.push("toggle");
      }
      else if(this.selectedSettingsCol1.includes("toggle") && !(this.allCol1Selected && this.allCol2Selected)) {
        let id = this.selectedSettingsCol1.indexOf("toggle");
        this.selectedSettingsCol1.splice(id, 1);
      }
    }
  },
  created() {
    this.regenTempMatrix();
    this.regenCopyMatrix();
  }
}
</script>

<style scoped lang="scss">
.tooltip { 
  top: 0; 
}

.ctrlPanel {
  text-align:left;
}

.precDiv {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
</style>
