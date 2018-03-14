<template>
    <div>
        <template v-if="!this.onFinalJeopardy">
            <div class="container full" v-if="!showQuestion">
                <div class="row" :class="{category: parseInt(rowAmount) === 0, questions: parseInt(rowAmount) !== 0}" v-for="(dataArr, rowAmount) in myJson" :key="rowAmount">
                    <div class="col" v-for="(data, index) in dataArr" :key="index" @click="openQuestion(rowAmount, index)">
                        <template v-if="parseInt(rowAmount) === 0">
                            {{ data }}
                        </template>
                        <template v-else>
                            <span v-show="data.show">${{ rowAmount }}</span>
                        </template>
                    </div>
                </div>
            </div>
            <div class="container full blue-bg" v-else>
                <span v-if="questionsLeft > 0" class="oi oi-arrow-thick-left dir back" @click="clearQuestion()"></span>
                <span v-else class="oi oi-arrow-thick-right dir forward" @click="goToFinalJeopardy()"></span>
                <div class="question" :style="{ fontSize: getFontSize(curQuestion) }">{{ curQuestion }}</div>

                <div class="card fade-in" v-if="showAnswer">
                    <div class="card-body">{{ curAnswer }}</div>
                </div>

                <span class="oi oi-target show" @click="showAnswer = true"></span>
            </div>
        </template>
        <div class="container full blue-bg" v-else>
            <template v-if="showEndingText">
                <img class="dancers" src="~/assets/img/dancers.gif" alt="" />
                <div class="question final fade-in">{{ config.endText }}</div>
            </template>
            <template v-else>
                <template v-if="!showFinalAnswer">
                    <div class="final-title" v-if="showSpin">Final Jeopardy</div>
                    <div class="question fade-in" v-if="!showSpin">{{ finalJeopardyQuestion }}</div>
                </template>

                <iframe v-else
                        :src="'https://www.youtube.com/embed/' + config.videoId + '?autoplay=1&rel=0&showinfo=0&iv_load_policy=3'">
                </iframe>
                <!--
                <youtube v-else
                        :video-id="config.videoId"
                        :player-vars="config.videoOptions"
                        @ended="onEnded"
                        :class="{ 'fade-out': showEndingText }">
                </youtube>
                -->
            </template>
        </div>
    </div>
</template>

<script>
    import jsonData from '../../static/data.json';
    import config from '../../static/config.json';

    export default {
        data() {
            return {
                myJson: jsonData,
                config: config,
                showQuestion: false,
                curQuestion: '',
                curAnswer: '',
                showAnswer: false,
                prevQuestion: {},
                questionsLeft: 0,
                onFinalJeopardy: false,
                finalJeopardyQuestion: config.finalJeopardyQuestion,
                showFinalAnswer: false,
                showEndingText: false,
                showSpin: true
            }
        },

        mounted() {
            let self = this;

            let cnt = 0;

            Object.keys(this.myJson).forEach(key => {
                if (key !== '0') {
                    this.myJson[key].forEach(item => {
                        if (item.show) {
                            cnt++;
                        }
                    });
                }
            });

            this.questionsLeft = cnt;

            // add event listeners
            window.addEventListener('keyup', function(e) {
                if (self.questionsLeft > 0) {
                    if (e.keyCode === 32){ // space bar
                        self.showAnswer = true;
                    } else if (e.key === "Backspace" || e.key === "Delete") { // backspace and delete
                        self.showAnswer = false;
                    } else if (e.keyCode === 37) { // left arrow (go back to grid)
                        self.clearQuestion();
                    } else if (e.keyCode === 39) { // right arrow (redo last question)
                        self.getPreviousQuestion();
                    } else if (e.keyCode === 17) { // left control (for going back to home page)
                        $nuxt.$router.push('/');
                    } else if (e.keyCode === 70) {
                        self.goToFinalJeopardy();
                    }
                }
            });
        },

        methods: {
            openQuestion(key, index, force = false) {
                let keyCheck = parseInt(key);
                let cardObj = this.myJson[keyCheck][index];

                if (keyCheck !== 0 && cardObj.show || keyCheck !== 0 && force) {
                    this.questionsLeft--;

                    cardObj.amount = keyCheck;
                    cardObj.show = false;
                    this.showQuestion = true;
                    this.curQuestion = cardObj.question;
                    this.curAnswer = cardObj.answer;

                    this.prevQuestion.key = key;
                    this.prevQuestion.index = index;

                    console.log(this.questionsLeft + ' questions left.');
                }
            },

            getPreviousQuestion() {
                this.openQuestion(this.prevQuestion.key, this.prevQuestion.index, true);
            },

            clearQuestion() {
                this.showQuestion = false;
                this.curQuestion = '';
                this.curAnswer = '';
                this.showAnswer = false;
            },

            goToFinalJeopardy() {
                this.onFinalJeopardy = true;

                setTimeout(() => {
                    this.showSpin = false;

                    let self = this;
                    let audio = new Audio(this.config.soundUrl);
                    audio.volume = this.config.volume;
                    audio.play();

                    // add event listeners
                    window.addEventListener('keyup', function(e) {
                        if (e.keyCode === 96){ // num pad 0
                            audio.pause();
                        } else if (e.keyCode === 105) { // num pad 9
                            self.showFinalAnswer = true;
                        } else if (e.keyCode === 103) { // num pad 7
                            self.onEnded();
                        }
                    });
                }, 1500);
            },

            onEnded() {
                // show final text
                this.showEndingText = true;

                // play music
                let audio = new Audio('/sound/irish_jigs.mp3');
                audio.volume = this.config.endVolume;
                audio.play();
            },

            getFontSize(question) {
                const len = question.length;

                console.log(len);

                if (len > 400) {
                    return '2.5vw';
                } else if (len > 350) {
                    return '3vw';
                } else if (len > 250) {
                    return '3vw';
                } else if (len > 150) {
                    return '3.2vw';
                }

                return '4vw';
            }
        }
    }
