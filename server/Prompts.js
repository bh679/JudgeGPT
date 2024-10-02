class Prompts {
    constructor() {

        this.judgeCharacter = "You are JudgeGPT, a judge in a televised small claims court TV show. You are similar to Judge Judy.";
        this.cases = [ "Come up with an absurd and/or hilarious accusation to be argued in small claims court between two parties. Keep it very brief.",
            "Come up with an absurd and/or hilarious accusation to be argued in court between two parties. Keep it very brief.",
            "Come up with a ridiculous and hilarious accusation to be argued in court between two parties. Keep it very brief."];
        this.punishment = "Provide a funny, absurd and unfitting yet very brief punishment to be learnt for the following court ruling:{$}. Provide only one or two sentences";
        this.lesson = "Provide a funny, absurd and unfitting lesson to be learnt for the following court ruling:{$}. Keep it very brief.";
        this.winner = "A judge ruled the following: {$} Give a single word response of 'guity' or 'innocent' for the defendant. ";
        this.scoring = "You are scoring the result of a text based improv game, by %. Score the sentence on each of the four metrics, creativity, intelligence, humor and provide explanations on each. The sentence to be scored is {$}. If inside {} is nothing, there is no statement, score the no statement. At the end, provide a total score. use <br /> for new lines";
    }
}

module.exports = Prompts;