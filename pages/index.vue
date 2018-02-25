<template>
    <div class="container full">
        <nuxt-link to="/game">
            <img src="~/assets/img/splash.jpg" alt="" />
            <div class="text">Click To Proceed</div>
        </nuxt-link>
    </div>
</template>

<script>
    import config from '../assets/config.json';

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
                this.currentTime = 0;

                if (self.cnt < self.config.loopNum) {
                    let curNum = self.cnt + 1;

                    console.log('Loop #' + curNum +  '. Will play ' + (self.config.loopNum - curNum) + ' more times.');
                    self.audio.play();
                }
            }, false);

            this.audio.play();
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
    }

    .container.full img {
        width: 100%;
        height: 100%;
        cursor: pointer;
    }

    .container.full .text {
        position: absolute;
        width: 100%;
        bottom: 15px;
        margin: 0 auto;
        text-align: center;
        font-weight: bold;
        color: #fff;
        font-size: 2vw;
    }
</style>
