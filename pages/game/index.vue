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
            <span class="oi oi-arrow-thick-left" @click="clearQuestion()"></span>
            <div class="question">{{ curQuestion }}</div>
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
                curQuestion: ''
            }
        },

        methods: {
            openQuestion(key, index) {
                let keyCheck = parseInt(key);
                let cardObj = this.myJson[keyCheck][index];

                if (keyCheck !== 0 && cardObj.show) {
                    cardObj.amount = keyCheck;
                    cardObj.show = false;
                    this.showQuestion = true;
                    this.curQuestion = cardObj.question;
                }
            },

            clearQuestion() {
                this.showQuestion = false;
                this.curQuestion = '';
            }
        }
    }
</script>

<style>
    body {
        background: #000;
    }

    span.oi {
        color: #fff;
        font-size: 16px;
        cursor: pointer;
        position: absolute;
        top: 15px;
        left: 15px;
    }

    .container.full {
        width: 100%;
        min-width: 100%;
        max-width: 100%;
        padding: 10px;
        height: 100vh;
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
        font-size: 6vw;
        font-weight: bold;
        text-transform: uppercase;
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
    }
</style>
