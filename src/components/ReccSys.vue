<template>
  <div class="recc-sys">
    <b-table striped hover :items="finalTable" ></b-table>
    
    <div class="row">
      <div class="col">
      </div>
      <div class="col-2">
        User-based neighbours choice precision
      </div>
      <div class="col-8">
        <b-input-group prepend="-1" append="1" class="mt-3">
          <b-form-input v-b-tooltip.hover :title="neighbour_precisionUB" id="range-1" 
              v-model="neighbour_precisionUB" type="range" min="-1" max="1" step="0.01"></b-form-input>
        </b-input-group>
      </div>
      <div class="col">
      </div>
    </div>
    <div class="row">
      <div class="col">
      </div>
      <div class="col-2">
        Item-based neighbours choice precision
      </div>
      <div class="col-8">
        <b-input-group prepend="-1" append="1" class="mt-3">
          <b-form-input v-b-tooltip.hover :title="neighbour_precisionIB" id="range-1" 
              v-model="neighbour_precisionIB" type="range" min="-1" max="1" step="0.01"></b-form-input>
        </b-input-group>
      </div>
      <div class="col">
      </div>
    </div>

    <b-button variant="outline-primary" v-on:click = "showCF = !showCF">See results of collaborative filtering</b-button>
    <p v-if="isUBPossible && showCF">User-based collaborative filtering result (based on: {{ neighbourUsersUB }}): {{ userBasedPrediction }}</p>
    <p v-else-if="!isUBPossible && showCF">No users are similar enough, try changing the position of the slider</p>

    <p v-if="isIBPossible && showCF">Item-based collaborative filtering result (based on: {{ neighbourUsersIB }}): {{ itemBasedPrediciton }}</p>
    <p v-else-if="!isIBPossible && showCF">No items are similar enough, try changing the position of the slider</p>
  </div>
</template>

<script>
import Book from '../data/book.js'
import Person from '../data/person.js'
export default {
  data() {
    return {
      names: ["Emma", "Franz", "Paula", "Sebastian", "Hermine", "Cristoph"],
      bookNames : ["Gnadenlos", "Im Sturm", "Mit aller Gewalt", "Die Macht des Präsident",
        "Pflicht und Ehre"],
      neighbour_precisionUB: '0.5',
      neighbour_precisionIB: '0.5',
      showCF : false,
    }
  },
  computed: {
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
          var rand = Math.floor(Math.random() * 5) + 1; // TODO: like this only values 1 <= x <= 5
          book.addRating(pers, rand);
          pers.addRating(this.bookNames[i], rand);
        }
        books.push(book);
      }
      return books;
    },
    finalTable: function() {
      var list = [];
      var bookList = this.booksList;
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
            list[list.length - 1]['_cellVariants'] = { [bookList[j].getTitle()] : 'info' };
          }
        }
      }
      return list;
    },
    averages: function() {
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
    centered_vectors: function() {
      let centered_vectors = new Map();
      var persons = this.personList;
      for(var i = 0; i < persons.length; i++)
      {
        let centered = {};
        for(let [bookTitle, rating] of persons[i].getRatings())
        {
          var centered_vec = rating - this.averages.get(persons[i]);
          centered[bookTitle] = centered_vec;
        }
        centered_vectors.set(persons[i], centered);
      }
      console.log({centeredVec: centered_vectors});
      return centered_vectors;
    },
    similaritiesIB: function() {
      let similarities = new Map();
      let books = this.booksList;
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
          let centered_curr_person = this.centered_vectors.get(curr_person);
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
        let centered_first_p = this.centered_vectors.get(persons[0]);
        for(let bookTitle in centered_first_p)
        {
          var centered_vec_a = centered_first_p[bookTitle];
          var centered_vec_b = this.centered_vectors.get(persons[i])[bookTitle];
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
    neighbours_mapUB: function() {
      const neighbours = new Map([...this.centered_vectors].filter(([k, ]) => 
        this.similaritiesUB.get(k) >= this.neighbour_precisionUB));
      console.log({neighUB: neighbours});
      return neighbours;
    },
    neighbours_mapIB: function() {
      const neighbours = this.booksList.filter(b => 
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
      return parseFloat(prediction).toFixed(2);
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
      return parseFloat(prediction).toFixed(2);
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
    }
  }
}
</script>


<style  scoped>
.tooltip { top: 0; }
</style>
