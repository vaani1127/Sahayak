// Mock data for Sahayak Teacher Assistant

export const mockNotes = {
  "Mathematics": "# Mathematics Notes\n\n## Topic: Algebra Basics\n\n### Key Concepts:\n\n1. **Variables and Constants**\n   - Variables are symbols (like x, y) that represent unknown values\n   - Constants are fixed numbers\n\n2. **Basic Operations**\n   - Addition: a + b\n   - Subtraction: a - b\n   - Multiplication: a × b or ab\n   - Division: a ÷ b or a/b\n\n3. **Solving Linear Equations**\n   - Step 1: Isolate the variable\n   - Step 2: Perform inverse operations\n   - Step 3: Check your answer\n\n### Example Problems:\n\n**Problem 1:** Solve for x: 2x + 5 = 15\n- Subtract 5 from both sides: 2x = 10\n- Divide by 2: x = 5\n\n**Problem 2:** Solve for y: 3y - 7 = 2y + 3\n- Subtract 2y from both sides: y - 7 = 3\n- Add 7 to both sides: y = 10\n\n### Practice Tips:\n- Always check your answers by substituting back\n- Remember the order of operations (PEMDAS)\n- Keep equations balanced by doing the same operation to both sides",
  
  "Science": "# Science Notes\n\n## Topic: Photosynthesis\n\n### Overview:\nPhotosynthesis is the process by which plants make their own food using sunlight, water, and carbon dioxide.\n\n### The Process:\n\n1. **Light-dependent Reactions**\n   - Occur in the chloroplasts\n   - Chlorophyll absorbs sunlight\n   - Water molecules are split\n   - Oxygen is released as a byproduct\n\n2. **Light-independent Reactions (Calvin Cycle)**\n   - Carbon dioxide is converted into glucose\n   - Uses energy from the light-dependent reactions\n\n### Chemical Equation:\n6CO₂ + 6H₂O + light energy → C₆H₁₂O₆ + 6O₂\n\n### Importance:\n- Produces oxygen for all living organisms\n- Forms the base of the food chain\n- Removes carbon dioxide from the atmosphere\n- Provides energy storage in the form of glucose\n\n### Factors Affecting Photosynthesis:\n- Light intensity\n- Temperature\n- Carbon dioxide concentration\n- Water availability"
};

export const mockQuiz = {
  "Mathematics": [
    "What is the value of x in the equation 2x + 8 = 20?",
    "If y = 3x + 5 and x = 2, what is the value of y?",
    "Simplify the expression: 4(2x + 3) - 2x",
    "What is the slope of the line passing through points (2, 4) and (6, 12)?",
    "Solve for z: 5z - 3 = 2z + 9"
  ],
  
  "Science": [
    "What is the main product of photosynthesis?",
    "Which organelle is responsible for photosynthesis in plant cells?",
    "What gas is released as a byproduct of photosynthesis?",
    "Name the green pigment that captures light energy in plants.",
    "What are the two main stages of photosynthesis called?"
  ],
  
  "History": [
    "Who was the first President of the United States?",
    "In which year did World War II end?",
    "What was the main cause of the American Civil War?",
    "Which ancient civilization built the pyramids?",
    "What event triggered the start of World War I?"
  ]
};

export const mockStudents = [
  { id: 1, name: "Emma Johnson", present: false },
  { id: 2, name: "Liam Smith", present: false },
  { id: 3, name: "Olivia Brown", present: false },
  { id: 4, name: "Noah Davis", present: false },
  { id: 5, name: "Ava Wilson", present: false },
  { id: 6, name: "William Miller", present: false },
  { id: 7, name: "Sophia Garcia", present: false },
  { id: 8, name: "James Rodriguez", present: false },
  { id: 9, name: "Isabella Martinez", present: false },
  { id: 10, name: "Benjamin Anderson", present: false },
  { id: 11, name: "Mia Taylor", present: false },
  { id: 12, name: "Lucas Thomas", present: false },
  { id: 13, name: "Charlotte Jackson", present: false },
  { id: 14, name: "Henry White", present: false },
  { id: 15, name: "Amelia Harris", present: false }
];

// Mock API responses
export const mockApiResponses = {
  notes: (topic) => ({
    notes: mockNotes[topic] || `# ${topic} Notes\n\nNotes for ${topic} will be generated here. This is a comprehensive study material covering all key concepts and examples.`
  }),
  
  quiz: (chapter) => ({
    questions: mockQuiz[chapter] || [
      `What are the main concepts in ${chapter}?`,
      `Explain the key principles of ${chapter}.`,
      `Give an example related to ${chapter}.`,
      `How does ${chapter} relate to real-world applications?`,
      `What are the common misconceptions about ${chapter}?`
    ]
  }),
  
  attendance: (data) => ({
    message: `Attendance recorded successfully for ${data.date}. ${data.presentCount} students marked present out of ${data.totalStudents}.`
  }),
  
  reminder: (data) => ({
    message: `Reminder "${data.title}" has been set for ${data.datetime}.`
  })
};