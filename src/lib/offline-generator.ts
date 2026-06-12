import { ExamPaper, Section, Question } from "@/components/ExamPaperView";
import { HHWPacket, HHWSubject } from "@/components/HHWView";

type BodyExam = {
  schoolName: string;
  schoolAddress: string;
  examTitle: string;
  time: string;
  className: string;
  subject: string;
  maxMarks: number;
  sourceText?: string;
  websiteUrl?: string;
  instructions?: string;
};

type BodyHHW = {
  schoolName: string;
  schoolAddress: string;
  title: string;
  className: string;
  subjects: string[];
  sourceText?: string;
  websiteUrl?: string;
  instructions?: string;
  tone?: "standard" | "premium";
};

// --- SUBJECT-SPECIFIC EXAM QUESTION BANKS ---
interface QuestionPreset {
  type: "mcq" | "fill" | "short" | "long";
  instruction: string;
  passage?: string;
  options?: string[];
  answer?: string; // used for reference / extraction matching
}

const EXAM_PRESETS: Record<string, QuestionPreset[]> = {
  maths: [
    {
      type: "mcq",
      instruction: "What is the value of x in the equation 3x - 7 = 8?",
      options: ["x = 5", "x = 3", "x = 15", "x = -5"],
    },
    {
      type: "mcq",
      instruction: "Which of the following is a prime number?",
      options: ["9", "15", "2", "4"],
    },
    {
      type: "mcq",
      instruction: "What is the formula for the area of a circle?",
      options: ["2πr", "πr²", "πd", "2πr²"],
    },
    { type: "mcq", instruction: "Find the square root of 625.", options: ["15", "25", "35", "45"] },
    {
      type: "mcq",
      instruction: "What is the sum of interior angles of a quadrilateral?",
      options: ["180°", "360°", "90°", "540°"],
    },
    { type: "fill", instruction: "The smallest odd prime number is _______." },
    {
      type: "fill",
      instruction:
        "Two straight lines in a plane that do not intersect at any point are called _______ lines.",
    },
    {
      type: "fill",
      instruction: "The value of Pi (π) up to two decimal places is approximately _______.",
    },
    {
      type: "fill",
      instruction: "A triangle having all three sides equal is called an _______ triangle.",
    },
    { type: "short", instruction: "Simplify the expression: (2/3) + (1/4) - (1/2)." },
    {
      type: "short",
      instruction:
        "Find the perimeter and area of a rectangle whose length is 12 cm and width is 8 cm.",
    },
    { type: "short", instruction: "Find the HCF (Highest Common Factor) of 24 and 36." },
    {
      type: "short",
      instruction:
        "If a card is drawn at random from a pack of 52 cards, find the probability of getting a king.",
    },
    {
      type: "long",
      instruction:
        "A train travels 360 km at a uniform speed. If the speed had been 5 km/h more, it would have taken 1 hour less for the same journey. Find the speed of the train.",
    },
    {
      type: "long",
      instruction:
        "Prove that the sum of the angles of a triangle is 180 degrees using geometric parallel lines properties.",
    },
    {
      type: "long",
      instruction:
        "The angles of depression of the top and bottom of an 8m tall building from the top of a multi-storeyed building are 30° and 45° respectively. Find the height of the multi-storeyed building and the distance between the two buildings.",
    },
  ],
  science: [
    {
      type: "mcq",
      instruction: "Which of the following gases do plants absorb during photosynthesis?",
      options: ["Oxygen", "Carbon Dioxide", "Nitrogen", "Hydrogen"],
    },
    {
      type: "mcq",
      instruction: "What is known as the powerhouse of the cell?",
      options: ["Nucleus", "Mitochondria", "Ribosome", "Lysosome"],
    },
    {
      type: "mcq",
      instruction: "What is the chemical formula of common table salt?",
      options: ["NaOH", "HCl", "NaCl", "KCl"],
    },
    {
      type: "mcq",
      instruction: "Which organ in the human body filters waste from the blood?",
      options: ["Heart", "Kidneys", "Lungs", "Liver"],
    },
    {
      type: "mcq",
      instruction: "What is the SI unit of force?",
      options: ["Watt", "Joule", "Pascal", "Newton"],
    },
    { type: "fill", instruction: "Sound waves cannot travel through a _______." },
    {
      type: "fill",
      instruction: "Green plants are called _______ because they prepare their own food.",
    },
    {
      type: "fill",
      instruction: "The process of conversion of water vapor into liquid water is called _______.",
    },
    {
      type: "fill",
      instruction: "The metal which exists in a liquid state at room temperature is _______.",
    },
    {
      type: "short",
      instruction:
        "What is photosynthesis? Write the balanced chemical equation representing the process.",
    },
    {
      type: "short",
      instruction:
        "Distinguish between physical and chemical changes with at least two examples of each.",
    },
    {
      type: "short",
      instruction: "State Newton's first law of motion and explain it with a real-life example.",
    },
    {
      type: "short",
      instruction:
        "Explain the term 'renewable energy' and list three major sources of renewable energy.",
    },
    {
      type: "long",
      instruction:
        "Explain the structure and functioning of the human heart with the help of a neat and labeled diagram.",
    },
    {
      type: "long",
      instruction:
        "Describe the carbon cycle in nature, highlighting the roles played by photosynthesis, respiration, and combustion.",
    },
    {
      type: "long",
      instruction:
        "Define corrosion. What are the necessary conditions for the rusting of iron? Detail three methods used to prevent corrosion.",
    },
  ],
  english: [
    {
      type: "mcq",
      instruction: "Identify the adjective in the sentence: 'She has a beautiful voice.'",
      options: ["She", "beautiful", "voice", "has"],
    },
    {
      type: "mcq",
      instruction: "Choose the correct antonym of the word 'Ancient'.",
      options: ["Old", "Antique", "Modern", "Historic"],
    },
    {
      type: "mcq",
      instruction:
        "Complete the sentence: 'Neither of the boys _______ present in the class yesterday.'",
      options: ["was", "were", "are", "have been"],
    },
    {
      type: "mcq",
      instruction: "Choose the word with the correct spelling:",
      options: ["Receive", "Recieve", "Receve", "Receivee"],
    },
    { type: "fill", instruction: "The plural form of the word 'child' is _______." },
    { type: "fill", instruction: "She is very fond _______ listening to classical music." },
    { type: "fill", instruction: "An _______ a day keeps the doctor away." },
    {
      type: "short",
      instruction: "Define a pronoun and give three examples of different types of pronouns.",
    },
    {
      type: "short",
      instruction:
        "Change the following sentence into passive voice: 'The teacher praised the students for their hard work.'",
    },
    {
      type: "short",
      instruction: "Write a short paragraph (50-60 words) on 'The Importance of Reading Books'.",
    },
    {
      type: "long",
      instruction:
        "Write a letter to your school Principal requesting two days of leave due to an urgent family function.",
    },
    {
      type: "long",
      instruction:
        "Read the story of 'The Boy Who Cried Wolf' and discuss its moral. Explain how it teaches us about trust and honesty.",
    },
  ],
  hindi: [
    {
      type: "mcq",
      instruction: "संज्ञा के कितने मुख्य भेद होते हैं?",
      options: ["तीन", "पाँच", "छह", "चार"],
    },
    {
      type: "mcq",
      instruction: "निम्नलिखित में से 'सूर्य' का पर्यायवाची शब्द कौन सा है?",
      options: ["निशाकर", "भानु", "पवन", "जलद"],
    },
    {
      type: "mcq",
      instruction: "शुद्ध वर्तनी वाले शब्द का चयन कीजिए:",
      options: ["कविइत्री", "कवयित्री", "कविइत्रि", "कवयितरी"],
    },
    { type: "fill", instruction: "भाषा की सबसे छोटी इकाई को _______ कहते हैं।" },
    {
      type: "fill",
      instruction: "जो शब्द संज्ञा या सर्वनाम की विशेषता बताते हैं, उन्हें _______ कहते हैं।",
    },
    { type: "short", instruction: "संधि किसे कहते हैं? संधि के मुख्य तीन भेदों के नाम लिखिए।" },
    {
      type: "short",
      instruction: "मुहावरे का अर्थ लिखकर वाक्य में प्रयोग कीजिए: 'आसमान सिर पर उठाना'।",
    },
    {
      type: "long",
      instruction: "'मेरा प्रिय त्योहार' विषय पर लगभग 150 शब्दों में एक निबंध लिखिए।",
    },
  ],
  evs: [
    {
      type: "mcq",
      instruction: "Which of the following is a biotic component of the environment?",
      options: ["Plants", "Air", "Water", "Soil"],
    },
    {
      type: "mcq",
      instruction: "Which day is celebrated as World Environment Day?",
      options: ["April 22", "June 5", "September 16", "December 10"],
    },
    {
      type: "fill",
      instruction: "The envelope of air that surrounds the Earth is called the _______.",
    },
    { type: "fill", instruction: "_______ is the primary source of energy on Earth." },
    {
      type: "short",
      instruction: "Explain the importance of conserving water in our daily lives.",
    },
    { type: "short", instruction: "What is global warming? Name two gases responsible for it." },
    {
      type: "long",
      instruction:
        "What is waste management? Explain the difference between biodegradable and non-biodegradable waste with examples, and discuss the 3 R's rule.",
    },
  ],
  social: [
    {
      type: "mcq",
      instruction: "Who is known as the Father of the Indian Constitution?",
      options: ["Mahatma Gandhi", "Dr. B.R. Ambedkar", "Jawaharlal Nehru", "Dr. Rajendra Prasad"],
    },
    {
      type: "mcq",
      instruction: "Which is the longest river in the world?",
      options: ["Amazon", "Nile", "Ganga", "Mississippi"],
    },
    {
      type: "fill",
      instruction:
        "The imaginary line that divides the Earth into the Northern and Southern Hemispheres is the _______.",
    },
    { type: "fill", instruction: "The Battle of Plassey was fought in the year _______." },
    {
      type: "short",
      instruction: "Explain the three main organs of the government and their primary roles.",
    },
    { type: "short", instruction: "What is sustainable development? Why is it crucial today?" },
    {
      type: "long",
      instruction:
        "Describe the causes and impact of the Revolt of 1857 in India. What changes did it bring in British administration?",
    },
  ],
  computer: [
    {
      type: "mcq",
      instruction: "What does CPU stand for?",
      options: [
        "Central Processing Unit",
        "Control Processing Unit",
        "Computer Personal Unit",
        "Central Program Utility",
      ],
    },
    {
      type: "mcq",
      instruction: "Which of the following is an input device?",
      options: ["Monitor", "Printer", "Scanner", "Speaker"],
    },
    { type: "fill", instruction: "_______ is known as the brain of the computer." },
    { type: "fill", instruction: "1 Kilobyte (KB) is equal to _______ bytes." },
    { type: "short", instruction: "What is the difference between RAM and ROM?" },
    { type: "short", instruction: "Explain what an Operating System is and give two examples." },
    {
      type: "long",
      instruction:
        "What is computer networking? Describe the differences between LAN (Local Area Network), MAN (Metropolitan Area Network), and WAN (Wide Area Network).",
    },
  ],
  gk: [
    {
      type: "mcq",
      instruction: "Which is the largest ocean on Earth?",
      options: ["Atlantic Ocean", "Indian Ocean", "Pacific Ocean", "Arctic Ocean"],
    },
    {
      type: "mcq",
      instruction: "Which planet is known as the Red Planet?",
      options: ["Venus", "Mars", "Jupiter", "Saturn"],
    },
    { type: "fill", instruction: "The national bird of India is the _______." },
    { type: "fill", instruction: "The currency of Japan is the _______." },
    { type: "short", instruction: "Name the five oceans of the world." },
    {
      type: "long",
      instruction:
        "Write short notes on: (a) ISRO's Moon Missions (b) The significance of the Olympic Games.",
    },
  ],
  sanskrit: [
    {
      type: "mcq",
      instruction: "संस्कृत व्याकरणे कति स्वराः सन्ति?",
      options: ["त्रयोदश (13)", "नव (9)", "एकादश (11)", "पञ्च (5)"],
    },
    { type: "fill", instruction: "सत्यमेव जयते' इति वाक्यं _______ उपनिषदः अस्ति।" },
    { type: "short", instruction: "संस्कृते लिखत: (क) पुस्तकं पठति (ख) सः विद्यालयं गच्छति।" },
    { type: "long", instruction: "संस्कृतभाषायाः महत्त्वं अधिकृत्य पञ्च वाक्यानि लिखत।" },
  ],
  generic: [
    {
      type: "mcq",
      instruction: "What is the primary study and scope of this subject?",
      options: [
        "Theoretical analysis",
        "Practical applications",
        "Both Theory and Practice",
        "Historical reference only",
      ],
    },
    {
      type: "mcq",
      instruction: "Which of the following represents a key principle of this field?",
      options: [
        "Hypothesis testing",
        "Logical deduction",
        "Empirical evidence",
        "All of the above",
      ],
    },
    { type: "fill", instruction: "The fundamental concept governing this subject is _______." },
    {
      type: "fill",
      instruction: "A critical tool used to analyze concepts in this domain is called _______.",
    },
    {
      type: "short",
      instruction: "Define the core terms and scope of this topic in your own words.",
    },
    { type: "short", instruction: "Explain how this subject is applied in modern society." },
    {
      type: "long",
      instruction:
        "Provide a comprehensive review of the main themes, key developments, and practical challenges associated with this subject.",
    },
  ],
};

