<template>
  <div class="about-body">
    <div class="about-content">
    <div class="about-images">
      <div class="social">
        <a href="https://www.linkedin.com/in/simone-franza-534962194" target="_blank">
          <img class="social-logo" 
             src="../assets/icons/linkedin_logo.svg"
             onclick=''
            alt="linkedin logo"/>
        </a>
        <a href="https://github.com/simonefranza" target="_blank">
          <img class="social-logo" src="../assets/icons/github_logo.svg"
            alt="github logo"/>
        </a>
      </div>
      <div>
        <img class="pic-img" src="../assets/simone.jpeg"
          alt="Picture of Simone Franza"/>
      </div>
      <div class="social">
        <a href="mailto: simonefranza3@gmail.com">
          <img class="social-logo" src="../assets/icons/at_icon.svg"
            alt="@ icon"/>
        </a>
      </div>
    </div>
    <div class="info-container">
      <div class="info-body">
        <p class="info-text">
        I am Simone<br/>an Italian guy currently studying computer science in Graz.
        </p>
        <p :class="['git-info', darkTheme ? 'dark-links' : 'light-links']">
        This project is hosted with ❤️ on 
        <a href="https://github.com/simonefranza/idsai/">Github</a>, so if you have an idea
        for a new feature or if you find a bug, feel free to open a new 
        <a href="https://github.com/simonefranza/idsai/issues">issue</a>!
        </p>
      </div>
    </div>
  </div>
  </div>
</template>

<script>
export default {
  computed: {
    darkTheme() {
     return this.$store.state.darkTheme;
    },
  }
}

</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
.about-body{
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: absolute;
}

.about-content {
  max-width: 1200px;
}

.info-container {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  margin-block: 2em;
}

.info-body{
  position: relative;
  max-width: 400px;
  width:80%;
}


.info-text{
  font-size: 1.5em;
}

.social-logo{
  width: 4em;
  border-radius: 4em;
  border: .4em solid black;
  background-color: black;
  position: relative;
  left: 50%;
  transform: translateX(-50%);
  -webkit-transition: width .7s cubic-bezier(.43,1.77,.11,.81);
  -moz-transition: width    .7s cubic-bezier(.43,1.77,.11,.81);
  -o-transition: width      .7s cubic-bezier(.43,1.77,.11,.81);
  transition: width         .7s cubic-bezier(.43,1.77,.11,.81);
}
.social-logo:hover{
  width: 5em;
  position: relative;
}

.social {
  height: 50%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 3em;
}

.social a{
  width: 4em;
  color: black;
}

.about-images {
  width: 100%;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: .5em;
}

.pic-img{
  width: calc(100% - 2em);
  max-width: 400px;
  border-radius: 50em;
  border: .5em solid black;
  position: relative;
  -webkit-transition: width .5s cubic-bezier(.41,2.03,.37,.65);
  -moz-transition: width    .5s cubic-bezier(.41,2.03,.37,.65);
  -o-transition: width      .5s cubic-bezier(.41,2.03,.37,.65);
  transition: width         .5s cubic-bezier(.41,2.03,.37,.65);
}

.pic-img:hover{
  width: calc(100%);
}

.empty-div {
  width: 4em;
}

.git-info {
  margin-inline: 10%;
}
.git-info a{
  font-weight: bold;
}

.light-links a, .light-links a:visited {
  color: $vue-primary;
  text-decoration:none;
}
.dark-links a, .dark-links a:visited {
  color: $secondary-dark;
  text-decoration:none;
}


</style>
