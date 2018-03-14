<template>
    <div class="container full">
        <nuxt-link to="/game">
            <img class="flag" src="~/assets/img/splash.jpg" alt="" />
            <img class="coat" src="~/assets/img/coat.png" alt="" />
            <div class="family">O'Brien Family Reunion Edition</div>
        </nuxt-link>
    </div>
</template>

<script>
    import config from '../static/config.json';

    export default {
        data() {
            return {
                config: config,
                audio: null,
                cnt: 0
            }
        },

        mounted() {
            let self = this;
            this.audio = new Audio(this.config.soundUrl);
            this.audio.volume = this.config.volume;

            this.audio.addEventListener('ended', function() {
                self.cnt++;

                if (self.cnt < self.config.loopNum) {
                    let curNum = self.cnt + 1;

                    console.log('Loop #' + curNum +  '. Will play ' + (self.config.loopNum - curNum) + ' more times.');
                    self.audio.play();
                }
            }, false);

            this.audio.play();

            // add event listeners
            window.addEventListener('keyup', function(e) {
                if (e.keyCode === 32){ // space bar
                    $nuxt.$router.push('/game');
                }
            });
        },

        destroyed() {
            this.audio.pause();
        }
    }
</script>

<style>
    .container.full {
        width: 100%;
        min-width: 100%;
        max-width: 100%;
        height: 100vh;
        padding: 0;
        position: relative;
    }

    .container.full img.flag {
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    .container.full img.coat {
        width: 14vw;
        margin: auto;
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
    }

    .container.full .family {
        position: absolute;
        bottom: 30px;
        width: 100%;
        margin: 0 auto;
        text-align: center;
        font-weight: bold;
        color: #fff;
        font-size: 4.5vw;
        text-shadow: 2px 4px 3px rgba(0,0,0,0.3);
    }
</style>