// Map similar subject strings to our presets
function getSubjectPresetKey(subject: string): string {
  const s = subject.toLowerCase().trim();
  if (
    s.includes("math") ||
    s.includes("algebra") ||
    s.includes("geometry") ||
    s.includes("arithmetic")
  )
    return "maths";
  if (s.includes("science") || s.includes("physics") || s.includes("chem") || s.includes("bio"))
    return "science";
  if (s.includes("english") || s.includes("grammar") || s.includes("literature")) return "english";
  if (s.includes("hindi") || s.includes("हिंदी")) return "hindi";
  if (s.includes("evs") || s.includes("environment")) return "evs";
  if (
    s.includes("social") ||
    s.includes("history") ||
    s.includes("geography") ||
    s.includes("civics") ||
    s.includes("sst")
  )
    return "social";
  if (
    s.includes("computer") ||
    s.includes("it") ||
    s.includes("coding") ||
    s.includes("programming")
  )
    return "computer";
  if (s.includes("gk") || s.includes("general knowledge")) return "gk";
  if (s.includes("sanskrit") || s.includes("संस्कृत")) return "sanskrit";
  return "generic";
}

// --- DYNAMIC SOURCE TEXT QUESTION EXTRACTOR ---
function extractQuestionsFromSource(sourceText: string, subjectKey: string): QuestionPreset[] {
  const questions: QuestionPreset[] = [];
  // Split into sentences
  const sentences = sourceText
    .split(/[.!?\n]+/)
    .map((s) => s.replace(/\s+/g, " ").trim())
    .filter((s) => s.length >= 25 && s.length <= 150);

  if (sentences.length === 0) return [];

  // Helper to extract a word (nouns / capital words or long words)
  const getInterestingWord = (sentence: string): string | null => {
    const words = sentence
      .replace(/[.,/#!$%^&*;:{}=\-_`~()]/g, "")
      .split(/\s+/)
      .filter(
        (w) =>
          w.length > 5 &&
          !/^(about|should|would|could|their|there|these|those|first|second|third|after|before|under|where|which|while)$/i.test(
            w,
          ),
      );

    if (words.length === 0) return null;
    // Prefer capital words if any (proper nouns)
    const capWord = words.find((w) => w[0] === w[0].toUpperCase() && !/^[A-Z]+$/.test(w));
    return capWord || words[Math.floor(Math.random() * words.length)];
  };

  let sentenceIndex = 0;

  // 1. Generate 2-3 MCQs
  for (let i = 0; i < 4 && sentenceIndex < sentences.length; i++) {
    const sent = sentences[sentenceIndex++];
    const word = getInterestingWord(sent);
    if (word) {
      const blanked = sent.replace(new RegExp(`\\b${word}\\b`, "i"), "_______");
      if (blanked.includes("_______")) {
        // Generate options
        const options = [word];
        const dummyPresets = [
          "Concept",
          "Factor",
          "Process",
          "Element",
          "Theory",
          "Method",
          "Effect",
          "Variable",
        ];
        while (options.length < 4) {
          const dummy = dummyPresets[Math.floor(Math.random() * dummyPresets.length)];
          if (!options.includes(dummy)) options.push(dummy);
        }
        // Shuffle options
        options.sort(() => Math.random() - 0.5);
        questions.push({
          type: "mcq",
          instruction: `Complete the sentence based on the context:\n"${blanked}"`,
          options,
          answer: word,
        });
      } else {
        sentenceIndex--; // retry sentence
      }
    }
  }

  // 2. Generate 2-3 Fill in the Blanks
  for (let i = 0; i < 4 && sentenceIndex < sentences.length; i++) {
    const sent = sentences[sentenceIndex++];
    const word = getInterestingWord(sent);
    if (word) {
      const blanked = sent.replace(new RegExp(`\\b${word}\\b`, "i"), "_______");
      if (blanked.includes("_______")) {
        questions.push({
          type: "fill",
          instruction: `Fill in the blank with a suitable term:\n"${blanked}"`,
        });
      } else {
        sentenceIndex--;
      }
    }
  }

  // 3. Generate Short Answers
  for (let i = 0; i < 3 && sentenceIndex < sentences.length; i++) {
    const sent = sentences[sentenceIndex++];
    const word = getInterestingWord(sent);
    questions.push({
      type: "short",
      instruction: word
        ? `Explain the concept and significance of '${word}' as discussed in the text: "${sent}".`
        : `Answer the following question based on the text: "${sent}".`,
    });
  }

  // 4. Generate Long Answers
  for (let i = 0; i < 2 && sentenceIndex < sentences.length; i++) {
    const sent = sentences[sentenceIndex++];
    questions.push({
      type: "long",
      instruction: `Discuss in detail: "${sent}". Explain its implications, challenges, and give suitable examples.`,
    });
  }

  return questions;
}

// --- OFFLINE EXAM GENERATOR ---
export function generateExamOffline(body: BodyExam): ExamPaper {
  const subjectKey = getSubjectPresetKey(body.subject);
  let presets = EXAM_PRESETS[subjectKey] || EXAM_PRESETS.generic;

  // If sourceText is provided, parse it and merge/prefer extracted questions
  if (body.sourceText && body.sourceText.trim().length > 50) {
    const extracted = extractQuestionsFromSource(body.sourceText, subjectKey);
    if (extracted.length > 0) {
      presets = [...extracted, ...presets];
    }
  }

  const maxM = Number(body.maxMarks) || 25;

  // Section layout determination
  let secA_marks = 0;
  let secB_marks = 0;
  let secC_marks = 0;

  if (maxM <= 15) {
    // 2 sections: A (Objective) and B (Short/Long)
    secA_marks = Math.floor(maxM * 0.4);
    secB_marks = maxM - secA_marks;
  } else if (maxM <= 30) {
    // 3 sections: A (Objective 30%), B (Short 40%), C (Long 30%)
    secA_marks = Math.floor(maxM * 0.3);
    secC_marks = Math.floor(maxM * 0.3);
    secB_marks = maxM - secA_marks - secC_marks;
  } else {
    // Large marks: A (25%), B (45%), C (30%)
    secA_marks = Math.floor(maxM * 0.25);
    secC_marks = Math.floor(maxM * 0.35);
    secB_marks = maxM - secA_marks - secC_marks;
  }

  const sections: Section[] = [];
  let qNumber = 1;

  // --- SECTION A: OBJECTIVE TYPE (1 mark each) ---
  if (secA_marks > 0) {
    const mcqPresets = presets.filter((p) => p.type === "mcq");
    const fillPresets = presets.filter((p) => p.type === "fill");
    const chosenQuestions: Question[] = [];
    let allocated = 0;

    // Distribute Section A between MCQs and Fill-ins
    const mcqCount = Math.floor(secA_marks / 2) || 1;
    const fillCount = secA_marks - mcqCount;

    // Add MCQs
    for (let i = 0; i < mcqCount; i++) {
      const preset = mcqPresets[i % mcqPresets.length];
      chosenQuestions.push({
        number: `${qNumber++}`,
        instruction: preset.instruction,
        marks: 1,
        type: "mcq",
        passage: null,
        subQuestions: [
          {
            label: "a",
            text: "Select the most appropriate option:",
            options: preset.options || ["Option A", "Option B", "Option C", "Option D"],
          },
        ],
      });
      allocated += 1;
    }

    // Add Fill-ins
    for (let i = 0; i < fillCount; i++) {
      const preset = fillPresets[i % fillPresets.length];
      chosenQuestions.push({
        number: `${qNumber++}`,
        instruction: preset.instruction,
        marks: 1,
        type: "fill",
        passage: null,
        subQuestions: [],
      });
      allocated += 1;
    }

    sections.push({
      name: "SECTION A: OBJECTIVE TYPE QUESTIONS",
      marks: allocated,
      questions: chosenQuestions,
    });
    // Adjust if allocated doesn't match secA_marks (though it should since 1 mark each)
    secA_marks = allocated;
  }

  // --- SECTION B: SHORT ANSWER TYPE (2 or 3 marks each) ---
  if (secB_marks > 0) {
    const shortPresets = presets.filter((p) => p.type === "short");
    const chosenQuestions: Question[] = [];
    let allocated = 0;

    // Question marks could be 2 or 3
    const qMarks = secB_marks % 2 === 0 ? 2 : 3;
    const count = Math.floor(secB_marks / qMarks);

    for (let i = 0; i < count; i++) {
      const preset = shortPresets[i % shortPresets.length];
      chosenQuestions.push({
        number: `${qNumber++}`,
        instruction: preset.instruction,
        marks: qMarks,
        type: "short",
        passage: null,
        subQuestions: [],
      });
      allocated += qMarks;
    }

    // Handled remainder if any
    const remainder = secB_marks - allocated;
    if (remainder > 0 && chosenQuestions.length > 0) {
      chosenQuestions[chosenQuestions.length - 1].marks += remainder;
      allocated += remainder;
    } else if (remainder > 0) {
      // Create a single question
      const preset = shortPresets[0];
      chosenQuestions.push({
        number: `${qNumber++}`,
        instruction: preset.instruction,
        marks: remainder,
        type: "short",
        passage: null,
        subQuestions: [],
      });
      allocated += remainder;
    }

    sections.push({
      name: "SECTION B: SHORT ANSWER TYPE QUESTIONS",
      marks: allocated,
      questions: chosenQuestions,
    });
    secB_marks = allocated;
  }

  // --- SECTION C: LONG ANSWER TYPE (4, 5, or 6 marks each) ---
  if (secC_marks > 0) {
    const longPresets = presets.filter((p) => p.type === "long");
    const chosenQuestions: Question[] = [];
    let allocated = 0;

    const qMarks = secC_marks >= 10 ? 5 : secC_marks;
    const count = Math.floor(secC_marks / qMarks);

    for (let i = 0; i < count; i++) {
      const preset = longPresets[i % longPresets.length];
      chosenQuestions.push({
        number: `${qNumber++}`,
        instruction: preset.instruction,
        marks: qMarks,
        type: "long",
        passage: null,
        subQuestions: [],
      });
      allocated += qMarks;
    }

    // Remainder
    const remainder = secC_marks - allocated;
    if (remainder > 0 && chosenQuestions.length > 0) {
      chosenQuestions[chosenQuestions.length - 1].marks += remainder;
      allocated += remainder;
    } else if (remainder > 0) {
      const preset = longPresets[0];
      chosenQuestions.push({
        number: `${qNumber++}`,
        instruction: preset.instruction,
        marks: remainder,
        type: "long",
        passage: null,
        subQuestions: [],
      });
      allocated += remainder;
    }

    sections.push({
      name: "SECTION C: LONG ANSWER / ANALYTICAL QUESTIONS",
      marks: allocated,
      questions: chosenQuestions,
    });
    secC_marks = allocated;
  }

  // Total check & balance
  const currentTotal = sections.reduce((sum, s) => sum + s.marks, 0);
  if (currentTotal !== maxM && sections.length > 0) {
    // Add adjustment to the last section's last question
    const diff = maxM - currentTotal;
    const lastSec = sections[sections.length - 1];
    if (lastSec.questions.length > 0) {
      lastSec.questions[lastSec.questions.length - 1].marks += diff;
      lastSec.marks += diff;
    }
  }

  return { sections };
}

// --- SUBJECT-SPECIFIC HHW ASSIGNMENT PRESETS ---
const HHW_SUBJECT_PRESETS: Record<string, { note: string; assignments: string[] }[]> = {
  english: [
    {
      note: "Improve grammar, composition, and reading habits.",
      assignments: [
        "Read one English storybook of your choice and write a book review in 100 words outlining the characters, setting, and plot.",
        "Maintain a daily diary page for 7 consecutive days of your summer holidays, writing about a special skill or learning of the day.",
        "Create a colorful chart on 'Tenses' explaining the rules and providing two examples of each tense form.",
        "Write a creative story starting with the line: 'The mysterious key sat on the shelf for ten years, until today...'",
        "Learn and write 20 new vocabulary words with their antonyms and synonyms, using each word in a self-constructed sentence.",
      ],
    },
  ],
  maths: [
    {
      note: "Practice calculation, mathematical thinking, and geometry.",
      assignments: [
        "Practice at least 20 algebraic expressions and linear equations worksheets in a separate practice notebook.",
        "Create a 3D model of geometric shapes (cube, cuboid, cylinder, cone) using cardboard or craft sheets and write their surface area and volume formulas.",
        "Conduct a survey in your neighborhood of 10 families regarding their monthly water usage. Draw a bar graph representing your findings.",
        "Write and memorize tables from 12 to 25. Record a 2-minute video reciting a table and share it.",
        "Solve the logical puzzles and sudoku worksheets distributed in class.",
      ],
    },
  ],
  science: [
    {
      note: "Experiential projects, model making, and observations.",
      assignments: [
        "Prepare a working model or display chart of the Water Cycle or the Solar System using eco-friendly materials.",
        "Plant a sapling in a small pot. Monitor and write a weekly journal tracking its growth, height changes, water usage, and leaf development.",
        "Perform a simple experiment at home: test water absorption rates of different soil types (clay, sand, loam) and write a report.",
        "Create a poster warning about the dangers of single-use plastics and suggesting 5 eco-friendly alternatives.",
        "Find and write short biographies of two famous Indian scientists and their revolutionary scientific breakthroughs.",
      ],
    },
  ],
  hindi: [
    {
      note: "लेखन शैली, भाषा ज्ञान और पठन कौशल का विकास।",
      assignments: [
        "प्रतिदिन एक पृष्ठ सुलेख (handwriting) अपनी अभ्यास पुस्तिका में लिखें।",
        "हिंदी की किन्हीं दो कहानियों (प्रेमचंद या अन्य लेखक) को पढ़कर उनका सारांश अपने शब्दों में लिखिए।",
        "अपने परिवार के साथ बिताए गए किसी एक यादगार दिन का वर्णन करते हुए 150 शब्दों में अनुच्छेद लिखिए।",
        "'वृक्षों का महत्व' विषय पर एक रंगीन पोस्टर बनाइए और उसपर पाँच स्वरचित स्लोगन (slogans) लिखिए।",
        "हिंदी व्याकरण के किन्हीं पाँच विषयों (संज्ञा, सर्वनाम, विशेषण, क्रिया, काल) पर रंगीन फ्लैश कार्ड तैयार करें।",
      ],
    },
  ],
  evs: [
    {
      note: "Connect with nature and understand our environment.",
      assignments: [
        "Observe the birds visiting your balcony or garden. Make a catalog listing 5 birds, their color patterns, and food habits.",
        "Create a kitchen herb garden by planting mustard seeds or coriander in a used plastic bottle. Capture photos weekly.",
        "Design a family waste audit sheet. Track how much dry, wet, and hazardous waste is generated in your house for 3 days.",
        "Write 10 golden rules for electricity conservation at home and verify if your family follows them.",
      ],
    },
  ],
  social: [
    {
      note: "Explore history, geography, and civic systems.",
      assignments: [
        "On an outline map of India, locate and mark all the state capitals and major rivers.",
        "Collect pictures of historical monuments of India built during the Mughal and British periods. Create an album with brief descriptions.",
        "Interview your grandparents about the changes they have witnessed in communication, transport, and technology since their childhood.",
        "Write a brief constitutional study on the Indian preamble, listing and explaining terms like Sovereign, Socialist, Secular, Democratic, Republic.",
      ],
    },
  ],
  computer: [
    {
      note: "Technology, basic coding logic, and presentation.",
      assignments: [
        "Create a PowerPoint presentation of 5 slides on the topic 'Artificial Intelligence in Education'.",
        "Draw a block diagram of computer architecture (CPU, ALU, Memory, Input/Output) on an A3 chart paper.",
        "Research and write a report on 5 famous cyber security practices to protect personal computers and online profiles.",
        "Write HTML code to create a simple personal webpage displaying your name, hobbies, and favorite subjects.",
      ],
    },
  ],
  gk: [
    {
      note: "Improve general knowledge and current affairs awareness.",
      assignments: [
        "Read the newspaper daily and write down 5 major national or international headlines in your GK notebook.",
        "Create a quiz handbook containing 30 general knowledge questions with answers covering history, geography, and sports.",
        "List all the countries in the G20 forum along with their capitals and currency names.",
        "Design a booklet on Indian national symbols detailing their history and significance.",
      ],
    },
  ],
  sanskrit: [
    {
      note: "शब्दरूपाणि, धातुरूपाणि च स्मरणं कुरुत।",
      assignments: [
        "राम, लता, तथा फल शब्दानाम रूपाणि लिखत स्मरत च।",
        "पठ्, गम्, तथा लिख् धातूनां लट् लकारे रूपाणि लिखत।",
        "दश पशूनां पक्षिणां च नामानि संस्कृते सचित्रं लिखत।",
      ],
    },
  ],
  generic: [
    {
      note: "Subject enrichment and research tasks.",
      assignments: [
        "Research and write a detailed overview on a chosen key topic of this subject.",
        "Create a comprehensive glossary of 15 key terms of this subject with brief definitions.",
        "Design a model project illustrating a practical application of this subject in real life.",
        "Formulate a questionnaire containing 5 questions about this subject and interview an elder or teacher.",
      ],
    },
  ],
};

// --- OFFLINE HHW GENERATOR ---
export function generateHHWOffline(body: BodyHHW): HHWPacket {
  const subjects: HHWSubject[] = [];

  // General instructions
  const generalInstructions = [
    "Complete all homework in a clean, legible, and presentable handwriting.",
    "Support your written assignments with diagrams, charts, and colorful presentations where necessary.",
    "Parental guidance is recommended, but children are expected to complete the work in their own handwriting.",
    "Submit the completed holiday homework packets within 3 days of the school reopening.",
    "Utilize your holidays productively by spending time reading books and learning new home skills.",
  ];

  // Generate assignments for each requested subject
  body.subjects.forEach((subName) => {
    const sKey = getSubjectPresetKey(subName);
    const presetOptions = HHW_SUBJECT_PRESETS[sKey] || HHW_SUBJECT_PRESETS.generic;

    // Select one preset block
    const preset = presetOptions[0];

    const assignmentsList: string[] = [...preset.assignments];

    // If sourceText or custom instructions are given, add tailored tasks
    if (body.sourceText && body.sourceText.trim().length > 30) {
      assignmentsList.unshift(
        `Read the reference syllabus notes provided on this subject and write a comprehensive summary capturing the main concepts.`,
        `Make a list of key definitions and terms from your reading material and draft a mini-dictionary.`,
      );
    }

    if (body.instructions && body.instructions.trim().length > 0) {
      assignmentsList.unshift(`Special Assignment: ${body.instructions}`);
    }

    // Limit to 4-6 assignments
    const finalAssignments = assignmentsList.slice(0, 5).map((text, idx) => ({
      number: `${idx + 1}`,
      text:
        body.tone === "premium"
          ? `[Enrichment Task] ${text.replace("Write a", "Conduct an in-depth research and write a").replace("Create a", "Design a professional-grade")}`
          : text,
    }));

    subjects.push({
      subject: subName.toUpperCase(),
      note: preset.note || "Subject assignment tasks.",
      assignments: finalAssignments,
    });
  });

  return {
    title: body.title || "SUMMER VACATION HOLIDAY HOMEWORK",
    generalInstructions,
    subjects,
  };
}