</script>

<style>
    body {
        background: #000;
    }

    span.oi.dir {
        color: #fff;
        cursor: pointer;
        position: absolute;
        top: 15px;
    }

    span.oi.back {
        left: 15px;
    }

    span.oi.forward {
        right: 15px;
    }

    span.oi.show {
        cursor: pointer;
        position: absolute;
        font-size: 12px;
        bottom: 15px;
        left: 15px;
        top: inherit;
    }

    .container.full {
        width: 100%;
        min-width: 100%;
        max-width: 100%;
        padding: 10px;
        height: 100vh;
        position: relative;
    }

    .container .row {
        margin: 0;
        height: 16.67%;
    }

    .dancers {
        position: absolute;
        top: 20px;
        left: 0;
        right: 0;
        margin: auto;
    }

    .container > .row > div.col {
        background-color: #0000a6;
        margin: 0 8px 8px 0;
        padding: 15px;
        text-align: center;
        text-transform: uppercase;
        font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 1.8vw;
        font-weight: bold;
        color: #d69136;
        display: flex;
        align-items: center;
        justify-content: center;
        word-wrap: break-word;
    }

    .container > .row.category > div.col {
        color: #ace8fa;
        height: 92%;
    }

    .container > .row.questions > div.col {
        font-size: 4.3vw;
        cursor: pointer;
    }

    .blue-bg {
        background-color: #0000a6;
    }

    .final-title {
        font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        line-height: 120%;
        font-weight: bold;
        font-size: 4vw;
        text-transform: uppercase;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        text-shadow: 4px 4px 4px #000;
        padding: 400px;
        margin-top: -25px;
        animation: grow 1s;
    }

    @keyframes grow {
        from {
            transform: scale(0);
        }
        to {
            transform: scale(1);
        }
    }

    .question {
        height: 100%;
        font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        line-height: 120%;
        font-weight: bold;
        font-size: 4vw;
        text-transform: uppercase;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        text-shadow: 4px 4px 4px #000;
        padding: 400px;
        margin-top: -25px;
    }

    .question.final {
        font-size: 3.6vw;
        margin-top: 0;
    }

    .card {
        width: 50%;
        margin: -140px auto;
    }

    .card > .card-body {
        background: #00005c;
        /*background: #0000a6;*/
        color: #fff;
        border: 3px solid #fff;
        font-weight: bold;
        text-transform: uppercase;
        font-size: 2.5vw;
        text-shadow: 4px 4px 4px #000;
        text-align: center;
    }

    iframe {
        position: absolute;
        width: 100%;
        height: 100%;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        border: none;
    }

    @-webkit-keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @-moz-keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
    @keyframes fadeIn { from { opacity:0; } to { opacity:1; } }

    .fade-in {
        opacity:0;  /* make things invisible upon start */
        -webkit-animation:fadeIn ease-in 1;  /* call our keyframe named fadeIn, use animattion ease-in and repeat it only 1 time */
        -moz-animation:fadeIn ease-in 1;
        animation:fadeIn ease-in 1;

        -webkit-animation-fill-mode:forwards;  /* this makes sure that after animation is done we remain at the last keyframe value (opacity: 1)*/
        -moz-animation-fill-mode:forwards;
        animation-fill-mode:forwards;

        -webkit-animation-duration:1s;
        -moz-animation-duration:1s;
        animation-duration:1s;
    }

    @-webkit-keyframes fadeOut { from { opacity:1; } to { opacity:0; } }
    @-moz-keyframes fadeOut { from { opacity:1; } to { opacity:0; } }
    @keyframes fadeOut { from { opacity:1; } to { opacity:0; } }

    .fade-out {
        opacity:0;  /* make things invisible upon start */
        -webkit-animation:fadeOut ease-out 1;  /* call our keyframe named fadeIn, use animattion ease-in and repeat it only 1 time */
        -moz-animation:fadeOut ease-out 1;
        animation:fadeOut ease-out 1;

        -webkit-animation-fill-mode:backwards;  /* this makes sure that after animation is done we remain at the last keyframe value (opacity: 0)*/
        -moz-animation-fill-mode:backwards;
        animation-fill-mode:backwards;

        -webkit-animation-duration:1s;
        -moz-animation-duration:1s;
        animation-duration:1s;
    }

</style>
