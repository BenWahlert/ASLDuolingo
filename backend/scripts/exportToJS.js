const { XP_VALUES, LEVEL_THRESHOLDS } = require('../src/config/constants');
const fs = require('fs');
const path = require('path');

const lessons = [
  {
    id: 'lesson-1',
    title: 'ASL Alphabet A-E',
    description: 'Learn the first five letters of the ASL alphabet',
    category: 'alphabet',
    order_index: 1,
    required_xp: 0,
    xp_reward: 50
  },
  {
    id: 'lesson-2',
    title: 'ASL Alphabet F-J',
    description: 'Continue learning the ASL alphabet',
    category: 'alphabet',
    order_index: 2,
    required_xp: 50,
    xp_reward: 50
  },
  {
    id: 'lesson-3',
    title: 'ASL Alphabet K-O',
    description: 'Keep progressing through the ASL alphabet',
    category: 'alphabet',
    order_index: 3,
    required_xp: 150,
    xp_reward: 50
  },
  {
    id: 'lesson-4',
    title: 'ASL Alphabet P-T',
    description: 'Learn more letters of the ASL alphabet',
    category: 'alphabet',
    order_index: 4,
    required_xp: 250,
    xp_reward: 50
  },
  {
    id: 'lesson-5',
    title: 'ASL Alphabet U-Z',
    description: 'Complete the ASL alphabet',
    category: 'alphabet',
    order_index: 5,
    required_xp: 400,
    xp_reward: 50
  },
  {
    id: 'lesson-6',
    title: 'Numbers 1-5',
    description: 'Learn to sign numbers 1 through 5',
    category: 'numbers',
    order_index: 6,
    required_xp: 500,
    xp_reward: 50
  },
  {
    id: 'lesson-7',
    title: 'Numbers 6-9',
    description: 'Learn to sign numbers 6 through 9',
    category: 'numbers',
    order_index: 7,
    required_xp: 600,
    xp_reward: 50
  },
  {
    id: 'lesson-8',
    title: 'Basic Greetings',
    description: 'Learn common ASL greetings',
    category: 'greetings',
    order_index: 8,
    required_xp: 700,
    xp_reward: 50
  },
  {
    id: 'lesson-9',
    title: 'Family Signs',
    description: 'Learn signs for family members',
    category: 'family',
    order_index: 9,
    required_xp: 850,
    xp_reward: 50
  },
  {
    id: 'lesson-10',
    title: 'Common Colors',
    description: 'Learn to sign basic colors',
    category: 'colors',
    order_index: 10,
    required_xp: 1000,
    xp_reward: 50
  }
];

const achievements = [
  {
    id: 'achievement-1',
    name: 'First Steps',
    description: 'Complete your first lesson',
    icon: 'first-steps',
    requirement_type: 'lessons_completed',
    requirement_value: 1
  },
  {
    id: 'achievement-2',
    name: 'Getting Started',
    description: 'Complete 3 lessons',
    icon: 'getting-started',
    requirement_type: 'lessons_completed',
    requirement_value: 3
  },
  {
    id: 'achievement-3',
    name: 'Dedicated Learner',
    description: 'Complete 5 lessons',
    icon: 'dedicated',
    requirement_type: 'lessons_completed',
    requirement_value: 5
  },
  {
    id: 'achievement-4',
    name: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'week-warrior',
    requirement_type: 'streak_days',
    requirement_value: 7
  },
  {
    id: 'achievement-5',
    name: 'Century Club',
    description: 'Earn 100 XP',
    icon: 'century',
    requirement_type: 'total_xp',
    requirement_value: 100
  },
  {
    id: 'achievement-6',
    name: 'XP Master',
    description: 'Earn 500 XP',
    icon: 'xp-master',
    requirement_type: 'total_xp',
    requirement_value: 500
  },
  {
    id: 'achievement-7',
    name: 'XP Legend',
    description: 'Earn 1000 XP',
    icon: 'xp-legend',
    requirement_type: 'total_xp',
    requirement_value: 1000
  }
];

