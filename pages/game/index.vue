<template>
    <div>
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
            <span class="oi oi-arrow-thick-left back" @click="clearQuestion()"></span>
            <div class="question">{{ curQuestion }}</div>

            <div class="card fade-in" v-if="showAnswer">
                <div class="card-body">{{ curAnswer }}</div>
            </div>

            <span class="oi oi-target show" @click="showAnswer = true"></span>
        </div>
    </div>
</template>

<script>
    import jsonData from '../../assets/data.json';

    export default {
        data() {
            return {
                myJson: jsonData,
                showQuestion: false,
                curQuestion: '',
                curAnswer: '',
                showAnswer: false,
                prevQuestion: {}
            }
        },

        mounted() {
            let self = this;

            // add event listeners
            window.addEventListener('keyup', function(e) {
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
                }
            });
        },

        methods: {
            openQuestion(key, index, force = false) {
                let keyCheck = parseInt(key);
                let cardObj = this.myJson[keyCheck][index];

                if (keyCheck !== 0 && cardObj.show || keyCheck !== 0 && force) {
                    cardObj.amount = keyCheck;
                    cardObj.show = false;
                    this.showQuestion = true;
                    this.curQuestion = cardObj.question;
                    this.curAnswer = cardObj.answer;

                    this.prevQuestion.key = key;
                    this.prevQuestion.index = index;
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
            }
        }
    }
</script>

<style>
    body {
        background: #000;
    }

    span.oi.back {
        color: #fff;
        cursor: pointer;
        position: absolute;
        top: 15px;
        left: 15px;
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

    .container > .row > div.col {
        background-color: #0000a6;
        margin: 0 8px 8px 0;
        padding: 15px;
        text-align: center;
        text-transform: uppercase;
        font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 2.3vw;
        font-weight: bold;
        color: #d69136;
        display: flex;
        align-items: center;
        justify-content: center;
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

    .question {
        height: 100%;
        font-family: "Quicksand", "Source Sans Pro", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
        font-size: 4vw;
        line-height: 120%;
        font-weight: bold;
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

    .card {
        width: 50%;
        margin: -140px auto;
    }

    .card > .card-body {
        background: #0000a6;
        color: #fff;
        border: 3px solid #fff;
        font-weight: bold;
        text-transform: uppercase;
        font-size: 2.5vw;
        text-shadow: 4px 4px 4px #000;
        text-align: center;
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

</style>
