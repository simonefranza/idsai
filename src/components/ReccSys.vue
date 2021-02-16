<template>
  <div class="recc-sys">
    <b-table striped hover :items="finalTable" ></b-table>
    
    <div class="row">
      <div class="col">
      </div>
      <div class="col-2">
        Neighbours choice precision
      </div>
      <div class="col-8">
        <b-input-group prepend="-1" append="1" class="mt-3">
          <b-form-input v-b-tooltip.hover :title="neighbour_precision" id="range-1" 
              v-model="neighbour_precision" type="range" min="-1" max="1" step="0.01"></b-form-input>
        </b-input-group>
      </div>
      <div class="col">
      </div>
    </div>

    <b-button variant="outline-primary" v-on:click = "showCF = !showCF">Toggle view user-based CF</b-button>
    <p v-if="isCFPossible && showCF">User-based collaborative filtering result (based on: {{ neighbourUsers }}): {{ userBasedPrediction }}</p>
    <p v-else-if="!isCFPossible">No users are similar enough, try changing the position of the slider</p>
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
      neighbour_precision: '0.5',
      showCF : false,
    }
  },
  computed: {
    searched_book: function() {
      return this.bookNames[this.bookNames.length - 1];
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
    genBooks: function() {
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
      var bookList = this.genBooks;
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
          k.localeCompare(this.searched_book)));

        const ratings = Array.from(valid_ratings.values());
        var avg = ratings.reduce((a,b) => a + b, 0) / ratings.length;
        averages.set(persons[i].getName(), avg);
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
          var centered_vec = rating - this.averages.get(persons[i].getName());
          centered[bookTitle] = centered_vec;
        }
        centered_vectors.set(persons[i].getName(), centered);
      }
      console.log({centeredVec: centered_vectors});
      return centered_vectors;
    },
    similarities: function() {
      var persons = this.personList;
      let similarities = new Map();
      for(var i = 1; i < persons.length; i++)
      {
        var numerator = 0;
        var denominator = 0;
        var sum_centered_a = 0;
        var sum_centered_b = 0;
        let centered_first_p = this.centered_vectors.get(persons[0].getName());
        for(let bookTitle in centered_first_p)
        {
          var centered_vec_a = centered_first_p[bookTitle];
          var centered_vec_b = this.centered_vectors.get(persons[i].getName())[bookTitle];
          numerator += centered_vec_a * centered_vec_b;
          sum_centered_a += centered_vec_a ** 2;
          sum_centered_b += centered_vec_b ** 2;
        }

        denominator = Math.sqrt(sum_centered_a) * Math.sqrt(sum_centered_b);
        var sim = numerator / denominator;
        console.log({num: numerator, denom:denominator, sim: sim});
        similarities.set(persons[i].getName(), sim);
      }
      console.log(similarities);
      return similarities;
    },
    neighbours_map: function() {
      const neighbours = new Map([...this.centered_vectors].filter(([k, ]) => 
        this.similarities.get(k) >= this.neighbour_precision));
      console.log(neighbours);
      return neighbours;
    },
    userBasedPrediction: function() {
      let numerator = 0;
      let denominator = 0;
      for(let [name, centered_values] of this.neighbours_map)
      {
        numerator += this.similarities.get(name) * centered_values[this.searched_book];
        denominator += this.similarities.get(name);
      }
      let prediction = this.averages.get(this.personList[0].getName());
      console.log({num: numerator, denom: denominator, pred: prediction, div: numerator/denominator});
      prediction += numerator / denominator;
      return parseFloat(prediction).toFixed(2);
    },
    neighbourUsers: function() {
      let names = this.neighbours_map.keys();
      let str = "";
      for(let name of names)
      {
        str += name + ", ";
        console.log(str);
      }
      return str.slice(0, -2);
    },
    isCFPossible: function() {
      return this.neighbours_map.size != 0;
    }
  }
}
</script>


<style  scoped>
.tooltip { top: 0; }
</s
ktyle>
