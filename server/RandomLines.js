const taglines = 
[
    "Overruling the judges of tomorrow, today!",
    "Making legal systems as easy as 1, 0, 1, 0.",
    "Because even Lady Justice is ready for an upgrade.",
    "Bringing the 'I' in impartiality to the legal system.",
    "Setting precedents at the speed of light!",
    "The legal system's next big witness.",
    "Objection? Sustained by algorithms!",
    "Putting the 'artificial' in 'legal articulation'.",
    "The future of law, minus the human error.",
    "Cross-examining the future of law.",
    "Legalese, now in binary!",
    "Where the rule of law meets the rule of logic.",
    "The closest thing to a flawless lawyer.",
    "Because even the Scales of Justice could use some calibration.",
    "Where 'case law' meets 'case algorithm'.",
    "Transforming legal loopholes into programming loops.",
    "The verdict is in, and it's artificial.. I mean, intelligent.",
    "Making 'beyond a reasonable doubt' a matter of computation.",
    "When 'court orders' become 'coding orders'.",
    "One small step for code, one giant leap for legal-kind.",
    "Turning 'legal codes' into 'coding laws'.",
    "From gavel to keyboard: the new sound of justice.",
    "Lawyers may rest, but code never sleeps.",
    "In courtrooms of the future, everyone will be a coder."
]

const restartButtonLabels = [
            "Initiate New Trial",
            "Reset Legal Matrix",
            "Begin Fresh Plea",
            "Invoke Retrial Protocol",
            "Restart Judicial Simulation",
            "Reset Case Parameters",
            "New Litigation Configuration",
            "Commence New Proceedings",
            "Reinitialize Justice Sequence",
            "Resurrect Case from Archive"
        ];

const names = [
    "Alex",
    "Casey",
    "Jamie",
    "Taylor",
    "Morgan",
    "Riley",
    "Jordan",
    "Avery",
    "Charlie",
    "Finley",
    "River",
    "Skyler",
    "Emerson",
    "Reese",
    "Quinn",
    "Sage",
    "Peyton",
    "Dakota",
    "Rowan",
    "Sydney",
    "Jesse",
    "Ellis",
    "Phoenix",
    "Robin",
    "Harper",
    "Frankie",
    "Drew",
    "Lee",
    "Blake",
    "Banjo",
    "Cricket",
    "Doodle",
    "Frisbee",
    "Giggles",
    "Hiccup",
    "Jellybean",
    "Kazoo",
    "Lollipop",
    "Marmalade",
    "Noodles",
    "Pickle",
    "Quibble",
    "Rhubarb",
    "Squiggle",
    "Tumbleweed",
    "Ukulele",
    "Vroom",
    "Wobble",
    "Xylophone",
    "Yo-yo",
    "Zigzag",
    "Ash", "Blair", "Briar", "Cael", "Dale", "Eden", "Fable", "Gale", 
    "Haven", "Indigo", "Joss", "Kai", "Lane", "Max", "Nell", "Oak",
    "Pace", "Quin", "Rael", "Sage", "Teal", "Vale", "Wren", "Xan", 
    "Yule", "Zephyr", "Alba", "Bevin", "Clay", "Devon", "Eris", "Fern",
    "Greer", "Hollis", "Irie", "Jet", "Keir", "Lark", "Mace", "Noa",
    "Orla", "Pim", "Reef", "Sky", "True", "Vega", "West", "Xeno",
    "Yael", "Zane", "Aero", "Blaze", "Cove", "Dune", "Echo", "Flare",
    "Gala", "Hero", "Ilex", "Jem", "Kestrel", "Lynx", "Mars", "Nova",
    "Onyx", "Pace", "Quest", "Rune", "Sol", "Trill", "Umber", "Vex",
    "Wave", "Xol", "Yarrow", "Zen", "Alpha", "Bex", "Cadence", "Drift",
    "Elm", "Fizz", "Gust", "Ion", "Jinx", "Kip", "Lux", "Mirth", 
    "Neon", "Opal", "Pip", "Quill", "Roan", "Shift", "Twill", "Umbral", 
    "Vim", "Whim", "Xemi", "Yara"
];


const playerVoiceId = [
    "21m00Tcm4TlvDq8ikWAM",
    "2EiwWnXFnvU5JabPnv8n",
    "AZnzlk1XvdvUeBnXmlld",
    "CYw3kZ02Hs0563khs1Fj",
    "D38z5RcWu1voky8WS1ja",
    "EXAVITQu4vr4xnSDxMaL",
    "ErXwobaYiN019PkySvjV",
    "GBv7mTt0atIp3Br8iCZE",
    "IKne3meq5aSn9XLyUdCD",
    "LcfcDJNUP1GQjkzn1xUU",
    "MF3mGyEYCl7XYWbV9V6O",
    "N2lVS1w4EtoT3dr4eOWO",
    "ODq5zmih8GrVes37Dizd",
    "SOYHLrjzK2X1ezoPC6cr",
    "TX3LPaxmHKxFdv7VOQHJ",
    "ThT5KcBeYPX3keUQqHPh",
    "TxGEqnHWrfWFTfGW9XjX",
    "VR6AewLTigWG4xSOukaG",
    "XB0fDUnXU5powFXDhCwa",
    "XrExE9yKIg1WjnnlVkGX",
    "Yko7PKHZNXotIFUBG7I9",
    "ZQe5CZNOzWyzPSCn5a3c",
    "Zlb1dXrM653N07WRdFW3",
    "bVMeCyTHy58xNoL34h3p",
    "flq6f7yk4E4fJM5XTYuZ",
    "g5CIjZEefAph4nQFvHAz",
    "jBpfuIE2acCO8z3wKNLl",
    "jsCqWAovK2LkecY7zXl4",
    "oWAxZDx7w5VEj9dCyTzz",
    "onwK4e9ZLuTAKqWW03F9",
    "pMsXgVXv3BLzUgSXRplE",
    "pNInz6obpgDQGcFmaJgB",
    "piTKgcLEGmPE4e6mEKli",
    "t0jbNlBVZ17f02VDIeMI",
    "wViXBPUzp2ZZixB1xQuM",
    "yoZ06aMxZJJ28mfd3POQ",
    "z9fAnlkpzviPz146aGWa",
    "zcAOhNBS3c14rBihAFp1",
    "zrHiDhphv9ZnVXBqCLjz",
    "EZYvN1hBxpVgOy2hGxBs"//Brennan
];



const judgeVoiceId = [
    "21m00Tcm4TlvDq8ikWAM"
];

class RandomLines
{
    static GetTagLine()
    {
        return taglines[Math.floor(Math.random() * taglines.length)];
    }

    static GetRestartButtonLabel()
    {
        return restartButtonLabels[Math.floor(Math.random() * restartButtonLabels.length)];
    }   

    static GetRandomName()
    {
        return names[Math.floor(Math.random() * names.length)];
    }

    static GetRandomVoiceID()
    {
        return playerVoiceId[Math.floor(Math.random() * playerVoiceId.length)];
    }

    static GetJudgeVoiceID()
    {
        return judgeVoiceId[Math.floor(Math.random() * judgeVoiceId.length)];
    }
}

module.exports = RandomLines;