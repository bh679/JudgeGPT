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
    "The verdict is in, and it's digital.",
    "Making 'beyond a reasonable doubt' a matter of computation.",
    "When 'court orders' become 'coding orders'.",
    "One small step for code, one giant leap for legal-kind.",
    "Turning 'legal codes' into 'coding laws'.",
    "From gavel to keyboard: the new sound of justice.",
    "Lawyers may rest, but code never sleeps.",
    "In courtrooms of the future, everyone will be a coder."
]



/*


[
    "Empowering the Future of Justice: One Case at a Time.",
    "Small Claims, Big Impact: Shaping the Legal System of Tomorrow.",
    "Justice, Reimagined: Envisioning a Brighter Legal Future.",
    "The Dawn of a New Era: Reinventing Small Claims for the Future.",
    "The Future of Justice: Where Innovation Meets Fairness.",
    "Transforming Small Claims: Pioneering the Legal Landscape of Tomorrow.",
    "Next-Gen Justice: Shaping the Future of the Legal System Today.",
    "The Future of Small Claims: Streamlined, Efficient, and Just.",
    "Redefining Justice: Building the Legal System of the Future.",
    "Small Claims, Future-Proofed: Redefining Justice for a New Era.",
    "AI: The New Face of Justice and the Legal System.",
    "Embracing the Future: AI Revolutionizes the Legal System.",
    "The Future is Now: AI Transforming Legal Proceedings.",
    "AI: Redefining Justice for the Next Generation.",
    "Legal System Reimagined: AI at the Heart of Tomorrow's Justice.",
    "Unveiling the Future: AI at the Helm of the Legal System.",
    "Justice Gets an Upgrade: The Future of Law is AI.",
    "The Future of Law: AI-Powered, Efficient, and Just.",
    "AI: Spearheading the Legal Revolution of the Future.",
    "Tomorrow's Justice Today: AI Transforms the Legal Landscape."
];*/

const tagLineCount = 20;

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
var restartButtonLabelsCount = 10;


function GetTagLine()
{
    return taglines[Math.floor(Math.random() * tagLineCount)];
}

function GetRestartButtonLabel()
{
    return restartButtonLabels[Math.floor(Math.random() * restartButtonLabelsCount)];
}