function createExercisesForLesson(lessonId, lessonTitle, category) {
  const exercises = [];

  if (category === 'alphabet') {
    const letters = lessonTitle.match(/[A-Z]-[A-Z]/)[0].split('-');
    const start = letters[0].charCodeAt(0);
    const end = letters[1].charCodeAt(0);

    for (let i = start; i <= end; i++) {
      const letter = String.fromCharCode(i);
      exercises.push({
        lesson_id: lessonId,
        type: 'multiple_choice',
        question_text: 'What sign is this?',
        image_url: `/assets/asl/alphabet/${letter.toLowerCase()}.svg`,
        correct_answer: letter,
        options: [letter, String.fromCharCode(i + 1), String.fromCharCode(i + 2), String.fromCharCode(i - 1)].filter(l => l >= 'A' && l <= 'Z'),
        order_index: i - start + 1
      });
    }

    exercises.push({
      lesson_id: lessonId,
      type: 'sign_recognition',
      question_text: `Select the sign for '${String.fromCharCode(start)}'`,
      image_url: null,
      correct_answer: `/assets/asl/alphabet/${String.fromCharCode(start).toLowerCase()}.svg`,
      options: [
        { image_url: `/assets/asl/alphabet/${String.fromCharCode(start).toLowerCase()}.svg`, text: 'Option 1' },
        { image_url: `/assets/asl/alphabet/${String.fromCharCode(start + 1).toLowerCase()}.svg`, text: 'Option 2' },
        { image_url: `/assets/asl/alphabet/${String.fromCharCode(start + 2).toLowerCase()}.svg`, text: 'Option 3' }
      ],
      order_index: exercises.length + 1
    });
  } else if (category === 'numbers') {
    const range = lessonTitle.includes('1-5') ? [1, 5] : [6, 9];
    for (let i = range[0]; i <= range[1]; i++) {
      exercises.push({
        lesson_id: lessonId,
        type: 'multiple_choice',
        question_text: 'What number is this?',
        image_url: `/assets/asl/numbers/${i}.svg`,
        correct_answer: i.toString(),
        options: [i.toString(), (i + 1).toString(), (i + 2).toString(), (i - 1).toString()].filter(n => parseInt(n) >= 1 && parseInt(n) <= 9),
        order_index: i - range[0] + 1
      });
    }
  } else {
    const words = {
      greetings: ['hello', 'goodbye', 'please', 'thank you', 'sorry'],
      family: ['mother', 'father', 'sister', 'brother', 'family'],
      colors: ['red', 'blue', 'green', 'yellow', 'black']
    };

    const wordList = words[category] || [];
    wordList.forEach((word, index) => {
      exercises.push({
        lesson_id: lessonId,
        type: 'multiple_choice',
        question_text: 'What sign is this?',
        image_url: `/assets/asl/${category}/${word.replace(' ', '-')}.svg`,
        correct_answer: word,
        options: [word, ...wordList.filter(w => w !== word).slice(0, 3)],
        order_index: index + 1
      });
    });
  }

  return exercises;
}

console.log('Generating JavaScript modules from seed data...');

let exerciseCounter = 1;
const allExercises = [];
lessons.forEach(lesson => {
  const exercises = createExercisesForLesson(lesson.id, lesson.title, lesson.category);
  exercises.forEach(exercise => {
    allExercises.push({
      id: `exercise-${exerciseCounter++}`,
      ...exercise
    });
  });
});

const outputDir = path.join(__dirname, '../../frontend/src/data');
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

// Write lessons.js
fs.writeFileSync(
  path.join(outputDir, 'lessons.js'),
  `const lessons = ${JSON.stringify(lessons, null, 2)};\n\nexport default lessons;\n`
);

// Write exercises.js
fs.writeFileSync(
  path.join(outputDir, 'exercises.js'),
  `const exercises = ${JSON.stringify(allExercises, null, 2)};\n\nexport default exercises;\n`
);

// Write achievements.js
fs.writeFileSync(
  path.join(outputDir, 'achievements.js'),
  `const achievements = ${JSON.stringify(achievements, null, 2)};\n\nexport default achievements;\n`
);

// constants.js is already manually created with proper syntax

console.log('✓ Data exported successfully to frontend/src/data/');
console.log(`  - ${lessons.length} lessons`);
console.log(`  - ${allExercises.length} exercises`);
console.log(`  - ${achievements.length} achievements`);
console.log('  - Constants (already exists with proper syntax)');
