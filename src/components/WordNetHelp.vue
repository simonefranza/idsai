<template>
<!--    <transition name="blur" mode="out-in">-->
  <div id="helpBlock" :class="['helpContainer', 'blurScreen']"
       @click="closeHelpMessage(true)">
    <b-card title="Help" 
            :bg-variant="darkTheme ? 'dark' : 'light'" 
            :text-variant="darkTheme ? 'white' : ''"
            :class="['helpCard', darkTheme ? 'helpCardShadowDark' : 'helpCardShadowLight']"
            @click="closeHelpMessage(false)"
            >
            <b-card-body class="cardBody">
            <b-card-sub-title :sub-title-text-variant="darkTheme ? 'light' : 'secondary'" class="mb-3 helpSubtitle"><b>Explore WordNet</b></b-card-sub-title>
            <b-card-text :class="[darkTheme ? 'darkText' : 'lightText']">
              <p>If you would like to fully explore WordNet,
              <a href="http://wordnetweb.princeton.edu/perl/webwn">here</a>
              you can find the original text-based interface of the WordNet project.
              </p>
            </b-card-text><br/>
              <b-card-sub-title :sub-title-text-variant="darkTheme ? 'light' : 'secondary'" class="mb-3 helpSubtitle"><b>How does this work?</b></b-card-sub-title>
              <b-card-text :class="[darkTheme ? 'darkText' : 'lightText']">
                <p>Every term in the WordNet database can have multiple meanings, for example 
                the word 'dog' as a noun can mean for instance dog as an animal
                or as an informal term for a man (like in the saying 'you lucky dog'), however 
                'dog' can be also be used as a verb with the meaning of 'to chase' (informal).
                Every term also has some words that are related to it like hypernyms, hyponyms, meronyms,
                holonyms, etc (take a look at the legend for some basic definitions of these words).
                In the case of 'dog' as an animal some of these would be 'Canine', 'puppy', 'flag' and 'pack' respectively.<br/>
                Whenever you enter a term in the input field, this is looked up in the WordNet database and
                all the existing meanings are displayed underneath the control panel.
                However since each word has the afore mentioned related terms it is possible to 
                recursively look up the related terms of the related terms of the searched word. 
                This is what the parameter "search depth" is for and as a consequence this also defines the size
                of the graph. For example with a depth of 1 the program will look for 
                the searched term, display all available meanings
                and for each meaning list the existing related terms. With a depth of 2
                you can also explore the related terms of the related terms by clicking on the '+' signs.<br/>
                Since this would be too much data to be displayed on a graph and the result
                would be a cluttered mess, we decided to show only a part of the informations.
                First of all near one of the existing meanings you can see a badge with the 
                text "Current", this means that this is the meaning currently displayed on the 
                graph to the right. You can switch between the different definitions, by clicking
                the button 'See graph'.<br/>
                Since each meaning contains many related terms, it wouldn't make sense
                to display all of it because the graph would still be too cluttered,
                so for every related term (i.e. for every hypernym, every hyponym, etc)
                only the first one of the group is display on the graph. For example 
                some hyponyms of the word 'dog' (as an animal) are 'canine', 'canid',
                'domestic animal' and 'domesticated animal', hovewer only 'canine' will
                be displayed on the graph.<br/>
                Avoid choosing a search depth of over 5 as the number of related terms
                grows exponentially and it will take a long time to load. Also as
                the graph grows it could be hard to find some nodes, so you can hover
                over a word in the search result and if it is present in the graph it will
                light up.
                </p>
              </b-card-text>
              </b-card-body>
    </b-card>
  </div>
  <!--    </transition>-->
</template>

<script>
export default {
  props: {
    darkTheme: {required: true,
      type: Boolean,
    }
  },
  computed: {
    ptrLegend() {
      let arr = [];
      arr.push({symbol: 'Hyper',  meaning: 'Hypernym',          definition: 'a word that is more general than a given word'});
      arr.push({symbol: 'iHyper', meaning: 'Instance Hypernym', definition: 'the type of an instance'});
      arr.push({symbol: 'Hypo',   meaning: 'Hyponym',           definition: 'a word that is more specific than a given word'});
      arr.push({symbol: 'iHypo',  meaning: 'Instance Hyponym',  definition: 'an occurrence of something'});
      arr.push({symbol: 'MH',     meaning: 'Member Holonym',    definition: 'concept B is a member of concept A'});
      arr.push({symbol: 'SH',     meaning: 'Substance Holonym', definition: 'concept-B is a substance of concept-A'});
      arr.push({symbol: 'PH',     meaning: 'Part Holonym',      definition: 'concept B is the whole where concept A is a part'});
      arr.push({symbol: 'MM',     meaning: 'Member Meronym',    definition: 'concept A is a member of concept B'});
      arr.push({symbol: 'SM',     meaning: 'Substance Meronym', definition: 'concept A is made of concept B'});
      arr.push({symbol: 'PM',     meaning: 'Part Meronym',      definition: 'concept A is a component of concept B'});
      return arr;
    }
  },
  methods: {
    closeHelpMessage(isParent)
    {
      this.$emit('closeHelp', isParent);
    }

  }
  
}
</script>

<style scoped lang="scss">
.helpContainer {
  position: fixed;
  z-index: 2000;
  top: 0;
  left: 0;
  height: 100vh;
  width: 100vw;
  display: flex;
  align-items: center;
  justify-content: center;
}
.helpCard {
  position:relative;
  max-width: 45rem;
  max-height: 75%;
  z-index: 2500;
  overflow-y: scroll;
}
.helpCardShadowDark{
  box-shadow: 0 0 7px 1px rgba($text-primary-dark, .2),;
}
.helpCardShadowLight{
  box-shadow: 0 0 7px 1px rgba($vue-primary, .2);
}
/* blur help message */
$blur-speed : .3s;
$blur-size: .2em;

.blurScreen {
  backdrop-filter: blur($blur-size);
}

.blur-enter-active, .blur-leave-active{
  transition: all $blur-speed ease-in-out;
}
.blur-enter-to, .blur-leave{
  backdrop-filter: blur($blur-size);
}
.blur-enter, .blur-leave-to{
  opacity: 0;
  transform: translate(0, -100%);
}
/* blur help message END*/

.legend, .helpSubtitle{
  text-align: left;
}

.helpCard p {
  line-height: 1.6em;
}
.cardBody {
 text-align: left;
}

</style>
