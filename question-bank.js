/* Study Hub — Question Databank
 * Curated question banks organized by exam and subject, plus a live source
 * via the free Open Trivia DB API. Every offline question is self-contained
 * and auto-grades correctly (the answer matches an option exactly, or is
 * evaluated as written/fillblank by the app's existing grading logic).
 *
 * Exposes a global `QuestionBank` object:
 *   QuestionBank.banks          — all curated banks (source "curated")
 *   QuestionBank.fetchTrivia()  — pull questions from the Open Trivia DB API
 *   QuestionBank.search(q)      — text search across all curated questions
 */
(function () {
  'use strict';

  // Map our question format ({q,o,a}) onto the app's quiz engine format
  // ({question, options, answer, type}) when a bank is started.
  function toQuizFormat(b, type) {
    if (b.o && Array.isArray(b.o) && b.o.length) {
      return { question: b.q, options: b.o.slice(), answer: b.a, type: type || 'multiple' };
    }
    if (type === 'truefalse') {
      return { question: b.q, options: ['True', 'False'], answer: b.a, type: 'truefalse' };
    }
    return { question: b.q, answer: b.a, type: type || 'written' };
  }

  function shuffle(arr) {
    const a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      const t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  // ---------------- SAT ----------------
  const satMath = [
    { q: 'If 3x + 7 = 22, what is x?', o: ['4', '5', '6', '3'], a: '5' },
    { q: 'What is the sum of the interior angles of a triangle?', o: ['90°', '180°', '270°', '360°'], a: '180°' },
    { q: 'Simplify: (x²)(x³)', o: ['x⁵', 'x⁶', 'x', '2x⁵'], a: 'x⁵' },
    { q: 'A rectangle has length 8 and width 3. What is its perimeter?', o: ['11', '22', '24', '30'], a: '22' },
    { q: 'What is the value of 2⁵?', o: ['16', '24', '32', '10'], a: '32' },
    { q: 'If y = 2x + 1 and x = 3, what is y?', o: ['5', '6', '7', '8'], a: '7' },
    { q: 'What is the slope of the line y = 3x - 4?', o: ['-4', '3', '4', '1'], a: '3' },
    { q: 'What is 15% of 200?', o: ['20', '25', '30', '35'], a: '30' },
    { q: 'What is the area of a circle with radius 4? (π ≈ 3.14)', o: ['16π', '8π', '12π', '4π'], a: '16π' },
    { q: 'Solve for x: 2(x - 3) = 10', o: ['5', '6', '8', '13'], a: '8' },
    { q: 'What is the median of {3, 5, 7, 9, 11}?', o: ['5', '6', '7', '9'], a: '7' },
    { q: 'Which is the greatest common factor of 24 and 36?', o: ['4', '6', '9', '12'], a: '12' },
    { q: 'The square root of 144 is...', o: ['10', '11', '12', '14'], a: '12' },
    { q: 'If a = 4 and b = 3, what is a² + b²?', o: ['12', '25', '16', '49'], a: '25' },
    { q: 'What is 7! (7 factorial)?', o: ['420', '5040', '720', '504'], a: '5040' },
    { q: 'A line has slope 2 and passes through (1, 3). What is its y-intercept?', o: ['1', '2', '3', '5'], a: '1' },
    { q: 'If 2x + 4 = 4x, what is x?', o: ['1', '2', '4', '6'], a: '2' },
    { q: 'What is the value of |5 - 9|?', o: ['-4', '4', '14', '5'], a: '4' },
    { q: 'A triangle has sides 3, 4, and 5. Is it a right triangle?', o: ['Yes', 'No', 'Cannot determine', 'Only sometimes'], a: 'Yes' },
    { q: 'What is 8 × 12?', o: ['96', '86', '88', '100'], a: '96' },
    { q: 'Convert 0.75 to a fraction in simplest form.', o: ['3/4', '7/10', '3/5', '75/100'], a: '3/4' },
    { q: 'What is the volume of a cube with side length 3?', o: ['9', '18', '27', '36'], a: '27' },
    { q: 'If f(x) = x² - 4, what is f(3)?', o: ['5', '9', '13', '6'], a: '5' },
    { q: 'Simplify: (3x²)³', o: ['9x⁶', '27x⁶', '27x⁵', '9x⁵'], a: '27x⁶' },
    { q: 'What is the mean of {4, 8, 12}?', o: ['6', '8', '10', '12'], a: '8' },
    { q: 'Solve: x² = 49', o: ['7', '-7', '7 and -7', '24.5'], a: '7 and -7' },
    { q: 'A circle has circumference 10π. What is its radius?', o: ['5', '10', '15', '20'], a: '5' },
    { q: 'What is the least common multiple of 4 and 6?', o: ['2', '12', '24', '8'], a: '12' },
    { q: 'If a car travels 120 miles in 2 hours, what is its average speed?', o: ['40 mph', '50 mph', '60 mph', '70 mph'], a: '60 mph' },
    { q: 'What is the value of 3² + 4²?', o: ['12', '25', '49', '7'], a: '25' }
  ];

  const satReading = [
    { q: 'What is the main purpose of an introduction paragraph in an essay?', o: ['To present the thesis and engage the reader', 'To list every detail', 'To conclude the argument', 'To cite sources'], a: 'To present the thesis and engage the reader' },
    { q: 'The word "benevolent" most nearly means...', o: ['Kind', 'Cruel', 'Wealthy', 'Quiet'], a: 'Kind' },
    { q: 'Which of the following best describes the author\'s likely tone in a scientific article?', o: ['Objective and formal', 'Angry and informal', 'Humorous', 'Romantic'], a: 'Objective and formal' },
    { q: 'An "antonym" of "ephemeral" is...', o: ['Permanent', 'Brief', 'Shining', 'Fragile'], a: 'Permanent' },
    { q: 'What does it mean to "infer" something from a text?', o: ['To conclude it from evidence even if not stated', 'To guess randomly', 'To copy it', 'To memorize it'], a: 'To conclude it from evidence even if not stated' },
    { q: 'A passage that compares two things using "like" or "as" uses which literary device?', o: ['Simile', 'Metaphor', 'Alliteration', 'Personification'], a: 'Simile' },
    { q: 'The word "ubiquitous" means...', o: ['Present everywhere', 'Rare', 'Hidden', 'Tiny'], a: 'Present everywhere' },
    { q: 'Which sentence best summarizes the idea that "hard work beats talent when talent fails to work hard"?', o: ['Consistent effort outperforms raw ability', 'Talent is useless', 'Hard work always fails', 'Only talent matters'], a: 'Consistent effort outperforms raw ability' },
    { q: '"Diligent" most nearly means...', o: ['Hardworking', 'Careless', 'Famous', 'Bored'], a: 'Hardworking' },
    { q: 'A "hypothesis" in a text is...', o: ['A testable proposed explanation', 'A proven fact', 'An opinion', 'A conclusion'], a: 'A testable proposed explanation' },
    { q: 'In persuasive writing, "ethos" refers to...', o: ['Appealing to the author\'s credibility', 'Appealing to logic', 'Appealing to emotion', 'Appealing to fear'], a: 'Appealing to the author\'s credibility' },
    { q: 'The word "meticulous" means...', o: ['Very careful and precise', 'Messy', 'Lazy', 'Quick'], a: 'Very careful and precise' },
    { q: 'Which is the best example of a thesis statement?', o: ['This essay argues that voting age should be lowered to 16.', 'Voting is important.', 'Some people vote.', 'Many topics exist.'], a: 'This essay argues that voting age should be lowered to 16.' },
    { q: 'An "allusion" is...', o: ['A reference to a well-known person, place, or event', 'A kind of poem', 'A logical fallacy', 'A rhyme'], a: 'A reference to a well-known person, place, or event' },
    { q: 'The word "prodigious" most nearly means...', o: ['Remarkably large or impressive', 'Extremely small', 'Ordinary', 'Predictable'], a: 'Remarkably large or impressive' },
    { q: 'What is the purpose of a "counterargument" in an essay?', o: ['To address an opposing view and strengthen your case', 'To confuse the reader', 'To end the essay', 'To add length'], a: 'To address an opposing view and strengthen your case' },
    { q: '"Ambivalent" means...', o: ['Having mixed or conflicting feelings', 'Strongly supportive', 'Indifferent', 'Angry'], a: 'Having mixed or conflicting feelings' },
    { q: 'A "primary source" is...', o: ['An original document or firsthand account', 'A textbook summary', 'An encyclopedia entry', 'A news opinion piece'], a: 'An original document or firsthand account' },
    { q: 'The word "lucid" most nearly means...', o: ['Clear and easy to understand', 'Confusing', 'Dark', 'Slow'], a: 'Clear and easy to understand' },
    { q: 'In a reading passage, "tone" refers to...', o: ['The author\'s attitude toward the subject', 'The volume of the text', 'The number of words', 'The sentence length'], a: 'The author\'s attitude toward the subject' },
    { q: '"Frugal" most nearly means...', o: ['Thrifty, avoiding waste', 'Extravagant', 'Weak', 'Noisy'], a: 'Thrifty, avoiding waste' },
    { q: 'A "metaphor" is a comparison...', o: ['Without using "like" or "as"', 'Using "like" or "as"', 'That rhymes', 'Of sounds'], a: 'Without using "like" or "as"' },
    { q: 'The word "tenacious" most nearly means...', o: ['Persistent and determined', 'Weak', 'Relaxed', 'Confused'], a: 'Persistent and determined' },
    { q: 'Which type of writing tells a story?', o: ['Narrative', 'Expository', 'Persuasive', 'Descriptive'], a: 'Narrative' },
    { q: '"Candid" most nearly means...', o: ['Honest and straightforward', 'Secretive', 'Harsh', 'Sweet'], a: 'Honest and straightforward' }
  ];

  const satWriting = [
    { q: 'Choose the correctly punctuated sentence.', o: ['She read, the book quickly.', 'She read the book quickly.', 'She read the, book quickly.', 'She, read the book quickly.'], a: 'She read the book quickly.' },
    { q: 'Which sentence uses a semicolon correctly?', o: ['I studied hard; I passed the test.', 'I studied hard; and I passed.', 'I studied; hard I passed.', 'I; studied hard I passed.'], a: 'I studied hard; I passed the test.' },
    { q: 'Identify the subject in: "The quick brown fox jumps over the lazy dog."', o: ['Fox', 'Brown', 'Jumps', 'Dog'], a: 'Fox' },
    { q: '"The committee ___ decided on a date." Which verb form is correct?', o: ['has', 'have', 'was been', 'is being'], a: 'has' },
    { q: 'Which is correct?', o: ['Its a sunny day.', 'It\'s a sunny day.', 'Its\' a sunny day.', 'It is\' a sunny day.'], a: 'It\'s a sunny day.' },
    { q: 'Choose the correct sentence.', o: ['The dog wagged its tail.', 'The dog wagged it\'s tail.', 'The dog wagged its\' tail.', 'The dog wagged its tail. (both A and D)'], a: 'The dog wagged its tail.' },
    { q: 'What is the plural of "child"?', o: ['Childs', 'Children', 'Childes', 'Child'], a: 'Children' },
    { q: '"Neither the students nor the teacher ___ happy."', o: ['was', 'were', 'are', 'is being'], a: 'was' },
    { q: 'Which word is a conjunction?', o: ['and', 'quickly', 'beautiful', 'under'], a: 'and' },
    { q: 'Which is an example of a run-on sentence?', o: ['I love pizza it is my favorite food.', 'I love pizza; it is my favorite food.', 'I love pizza, and it is my favorite food.', 'I love pizza. It is my favorite food.'], a: 'I love pizza it is my favorite food.' },
    { q: 'Choose the most concise sentence.', o: ['The reason is because of the fact that we were late.', 'We were late.', 'Due to the fact that we were late, the reason is.', 'The reason for the lateness is because.'], a: 'We were late.' },
    { q: '"Each of the players ___ their own water." (formal style)', o: ['has', 'have', 'are having', 'is having'], a: 'has' },
    { q: 'Which sentence uses an apostrophe correctly for possession?', o: ['The girls\' locker room', 'The girl\'s locker room\'s', 'The girls locker rooms', 'The girls\'s locker room'], a: 'The girls\' locker room' },
    { q: 'Which is a correct use of "they\'re"?', o: ['They\'re going to the store.', 'The books are over they\'re.', 'They\'re dog is friendly.', 'We saw they\'re.'], a: 'They\'re going to the store.' },
    { q: 'Identify the independent clause: "Because it was raining, we stayed inside."', o: ['we stayed inside', 'Because it was raining', 'it was raining', 'Because we stayed'], a: 'we stayed inside' },
    { q: 'Which sentence correctly uses a comma after an introductory clause?', o: ['After the storm passed, the sun came out.', 'After the storm passed the sun came out.', 'After, the storm passed the sun came out.', 'The sun came out after, the storm passed.'], a: 'After the storm passed, the sun came out.' },
    { q: 'Choose the sentence with correct subject-verb agreement.', o: ['There are several reasons for the delay.', 'There is several reasons for the delay.', 'There be several reasons for the delay.', 'There are several reason for the delay.'], a: 'There are several reasons for the delay.' },
    { q: 'Which sentence uses "affect" correctly?', o: ['The news did not affect her mood.', 'The news did not effect her mood.', 'Her mood was a big affect.', 'The effect the news had was to affect her mood.'], a: 'The news did not affect her mood.' },
    { q: 'Choose the clearest combination: "The play was canceled. It was raining heavily."', o: ['The play was canceled because it was raining heavily.', 'The play was canceled, it was raining heavily.', 'It was raining heavily and the play was canceled because.', 'The play, because it was raining heavily, canceled.'], a: 'The play was canceled because it was raining heavily.' },
    { q: 'Which option uses correct parallelism?', o: ['She likes hiking, swimming, and biking.', 'She likes to hike, swimming, and biking.', 'She likes hiking, to swim, and biking.', 'She likes hiking, swimming, and to bike.'], a: 'She likes hiking, swimming, and biking.' },
    { q: 'Which word correctly fills the blank: "We traveled ___ far north."', o: ['too', 'to', 'two', 'tu'], a: 'too' },
    { q: 'Which sentence uses "whom" correctly?', o: ['Whom did you meet at the conference?', 'Whom is sitting there?', 'Whom is your friend?', 'I asked whom wanted tea.'], a: 'Whom did you meet at the conference?' },
    { q: 'Which sentence correctly uses a dash for emphasis?', o: ['The answer — a total surprise — came at noon.', 'The answer - a total surprise - came, at noon.', 'The answer came at, noon — a total surprise.', '— The answer came at noon a total surprise.'], a: 'The answer — a total surprise — came at noon.' },
    { q: 'Which sentence correctly uses an appositive?', o: ['My brother, an engineer, works overseas.', 'My brother an engineer works overseas.', 'My, brother an engineer, works overseas.', 'My brother works, overseas an engineer.'], a: 'My brother, an engineer, works overseas.' },
    { q: 'Which word best fills the blank to match the academic style: "The findings are ___ because the sample size is small."', o: ['dubious', 'conclusive', 'certain', 'authoritative'], a: 'dubious' }
  ];

  const satScience = [
    { q: 'What is the powerhouse of the cell?', o: ['Mitochondria', 'Nucleus', 'Ribosome', 'Cell membrane'], a: 'Mitochondria' },
    { q: 'What gas do plants absorb during photosynthesis?', o: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'], a: 'Carbon dioxide' },
    { q: 'Water is made of which two elements?', o: ['Hydrogen and Oxygen', 'Hydrogen and Nitrogen', 'Oxygen and Carbon', 'Oxygen and Helium'], a: 'Hydrogen and Oxygen' },
    { q: 'Which force pulls objects toward the center of Earth?', o: ['Gravity', 'Friction', 'Magnetism', 'Inertia'], a: 'Gravity' },
    { q: 'What is the chemical symbol for gold?', o: ['Au', 'Ag', 'Go', 'Gd'], a: 'Au' },
    { q: 'The process by which plants make food using sunlight is called...', o: ['Photosynthesis', 'Respiration', 'Digestion', 'Transpiration'], a: 'Photosynthesis' },
    { q: 'What is the boiling point of water at sea level?', o: ['100°C', '50°C', '80°C', '120°C'], a: '100°C' },
    { q: 'Which planet is known as the Red Planet?', o: ['Mars', 'Venus', 'Jupiter', 'Mercury'], a: 'Mars' },
    { q: 'What is the largest organ in the human body?', o: ['Skin', 'Liver', 'Brain', 'Heart'], a: 'Skin' },
    { q: 'Which particle has a negative charge?', o: ['Electron', 'Proton', 'Neutron', 'Nucleus'], a: 'Electron' },
    { q: 'What is the speed of light approximately?', o: ['300,000 km/s', '300 km/s', '3,000 km/s', '30,000 km/s'], a: '300,000 km/s' },
    { q: 'The hardest natural substance on Earth is...', o: ['Diamond', 'Gold', 'Iron', 'Quartz'], a: 'Diamond' },
    { q: 'Which blood type is the universal donor?', o: ['O negative', 'AB positive', 'A positive', 'B negative'], a: 'O negative' },
    { q: 'DNA stands for...', o: ['Deoxyribonucleic acid', 'Dynamic nuclear acid', 'Deoxyribose nucleic amino', 'Double nuclear acid'], a: 'Deoxyribonucleic acid' },
    { q: 'What is the most abundant gas in Earth\'s atmosphere?', o: ['Nitrogen', 'Oxygen', 'Carbon dioxide', 'Argon'], a: 'Nitrogen' },
    { q: 'The theory of evolution was proposed by...', o: ['Charles Darwin', 'Isaac Newton', 'Albert Einstein', 'Gregor Mendel'], a: 'Charles Darwin' },
    { q: 'What is the unit of force?', o: ['Newton', 'Joule', 'Watt', 'Pascal'], a: 'Newton' },
    { q: 'Which of these is a renewable energy source?', o: ['Solar', 'Coal', 'Oil', 'Natural gas'], a: 'Solar' },
    { q: 'The smallest unit of matter is...', o: ['Atom', 'Molecule', 'Cell', 'Electron cloud'], a: 'Atom' },
    { q: 'What pH value indicates neutral (neither acidic nor basic)?', o: ['7', '0', '14', '10'], a: '7' }
  ];

  // ---------------- IB ----------------
  const ibMath = [
    { q: 'What is the derivative of x²?', o: ['2x', 'x', '2', 'x²'], a: '2x' },
    { q: 'What is the integral of 2x with respect to x?', o: ['x² + C', '2x² + C', 'x + C', '2 + C'], a: 'x² + C' },
    { q: 'Solve log₂(8) = ?', o: ['3', '2', '4', '8'], a: '3' },
    { q: 'What is the limit of (sin x)/x as x approaches 0?', o: ['1', '0', 'undefined', '∞'], a: '1' },
    { q: 'The sum of an arithmetic series with first term 1, common difference 2, and 10 terms is...', o: ['100', '110', '90', '120'], a: '100' },
    { q: 'In a geometric sequence, each term is found by...', o: ['Multiplying by a constant ratio', 'Adding a constant difference', 'Squaring the previous term', 'Taking the square root'], a: 'Multiplying by a constant ratio' },
    { q: 'What is the determinant of the 2×2 matrix [[1,2],[3,4]]?', o: ['-2', '2', '10', '-10'], a: '-2' },
    { q: 'The probability of flipping a coin and getting heads is...', o: ['1/2', '1/3', '1/4', '1'], a: '1/2' },
    { q: 'What is the value of e (Euler\'s number) approximately?', o: ['2.718', '3.142', '1.618', '2.512'], a: '2.718' },
    { q: 'A vector with magnitude 5 and direction 0° has components...', o: ['(5, 0)', '(0, 5)', '(5, 5)', '(-5, 0)'], a: '(5, 0)' },
    { q: 'The dot product of vectors (1, 2) and (3, 4) is...', o: ['11', '10', '12', '14'], a: '11' },
    { q: 'What is the second derivative of x³?', o: ['6x', '3x²', '6', 'x'], a: '6x' },
    { q: 'A standard deck of cards has how many cards?', o: ['52', '40', '48', '60'], a: '52' },
    { q: 'The equation of a circle with center (0,0) and radius 5 is...', o: ['x² + y² = 25', 'x² + y² = 5', 'x² - y² = 25', 'x + y = 5'], a: 'x² + y² = 25' },
    { q: 'What is the length of the hypotenuse of a right triangle with legs 6 and 8?', o: ['10', '12', '14', '9'], a: '10' },
    { q: 'The factorial of 0 (0!) is defined as...', o: ['1', '0', 'undefined', 'infinity'], a: '1' },
    { q: 'What is the common ratio of the sequence 2, 6, 18, 54...?', o: ['3', '4', '6', '2'], a: '3' },
    { q: 'The derivative of sin(x) is...', o: ['cos(x)', '-cos(x)', '-sin(x)', 'tan(x)'], a: 'cos(x)' },
    { q: 'The integral of eˣ with respect to x is...', o: ['eˣ + C', 'xeˣ + C', 'ln(eˣ) + C', 'e + C'], a: 'eˣ + C' },
    { q: 'What is the mode of {1, 2, 2, 3, 4}?', o: ['2', '1', '3', '4'], a: '2' },
    { q: 'If A and B are mutually exclusive events with P(A)=0.3 and P(B)=0.4, what is P(A or B)?', o: ['0.7', '0.12', '0.58', '0.3'], a: '0.7' },
    { q: 'What is the range of the function f(x) = x² (for real x)?', o: ['y ≥ 0', 'All real numbers', 'y > 0', 'y < 0'], a: 'y ≥ 0' },
    { q: 'The base of the natural logarithm is...', o: ['e', '10', '2', 'π'], a: 'e' },
    { q: 'Solve for x: 2ˣ = 32', o: ['5', '4', '6', '16'], a: '5' },
    { q: 'The standard normal distribution has mean...', o: ['0', '1', '5', '10'], a: '0' },
    { q: 'What is the value of sin(30°)?', o: ['1/2', '√3/2', '1', '√2/2'], a: '1/2' },
    { q: 'A function that maps real numbers to real numbers and repeats after a fixed interval is called...', o: ['Periodic', 'Linear', 'Exponential', 'Logarithmic'], a: 'Periodic' },
    { q: 'What is tan(45°)?', o: ['1', '0', '√2', '2'], a: '1' },
    { q: 'Integration and differentiation are...', o: ['Inverse operations', 'The same operation', 'Unrelated', 'Only for polynomials'], a: 'Inverse operations' },
    { q: 'The area under a normal curve between -1σ and +1σ is approximately...', o: ['68%', '95%', '99%', '50%'], a: '68%' }
  ];

  const ibBiology = [
    { q: 'What is the function of ribosomes?', o: ['Protein synthesis', 'Energy production', 'Cell division', 'Storage of DNA'], a: 'Protein synthesis' },
    { q: 'Which organelle contains the genetic material of a eukaryotic cell?', o: ['Nucleus', 'Mitochondria', 'Ribosome', 'Vacuole'], a: 'Nucleus' },
    { q: 'What process converts glucose into ATP in the absence of oxygen?', o: ['Anaerobic respiration (fermentation)', 'Photosynthesis', 'Oxidative phosphorylation', 'Glycolysis'], a: 'Anaerobic respiration (fermentation)' },
    { q: 'Which base pairs with adenine in DNA?', o: ['Thymine', 'Cytosine', 'Guanine', 'Uracil'], a: 'Thymine' },
    { q: 'The site of photosynthesis in plant cells is the...', o: ['Chloroplast', 'Mitochondrion', 'Nucleus', 'Ribosome'], a: 'Chloroplast' },
    { q: 'What is the basic structural and functional unit of all living organisms?', o: ['Cell', 'Atom', 'Molecule', 'Tissue'], a: 'Cell' },
    { q: 'Diffusion is the movement of particles from...', o: ['High to low concentration', 'Low to high concentration', 'Equal concentration', 'Any direction randomly'], a: 'High to low concentration' },
    { q: 'Which type of cell has a cell wall made of cellulose?', o: ['Plant cell', 'Animal cell', 'Bacterial cell', 'Fungal cell'], a: 'Plant cell' },
    { q: 'Enzymes are biological...', o: ['Catalysts', 'Inhibitors', 'Substrates', 'Products'], a: 'Catalysts' },
    { q: 'Which organelle is responsible for detoxification and lipid synthesis?', o: ['Smooth endoplasmic reticulum', 'Rough endoplasmic reticulum', 'Lysosome', 'Golgi apparatus'], a: 'Smooth endoplasmic reticulum' },
    { q: 'The "powerhouse of the cell" is the...', o: ['Mitochondrion', 'Nucleus', 'Chloroplast', 'Ribosome'], a: 'Mitochondrion' },
    { q: 'What is osmosis?', o: ['Movement of water across a semipermeable membrane', 'Movement of solutes freely', 'Movement of gases', 'Movement of heat'], a: 'Movement of water across a semipermeable membrane' },
    { q: 'Which macromolecule stores genetic information?', o: ['Nucleic acids (DNA/RNA)', 'Proteins', 'Carbohydrates', 'Lipids'], a: 'Nucleic acids (DNA/RNA)' },
    { q: 'The enzyme that unzips DNA during replication is...', o: ['Helicase', 'Polymerase', 'Ligase', 'Primase'], a: 'Helicase' },
    { q: 'Meiosis results in how many daughter cells?', o: ['4', '2', '8', '1'], a: '4' },
    { q: 'Which blood component carries oxygen?', o: ['Red blood cells', 'White blood cells', 'Platelets', 'Plasma'], a: 'Red blood cells' },
    { q: 'Tissues that transmit nerve impulses are called...', o: ['Nervous tissue', 'Muscle tissue', 'Connective tissue', 'Epithelial tissue'], a: 'Nervous tissue' },
    { q: 'What is the role of the pancreas?', o: ['Regulates blood sugar and produces digestive enzymes', 'Pumps blood', 'Filters waste', 'Stores bile'], a: 'Regulates blood sugar and produces digestive enzymes' },
    { q: 'The theory that all living things are made of cells is called...', o: ['Cell theory', 'Evolution theory', 'Germ theory', 'Atomic theory'], a: 'Cell theory' },
    { q: 'Glycolysis occurs in the...', o: ['Cytoplasm', 'Mitochondria', 'Nucleus', 'Chloroplast'], a: 'Cytoplasm' },
    { q: 'Which molecule carries oxygen in red blood cells?', o: ['Hemoglobin', 'Insulin', 'Collagen', 'Amylase'], a: 'Hemoglobin' },
    { q: 'Which type of bond holds the two strands of DNA together?', o: ['Hydrogen bonds', 'Peptide bonds', 'Ionic bonds', 'Disulfide bonds'], a: 'Hydrogen bonds' },
    { q: 'The movement of water across a semipermeable membrane is called...', o: ['Osmosis', 'Diffusion', 'Active transport', 'Transpiration'], a: 'Osmosis' },
    { q: 'Which enzyme breaks down starch into sugars?', o: ['Amylase', 'Protease', 'Lipase', 'Catalase'], a: 'Amylase' },
    { q: 'Which hormone regulates blood glucose concentration?', o: ['Insulin', 'Adrenaline', 'Thyroxine', 'Cortisol'], a: 'Insulin' },
    { q: 'The basic unit of heredity is the...', o: ['Gene', 'Protein', 'Cell', 'Nucleus'], a: 'Gene' },
    { q: 'Which of these is a function of the liver?', o: ['Detoxification of blood', 'Producing insulin', 'Filtering red blood cells', 'Digesting fats in the stomach'], a: 'Detoxification of blood' },
    { q: 'In aerobic respiration, glucose is broken down to produce...', o: ['Carbon dioxide, water, and ATP', 'Lactic acid and ATP', 'Ethanol and carbon dioxide', 'Glucose and oxygen'], a: 'Carbon dioxide, water, and ATP' },
    { q: 'Prokaryotic cells differ from eukaryotic cells because they lack...', o: ['A membrane-bound nucleus', 'DNA', 'Ribosomes', 'A cell wall'], a: 'A membrane-bound nucleus' },
    { q: 'Which organelle packages and modifies proteins for export?', o: ['Golgi apparatus', 'Lysosome', 'Nucleolus', 'Peroxisome'], a: 'Golgi apparatus' }
  ];

  const ibChemistry = [
    { q: 'What is the chemical formula for water?', o: ['H₂O', 'CO₂', 'NaCl', 'O₂'], a: 'H₂O' },
    { q: 'What is the charge of a proton?', o: ['+1', '-1', '0', '+2'], a: '+1' },
    { q: 'Which element has the atomic number 6?', o: ['Carbon', 'Nitrogen', 'Oxygen', 'Boron'], a: 'Carbon' },
    { q: 'What is the chemical symbol for sodium?', o: ['Na', 'So', 'S', 'Sd'], a: 'Na' },
    { q: 'An atom with 11 protons and 12 neutrons has a mass number of...', o: ['23', '11', '12', '22'], a: '23' },
    { q: 'Which type of bond involves the sharing of electron pairs?', o: ['Covalent', 'Ionic', 'Metallic', 'Hydrogen'], a: 'Covalent' },
    { q: 'What is the pH of a strong acid?', o: ['0-1', '7', '10-12', '5-6'], a: '0-1' },
    { q: 'The chemical formula for table salt is...', o: ['NaCl', 'KCl', 'NaO', 'CaCl'], a: 'NaCl' },
    { q: 'What is the atomic number of oxygen?', o: ['8', '6', '16', '10'], a: '8' },
    { q: 'Which of the following is a noble gas?', o: ['Argon', 'Oxygen', 'Hydrogen', 'Fluorine'], a: 'Argon' },
    { q: 'Balance: H₂ + O₂ → H₂O. What coefficient goes before H₂O?', o: ['2', '1', '3', '4'], a: '2' },
    { q: 'An ionic bond forms between...', o: ['A metal and a non-metal', 'Two non-metals', 'Two metals', 'Two gases'], a: 'A metal and a non-metal' },
    { q: 'What is the molar mass of carbon dioxide (CO₂)? (C=12, O=16)', o: ['44 g/mol', '28 g/mol', '32 g/mol', '40 g/mol'], a: '44 g/mol' },
    { q: 'Which state of matter has a definite shape and volume?', o: ['Solid', 'Liquid', 'Gas', 'Plasma'], a: 'Solid' },
    { q: 'The process of a solid turning directly into a gas is called...', o: ['Sublimation', 'Evaporation', 'Condensation', 'Melting'], a: 'Sublimation' },
    { q: 'What is the valency of oxygen?', o: ['2', '1', '3', '4'], a: '2' },
    { q: 'Which acid is found in lemon juice?', o: ['Citric acid', 'Hydrochloric acid', 'Sulfuric acid', 'Acetic acid'], a: 'Citric acid' },
    { q: 'Isotopes are atoms of the same element with different...', o: ['Number of neutrons', 'Number of protons', 'Number of electrons', 'Chemical properties'], a: 'Number of neutrons' },
    { q: 'Which of the following is a chemical change?', o: ['Rusting of iron', 'Melting of ice', 'Dissolving sugar', 'Cutting paper'], a: 'Rusting of iron' },
    { q: 'The chemical formula for sulfuric acid is...', o: ['H₂SO₄', 'HCl', 'HNO₃', 'H₂CO₃'], a: 'H₂SO₄' },
    { q: 'Which subatomic particle has no charge?', o: ['Neutron', 'Proton', 'Electron', 'Ion'], a: 'Neutron' },
    { q: 'What is the oxidation state of oxygen in H₂O₂ (hydrogen peroxide)?', o: ['-1', '-2', '0', '+2'], a: '-1' },
    { q: 'Which element is a halogen?', o: ['Chlorine', 'Sodium', 'Calcium', 'Sulfur'], a: 'Chlorine' },
    { q: 'What is a catalyst?', o: ['A substance that speeds up a reaction without being used up', 'A substance that slows a reaction', 'A product of a reaction', 'A type of solvent'], a: 'A substance that speeds up a reaction without being used up' },
    { q: 'The process of rusting requires...', o: ['Oxygen and water', 'Only water', 'Only oxygen', 'Carbon dioxide'], a: 'Oxygen and water' },
    { q: 'Which of these is a strong acid?', o: ['Sulfuric acid', 'Acetic acid', 'Lactic acid', 'Carbonic acid'], a: 'Sulfuric acid' },
    { q: 'Alkanes are...', o: ['Saturated hydrocarbons', 'Unsaturated hydrocarbons', 'Carboxylic acids', 'Alcohols'], a: 'Saturated hydrocarbons' },
    { q: 'Which ion makes a solution acidic?', o: ['H⁺', 'OH⁻', 'Cl⁻', 'Na⁺'], a: 'H⁺' },
    { q: 'Covalent bonds form between...', o: ['Two non-metals', 'A metal and a non-metal', 'Two metals', 'An ion and a neutral atom'], a: 'Two non-metals' },
    { q: 'Which process is exothermic (releases heat)?', o: ['Freezing', 'Melting', 'Evaporation', 'Sublimation', 'Deposition'], a: 'Freezing' }
  ];

  const ibPhysics = [
    { q: 'What is the SI unit of force?', o: ['Newton', 'Joule', 'Watt', 'Pascal'], a: 'Newton' },
    { q: 'Which equation represents Newton\'s second law?', o: ['F = ma', 'F = mv', 'F = m/a', 'E = mc²'], a: 'F = ma' },
    { q: 'What is the speed of light in a vacuum?', o: ['3 × 10⁸ m/s', '3 × 10⁶ m/s', '3 × 10¹⁰ m/s', '3 × 10⁵ m/s'], a: '3 × 10⁸ m/s' },
    { q: 'The unit of work/energy is the...', o: ['Joule', 'Newton', 'Watt', 'Volt'], a: 'Joule' },
    { q: 'What is the formula for kinetic energy?', o: ['1/2 mv²', 'mv', 'mgh', 'ma'], a: '1/2 mv²' },
    { q: 'Which electromagnetic wave has the highest frequency?', o: ['Gamma rays', 'X-rays', 'Visible light', 'Radio waves'], a: 'Gamma rays' },
    { q: 'What is the gravitational acceleration on Earth\'s surface?', o: ['9.8 m/s²', '6.7 m/s²', '12 m/s²', '1 m/s²'], a: '9.8 m/s²' },
    { q: 'The unit of electric current is the...', o: ['Ampere', 'Volt', 'Ohm', 'Coulomb'], a: 'Ampere' },
    { q: 'Momentum is defined as...', o: ['Mass × velocity', 'Mass × acceleration', 'Force × distance', 'Force × time'], a: 'Mass × velocity' },
    { q: 'Which law states that energy cannot be created or destroyed, only transformed?', o: ['First law of thermodynamics', 'Second law of thermodynamics', 'Newton\'s first law', 'Ohm\'s law'], a: 'First law of thermodynamics' },
    { q: 'Resistance is measured in...', o: ['Ohms', 'Watts', 'Volts', 'Amperes'], a: 'Ohms' },
    { q: 'A current of 2A flows through a 3Ω resistor. What is the voltage?', o: ['6V', '1.5V', '5V', '2/3V'], a: '6V' },
    { q: 'Which of these is a vector quantity?', o: ['Velocity', 'Speed', 'Mass', 'Temperature'], a: 'Velocity' },
    { q: 'The Doppler effect describes the change in frequency of a wave due to...', o: ['Relative motion between source and observer', 'Temperature', 'Pressure', 'Amplitude'], a: 'Relative motion between source and observer' },
    { q: 'What is the frequency of a wave with a period of 0.25 s?', o: ['4 Hz', '0.25 Hz', '25 Hz', '40 Hz'], a: '4 Hz' },
    { q: 'Which particle is negatively charged?', o: ['Electron', 'Proton', 'Neutron', 'Positron'], a: 'Electron' },
    { q: 'E = mc² was proposed by...', o: ['Albert Einstein', 'Isaac Newton', 'Niels Bohr', 'James Maxwell'], a: 'Albert Einstein' },
    { q: 'Sound waves are...', o: ['Longitudinal waves', 'Transverse waves', 'Electromagnetic waves', 'Stationary waves'], a: 'Longitudinal waves' },
    { q: 'The unit of power is the...', o: ['Watt', 'Joule', 'Newton', 'Volt'], a: 'Watt' },
    { q: 'Which color of visible light has the shortest wavelength?', o: ['Violet', 'Red', 'Green', 'Yellow'], a: 'Violet' },
    { q: 'Friction is a force that...', o: ['Opposes motion', 'Causes motion', 'Creates energy', 'Reduces mass'], a: 'Opposes motion' },
    { q: 'The principle of conservation of momentum states that total momentum in a closed system...', o: ['Remains constant', 'Increases', 'Decreases', 'Becomes zero'], a: 'Remains constant' },
    { q: 'Which of these is a transverse wave?', o: ['Light', 'Sound', 'Seismic P-wave', 'Slinky compression'], a: 'Light' },
    { q: 'The SI unit of electric charge is the...', o: ['Coulomb', 'Ampere', 'Volt', 'Ohm'], a: 'Coulomb' },
    { q: 'A simple pendulum with a longer string has a...', o: ['Longer period', 'Shorter period', 'Same period', 'Faster swing'], a: 'Longer period' }
  ];

  const ibHistory = [
    { q: 'Which year did World War II end?', o: ['1945', '1939', '1941', '1948'], a: '1945' },
    { q: 'The Cold War was primarily between...', o: ['The USA and USSR', 'Germany and France', 'China and Japan', 'Britain and Italy'], a: 'The USA and USSR' },
    { q: 'The Berlin Wall fell in which year?', o: ['1989', '1985', '1991', '1979'], a: '1989' },
    { q: 'Who was the leader of the Soviet Union during the Cuban Missile Crisis?', o: ['Nikita Khrushchev', 'Joseph Stalin', 'Leonid Brezhnev', 'Vladimir Lenin'], a: 'Nikita Khrushchev' },
    { q: 'The assassination of Archduke Franz Ferdinand triggered...', o: ['World War I', 'World War II', 'The Cold War', 'The French Revolution'], a: 'World War I' },
    { q: 'Which treaty officially ended World War I?', o: ['Treaty of Versailles', 'Treaty of Paris', 'Treaty of Ghent', 'Treaty of Rome'], a: 'Treaty of Versailles' },
    { q: 'The Industrial Revolution began in which country?', o: ['Britain', 'Germany', 'France', 'United States'], a: 'Britain' },
    { q: 'The League of Nations was established after which war?', o: ['World War I', 'World War II', 'The Napoleonic Wars', 'The Cold War'], a: 'World War I' },
    { q: 'The term "Genocide" was coined in response to events during...', o: ['World War II', 'World War I', 'The Cold War', 'The Korean War'], a: 'World War II' },
    { q: 'The Cuban Revolution brought which leader to power in 1959?', o: ['Fidel Castro', 'Che Guevara', 'Batista', 'Salvador Allende'], a: 'Fidel Castro' },
    { q: 'What was the Marshall Plan?', o: ['US aid to rebuild Western Europe after WWII', 'A military alliance', 'A peace treaty', 'A trade embargo'], a: 'US aid to rebuild Western Europe after WWII' },
    { q: 'The United Nations was founded in which year?', o: ['1945', '1919', '1939', '1950'], a: '1945' },
    { q: 'The Opium Wars took place between China and...', o: ['Britain', 'Japan', 'France', 'Russia'], a: 'Britain' },
    { q: 'Apartheid was a system of racial segregation enforced in...', o: ['South Africa', 'India', 'Brazil', 'Australia'], a: 'South Africa' },
    { q: 'The Indian independence movement achieved independence from Britain in...', o: ['1947', '1935', '1950', '1922'], a: '1947' },
    { q: 'Which event is considered the start of the Great Depression?', o: ['The 1929 Wall Street Crash', 'World War I', 'The Dust Bowl', 'The 1936 Olympics'], a: 'The 1929 Wall Street Crash' },
    { q: 'The reign of terror was associated with...', o: ['The French Revolution', 'The Russian Revolution', 'The English Civil War', 'The American Revolution'], a: 'The French Revolution' },
    { q: 'The "Iron Curtain" was a term used to describe...', o: ['The division between East and West Europe during the Cold War', 'A type of fence', 'A political party', 'A trade agreement'], a: 'The division between East and West Europe during the Cold War' },
    { q: 'The leader of Germany during most of WWII was...', o: ['Adolf Hitler', 'Kaiser Wilhelm', 'Otto von Bismarck', 'Erwin Rommel'], a: 'Adolf Hitler' },
    { q: 'The Battle of Stalingrad was significant because it...', o: ['Was a turning point in WWII favoring the Soviet Union', 'Ended the war', 'Was the first battle', 'Was a naval battle'], a: 'Was a turning point in WWII favoring the Soviet Union' }
  ];

  const ibEnglish = [
    { q: 'Which Shakespeare play features the character Hamlet?', o: ['Hamlet', 'Romeo and Juliet', 'Macbeth', 'Othello'], a: 'Hamlet' },
    { q: 'In "To Kill a Mockingbird", who is Scout\'s father?', o: ['Atticus Finch', 'Tom Robinson', 'Boo Radley', 'Dill'], a: 'Atticus Finch' },
    { q: 'What is the genre of a text that recounts a personal life story?', o: ['Autobiography', 'Biography', 'Fiction', 'Poetry'], a: 'Autobiography' },
    { q: 'A "protagonist" is...', o: ['The main character of a story', 'The villain', 'A minor character', 'The narrator'], a: 'The main character of a story' },
    { q: 'Which literary work opens with "It was the best of times, it was the worst of times"?', o: ['A Tale of Two Cities', 'Great Expectations', 'Oliver Twist', 'David Copperfield'], a: 'A Tale of Two Cities' },
    { q: 'Personification is...', o: ['Giving human qualities to non-human things', 'Making things bigger', 'A type of rhyme', 'Comparing with like/as'], a: 'Giving human qualities to non-human things' },
    { q: 'Which poem is by Robert Frost and mentions "two roads diverged"?', o: ['The Road Not Taken', 'Stopping by Woods', 'Fire and Ice', 'Nothing Gold Can Stay'], a: 'The Road Not Taken' },
    { q: 'An "antagonist" is...', o: ['The character opposing the protagonist', 'The hero', 'The setting', 'The author'], a: 'The character opposing the protagonist' },
    { q: 'Which genre focuses on humorous exaggeration and the ridiculous?', o: ['Satire', 'Tragedy', 'Epic', 'Lyric'], a: 'Satire' },
    { q: 'What is "foreshadowing"?', o: ['Hints about future events', 'Describing the setting', 'A type of poem', 'Character development'], a: 'Hints about future events' },
    { q: 'Which book features a character named Big Brother?', o: ['1984 by Orwell', 'Animal Farm', 'Brave New World', 'Fahrenheit 451'], a: '1984 by Orwell' },
    { q: 'The term "oxymoron" refers to...', o: ['A combination of contradictory terms', 'A long sentence', 'A repeated sound', 'A moral lesson'], a: 'A combination of contradictory terms' },
    { q: 'Which play by Arthur Miller is about the Salem witch trials?', o: ['The Crucible', 'Death of a Salesman', 'All My Sons', 'A View from the Bridge'], a: 'The Crucible' },
    { q: 'What is an "epic" poem?', o: ['A long narrative poem about heroic deeds', 'A short lyric', 'A rhyming couplet', 'A play'], a: 'A long narrative poem about heroic deeds' },
    { q: 'Who wrote "Pride and Prejudice"?', o: ['Jane Austen', 'Charlotte Brontë', 'Emily Brontë', 'Mary Shelley'], a: 'Jane Austen' },
    { q: 'A "tragic hero" typically...', o: ['Has a fatal flaw leading to their downfall', 'Always wins', 'Never appears', 'Is a minor character'], a: 'Has a fatal flaw leading to their downfall' },
    { q: 'The setting of a story is...', o: ['The time and place of the action', 'The characters', 'The plot', 'The theme'], a: 'The time and place of the action' },
    { q: 'Which novel by George Orwell is a political allegory about farm animals?', o: ['Animal Farm', '1984', 'Down and Out', 'Coming Up for Air'], a: 'Animal Farm' },
    { q: 'A "soliloquy" is...', o: ['A speech by a character alone on stage', 'A dialogue between two characters', 'A narrator\'s comment', 'A scene change'], a: 'A speech by a character alone on stage' },
    { q: 'Which literary device repeats consonant sounds at the start of words?', o: ['Alliteration', 'Assonance', 'Onomatopoeia', 'Rhyme'], a: 'Alliteration' }
  ];

  const ibGeography = [
    { q: 'Which is the largest ocean on Earth?', o: ['Pacific', 'Atlantic', 'Indian', 'Arctic'], a: 'Pacific' },
    { q: 'Which of the following is a tectonic plate?', o: ['Pacific Plate', 'Atlantic Plate', 'Cloud Plate', 'Equator Plate'], a: 'Pacific Plate' },
    { q: 'What is the capital of Australia?', o: ['Canberra', 'Sydney', 'Melbourne', 'Perth'], a: 'Canberra' },
    { q: 'Which river is the longest in the world?', o: ['Nile', 'Amazon', 'Yangtze', 'Mississippi'], a: 'Nile' },
    { q: 'The greenhouse effect is caused primarily by...', o: ['Trapping of heat by greenhouse gases', 'The ozone layer', 'Solar flares', 'Ocean currents'], a: 'Trapping of heat by greenhouse gases' },
    { q: 'What is the highest mountain on Earth?', o: ['Mount Everest', 'K2', 'Kilimanjaro', 'Denali'], a: 'Mount Everest' },
    { q: 'Which country has the largest population?', o: ['India', 'China', 'USA', 'Brazil'], a: 'India' },
    { q: 'A "megacity" is typically defined as a city with more than...', o: ['10 million people', '1 million people', '5 million people', '20 million people'], a: '10 million people' },
    { q: 'The Sahara Desert is located primarily in which continent?', o: ['Africa', 'Asia', 'Australia', 'South America'], a: 'Africa' },
    { q: 'Which of these is a push factor for migration?', o: ['Conflict or famine', 'Better jobs', 'Higher education', 'Family reunion'], a: 'Conflict or famine' },
    { q: 'Urbanization refers to...', o: ['The increasing proportion of people living in cities', 'The decline of farming', 'Climate change', 'Population decline'], a: 'The increasing proportion of people living in cities' },
    { q: 'Which type of plate boundary causes the formation of new crust?', o: ['Divergent', 'Convergent', 'Transform', 'Subduction'], a: 'Divergent' },
    { q: 'What is the capital of Japan?', o: ['Tokyo', 'Osaka', 'Kyoto', 'Nagoya'], a: 'Tokyo' },
    { q: 'Deforestation is the...', o: ['Removal of forests', 'Growth of forests', 'Protection of trees', 'Planting of trees'], a: 'Removal of forests' },
    { q: 'Which line of latitude passes through the middle of the Earth?', o: ['Equator', 'Tropic of Cancer', 'Tropic of Capricorn', 'Prime Meridian'], a: 'Equator' },
    { q: 'A country\'s "GDP" measures...', o: ['The total value of goods and services produced', 'Population size', 'Land area', 'Life expectancy'], a: 'The total value of goods and services produced' },
    { q: 'Which country is an archipelago?', o: ['Japan', 'Brazil', 'Egypt', 'Switzerland'], a: 'Japan' },
    { q: 'The process of a river eroding its banks is called...', o: ['Erosion', 'Deposition', 'Transportation', 'Weathering'], a: 'Erosion' },
    { q: 'Which natural hazard is caused by tectonic movement?', o: ['Earthquakes', 'Hurricanes', 'Droughts', 'Tornadoes'], a: 'Earthquakes' },
    { q: 'The Prime Meridian passes through which city?', o: ['London', 'Paris', 'New York', 'Moscow'], a: 'London' }
  ];

  // ---------------- GCSE ----------------
  const gcseMath = [
    { q: 'What is 15% of 80?', o: ['12', '10', '15', '8'], a: '12' },
    { q: 'Factorize: x² - 9', o: ['(x-3)(x+3)', '(x-9)(x+1)', '(x-3)²', '(x-1)(x+9)'], a: '(x-3)(x+3)' },
    { q: 'What is the gradient of the line y = 5x - 2?', o: ['5', '-2', '2', '-5'], a: '5' },
    { q: 'A triangle has angles 50°, 60°, and x. What is x?', o: ['70°', '60°', '50°', '80°'], a: '70°' },
    { q: 'Simplify: 4a + 3b - 2a + b', o: ['2a + 4b', '6a + 4b', '2a + 2b', '4a + 2b'], a: '2a + 4b' },
    { q: 'What is 2³ × 2⁴?', o: ['2⁷', '2¹²', '2⁵', '4⁷'], a: '2⁷' },
    { q: 'A circle has diameter 10 cm. What is its circumference? (π ≈ 3.14)', o: ['31.4 cm', '78.5 cm', '20 cm', '15.7 cm'], a: '31.4 cm' },
    { q: 'Solve: 5x - 3 = 2x + 9', o: ['4', '3', '6', '5'], a: '4' },
    { q: 'What is the area of a parallelogram with base 6 and height 4?', o: ['24', '12', '20', '30'], a: '24' },
    { q: 'Express 3/5 as a percentage.', o: ['60%', '30%', '50%', '35%'], a: '60%' },
    { q: 'What is the reciprocal of 4?', o: ['1/4', '4', '-4', '1/2'], a: '1/4' },
    { q: 'Round 3.456 to 2 decimal places.', o: ['3.46', '3.45', '3.5', '3.456'], a: '3.46' },
    { q: 'The volume of a cylinder is given by...', o: ['πr²h', '2πr²', 'πr³', '4/3πr³'], a: 'πr²h' },
    { q: 'What is 7 + 3 × 2? (using order of operations)', o: ['13', '20', '17', '16'], a: '13' },
    { q: 'What percentage of 50 is 15?', o: ['30%', '15%', '25%', '20%'], a: '30%' },
    { q: 'Expand: 3(x + 4)', o: ['3x + 12', '3x + 4', 'x + 12', '3x - 12'], a: '3x + 12' },
    { q: 'What is the square of 13?', o: ['169', '196', '144', '121'], a: '169' },
    { q: 'A bag has 3 red and 2 blue marbles. What is the probability of picking red?', o: ['3/5', '2/5', '3/2', '3/8'], a: '3/5' },
    { q: 'Simplify: 12/16', o: ['3/4', '4/5', '6/8', '2/3'], a: '3/4' },
    { q: 'What is the mean of 2, 4, 6, 8?', o: ['5', '4', '6', '10'], a: '5' }
  ];

  const gcseScience = [
    { q: 'What is the chemical symbol for iron?', o: ['Fe', 'Ir', 'In', 'I'], a: 'Fe' },
    { q: 'Which of these is a compound?', o: ['Water (H₂O)', 'Oxygen (O₂)', 'Helium (He)', 'Gold (Au)'], a: 'Water (H₂O)' },
    { q: 'What is the function of the cell membrane?', o: ['Controls what enters and leaves the cell', 'Provides energy', 'Stores DNA', 'Photosynthesis'], a: 'Controls what enters and leaves the cell' },
    { q: 'Which force acts on all objects with mass?', o: ['Gravity', 'Magnetism', 'Friction', 'Buoyancy'], a: 'Gravity' },
    { q: 'What is the product of the reaction between an acid and a base?', o: ['Salt and water', 'Just water', 'Gas and salt', 'Only heat'], a: 'Salt and water' },
    { q: 'The element with symbol C is...', o: ['Carbon', 'Calcium', 'Chlorine', 'Chromium'], a: 'Carbon' },
    { q: 'Which part of the human body produces insulin?', o: ['Pancreas', 'Liver', 'Kidney', 'Heart'], a: 'Pancreas' },
    { q: 'Which type of energy is stored in food?', o: ['Chemical', 'Kinetic', 'Thermal', 'Electrical'], a: 'Chemical' },
    { q: 'A force of 10 N is applied to a mass of 2 kg. What is the acceleration?', o: ['5 m/s²', '20 m/s²', '0.2 m/s²', '10 m/s²'], a: '5 m/s²' },
    { q: 'Which gas is needed for respiration?', o: ['Oxygen', 'Carbon dioxide', 'Nitrogen', 'Helium'], a: 'Oxygen' },
    { q: 'The atomic number of an element equals its number of...', o: ['Protons', 'Neutrons', 'Electrons and neutrons', 'Total particles'], a: 'Protons' },
    { q: 'What is the state of matter where particles are far apart and move freely?', o: ['Gas', 'Solid', 'Liquid', 'Plasma'], a: 'Gas' },
    { q: 'Which organelle carries out photosynthesis in plant cells?', o: ['Chloroplast', 'Mitochondria', 'Nucleus', 'Ribosome'], a: 'Chloroplast' },
    { q: 'What is an ecosystem?', o: ['A community of organisms and their environment interacting', 'A single organism', 'Only plants', 'The non-living parts of an area'], a: 'A community of organisms and their environment interacting' },
    { q: 'Which of the following is a renewable resource?', o: ['Wind', 'Coal', 'Oil', 'Natural gas'], a: 'Wind' },
    { q: 'The pH of pure water at 25°C is...', o: ['7', '0', '14', '5'], a: '7' },
    { q: 'Which process produces gametes (sex cells)?', o: ['Meiosis', 'Mitosis', 'Fertilisation', 'Osmosis'], a: 'Meiosis' },
    { q: 'Which electromagnetic wave has the longest wavelength?', o: ['Radio wave', 'Gamma ray', 'X-ray', 'Visible light'], a: 'Radio wave' },
    { q: 'Which of these is a greenhouse gas?', o: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Argon'], a: 'Carbon dioxide' },
    { q: 'Weight is measured in...', o: ['Newtons', 'Kilograms', 'Grams', 'Litres'], a: 'Newtons' },
    { q: 'Non-metals are found mainly on which side of the periodic table?', o: ['Right side', 'Left side', 'Centre', 'Bottom rows'], a: 'Right side' },
    { q: 'The cell that carries oxygen in the blood is a...', o: ['Red blood cell', 'White blood cell', 'Platelet', 'Nerve cell'], a: 'Red blood cell' },
    { q: 'Which plant tissue transports water from the roots?', o: ['Xylem', 'Phloem', 'Stoma', 'Epidermis'], a: 'Xylem' },
    { q: 'An object\'s resistance to a change in motion is its...', o: ['Mass', 'Weight', 'Volume', 'Density'], a: 'Mass' },
    { q: 'Which substance is a product of aerobic respiration?', o: ['Carbon dioxide and water', 'Oxygen only', 'Lactic acid only', 'Ethanol'], a: 'Carbon dioxide and water' }
  ];

  const gcseEnglish = [
    { q: 'Which is an example of a metaphor?', o: ['The classroom was a zoo.', 'The classroom was as loud as a zoo.', 'The teacher shouted.', 'The students read quietly.'], a: 'The classroom was a zoo.' },
    { q: 'What is the purpose of a conclusion in an essay?', o: ['To summarize and give a final viewpoint', 'To introduce the topic', 'To add more arguments', 'To list references'], a: 'To summarize and give a final viewpoint' },
    { q: 'Which word is a verb?', o: ['Run', 'Quick', 'Under', 'Happy'], a: 'Run' },
    { q: 'The sentence "The sun smiled down on us" uses...', o: ['Personification', 'Simile', 'Alliteration', 'Hyperbole'], a: 'Personification' },
    { q: 'What is the antonym of "ancient"?', o: ['Modern', 'Historic', 'Fragile', 'Remote'], a: 'Modern' },
    { q: 'Which sentence is in the past tense?', o: ['She walked to school.', 'She walks to school.', 'She is walking to school.', 'She will walk to school.'], a: 'She walked to school.' },
    { q: 'A "clause" that can stand alone as a sentence is called...', o: ['Independent', 'Dependent', 'Subordinate', 'Relative'], a: 'Independent' },
    { q: 'What does "SG" stand for when writing? (as in "e.g.")', o: ['For example', 'Ending gracefully', 'Starting great', 'Example given'], a: 'For example' },
    { q: 'Which punctuation introduces a list?', o: ['Colon', 'Comma', 'Semicolon', 'Apostrophe'], a: 'Colon' },
    { q: 'What genre is "Romeo and Juliet"?', o: ['Tragedy', 'Comedy', 'History', 'Romance novel'], a: 'Tragedy' },
    { q: 'Which of these is a simile?', o: ['As brave as a lion', 'The wind whispered', 'The classroom was a zoo', 'He ran quickly'], a: 'As brave as a lion' },
    { q: 'What is the main theme of "An Inspector Calls"?', o: ['Social responsibility', 'Space travel', 'The supernatural', 'Romantic love'], a: 'Social responsibility' },
    { q: 'Which word class is "extremely" in the sentence "She was extremely happy"?', o: ['Adverb', 'Adjective', 'Noun', 'Verb'], a: 'Adverb' },
    { q: 'A semicolon is used to...', o: ['Join two related independent clauses', 'End a sentence', 'Introduce a quote', 'Show possession'], a: 'Join two related independent clauses' },
    { q: 'Which sentence contains alliteration?', o: ['Peter picked a peck of pickled peppers.', 'The sun rose over the hills.', 'He was as quiet as a mouse.', 'She danced gracefully.'], a: 'Peter picked a peck of pickled peppers.' },
    { q: 'What is the effect of a first-person narrator?', o: ['The reader sees events through one character\'s perspective', 'The narrator is all-knowing', 'There is no narrator', 'Events are told from an object\'s view'], a: 'The reader sees events through one character\'s perspective' },
    { q: 'Which term describes a repeated idea or image across a text?', o: ['Motif', 'Protagonist', 'Chronology', 'Dialect'], a: 'Motif' },
    { q: 'Which sentence is an example of a rhetorical question?', o: ['Are you really going to give up now?', 'What time is the meeting?', 'Where did you park the car?', 'Who is coming to dinner?'], a: 'Are you really going to give up now?' },
    { q: 'What does "inference" mean in reading?', o: ['A logical conclusion based on evidence in the text', 'A fact stated directly', 'A summary of the plot', 'A definition in a glossary'], a: 'A logical conclusion based on evidence in the text' },
    { q: 'What is a thesis statement?', o: ['The main argument of an essay', 'The first sentence of a paragraph', 'A rhetorical device', 'A synonym for "topic"'], a: 'The main argument of an essay' }
  ];

  const gcseHistory = [
    { q: 'In which year did the English Civil War end?', o: ['1651', '1642', '1660', '1649'], a: '1651' },
    { q: 'Who was the primary leader of the Soviet Union during WWII?', o: ['Joseph Stalin', 'Lenin', 'Khrushchev', 'Brezhnev'], a: 'Joseph Stalin' },
    { q: 'The Magna Carta was signed in which year?', o: ['1215', '1066', '1415', '1100'], a: '1215' },
    { q: 'Which Tudor monarch ruled from 1558 to 1603?', o: ['Elizabeth I', 'Henry VIII', 'Mary I', 'Edward VI'], a: 'Elizabeth I' },
    { q: 'The Battle of Hastings took place in...', o: ['1066', '1215', '1485', '1135'], a: '1066' },
    { q: 'Who was the British Prime Minister at the start of WWII?', o: ['Neville Chamberlain', 'Winston Churchill', 'Clement Attlee', 'Anthony Eden'], a: 'Neville Chamberlain' },
    { q: 'The Industrial Revolution is associated with rapid...', o: ['Urbanization and industrialization', 'Peace and quiet', 'Population decline', 'Farming only'], a: 'Urbanization and industrialization' },
    { q: 'The Vikings invaded Britain primarily from...', o: ['Scandinavia', 'France', 'Germany', 'Spain'], a: 'Scandinavia' },
    { q: 'Which empire did the Mughals rule?', o: ['India', 'China', 'Russia', 'Rome'], a: 'India' },
    { q: 'Who was the last Queen of the House of Tudor?', o: ['Elizabeth I', 'Mary Tudor', 'Anne Boleyn', 'Victoria'], a: 'Elizabeth I' },
    { q: 'The Great Fire of London started in...', o: ['1666', '1566', '1766', '1649'], a: '1666' },
    { q: 'The Black Death reached England in...', o: ['1348', '1215', '1461', '1536'], a: '1348' },
    { q: 'Which king signed the Magna Carta?', o: ['King John', 'Richard the Lionheart', 'Henry VIII', 'William the Conqueror'], a: 'King John' },
    { q: 'Who was the first English monarch of the Tudor dynasty?', o: ['Henry VII', 'Henry VIII', 'Elizabeth I', 'Richard III'], a: 'Henry VII' },
    { q: 'The English Reformation was mainly driven by...', o: ['Henry VIII\'s wish for an annulment', 'The pope\'s decree', 'A peasants\' revolt', 'The printing of the Bible'], a: 'Henry VIII\'s wish for an annulment' },
    { q: 'The "Triangular Trade" connected...', o: ['Europe, Africa, and the Americas', 'Asia, Africa, and Europe', 'Australia, Europe, and Asia', 'Only Britain and India'], a: 'Europe, Africa, and the Americas' },
    { q: 'In which year did women in Britain first gain the right to vote (aged 30+)?', o: ['1918', '1928', '1900', '1945'], a: '1918' },
    { q: 'Who became king of England after the Battle of Hastings?', o: ['William I (the Conqueror)', 'Harold Godwinson', 'Edward the Confessor', 'Henry II'], a: 'William I (the Conqueror)' },
    { q: 'The Berlin Wall fell in...', o: ['1989', '1990', '1985', '1991'], a: '1989' },
    { q: 'The Cold War rivalry was primarily between...', o: ['The USA and the USSR', 'Britain and France', 'China and Japan', 'Germany and Russia'], a: 'The USA and the USSR' },
    { q: 'The Domesday Book was commissioned in...', o: ['1086', '1066', '1100', '1215'], a: '1086' },
    { q: 'Which event triggered the start of WWI in 1914?', o: ['The assassination of Archduke Franz Ferdinand', 'The invasion of Poland', 'The sinking of the Lusitania', 'The Treaty of Versailles'], a: 'The assassination of Archduke Franz Ferdinand' },
    { q: 'The Cuban Missile Crisis happened in...', o: ['1962', '1956', '1970', '1948'], a: '1962' },
    { q: 'The "Iron Curtain" speech was delivered by...', o: ['Winston Churchill', 'Joseph Stalin', 'John F. Kennedy', 'Margaret Thatcher'], a: 'Winston Churchill' },
    { q: 'The Treaty of Versailles ended which war?', o: ['World War I', 'World War II', 'The American Civil War', 'The Franco-Prussian War'], a: 'World War I' }
  ];

  const gcseGeography = [
    { q: 'Which is the smallest continent?', o: ['Australia', 'Europe', 'Antarctica', 'Asia'], a: 'Australia' },
    { q: 'What is the capital of France?', o: ['Paris', 'Lyon', 'Marseille', 'Nice'], a: 'Paris' },
    { q: 'Which climate is characterized by high temperatures and high rainfall year-round?', o: ['Tropical', 'Polar', 'Desert', 'Temperate'], a: 'Tropical' },
    { q: 'A river\'s point of delivery into a sea or lake is called its...', o: ['Mouth', 'Source', 'Tributary', 'Delta'], a: 'Mouth' },
    { q: 'Which country has the highest number of volcanoes?', o: ['Indonesia', 'Japan', 'Iceland', 'Italy'], a: 'Indonesia' },
    { q: 'The deepest point of the ocean is the...', o: ['Mariana Trench', 'Java Trench', 'Puerto Rico Trench', 'Tonga Trench'], a: 'Mariana Trench' },
    { q: 'What is the main cause of desertification?', o: ['Overgrazing and deforestation', 'High rainfall', 'Cold temperatures', 'Flooding'], a: 'Overgrazing and deforestation' },
    { q: 'The capital of Mexico is...', o: ['Mexico City', 'Guadalajara', 'Cancún', 'Monterrey'], a: 'Mexico City' },
    { q: 'Which layer of the Earth is liquid and generates the magnetic field?', o: ['Outer core', 'Inner core', 'Mantle', 'Crust'], a: 'Outer core' },
    { q: 'Tsunamis are most often caused by...', o: ['Underwater earthquakes', 'High tides', 'Wind', 'Moon phases'], a: 'Underwater earthquakes' },
    { q: 'Which city is known as "the Eternal City"?', o: ['Rome', 'Athens', 'Jerusalem', 'Istanbul'], a: 'Rome' },
    { q: 'Which type of rock forms when magma cools?', o: ['Igneous', 'Sedimentary', 'Metamorphic', 'Fossilised'], a: 'Igneous' },
    { q: 'The majority of the world\'s population lives in...', o: ['Asia', 'Africa', 'Europe', 'North America'], a: 'Asia' },
    { q: 'What is the capital of Australia?', o: ['Canberra', 'Sydney', 'Melbourne', 'Perth'], a: 'Canberra' },
    { q: 'Historically, the longest river in the world is considered to be...', o: ['The Nile', 'The Amazon', 'The Mississippi', 'The Yangtze'], a: 'The Nile' },
    { q: 'A fjord is a...', o: ['Valley carved by a glacier and flooded by the sea', 'Volcanic crater', 'Sand dune', 'Waterfall'], a: 'Valley carved by a glacier and flooded by the sea' },
    { q: 'Which country has the largest population?', o: ['India', 'China', 'USA', 'Indonesia'], a: 'India' },
    { q: 'Earth\'s tectonic plates move on the...', o: ['Asthenosphere', 'Crust', 'Inner core', 'Lakes'], a: 'Asthenosphere' },
    { q: 'The Tropic of Cancer lies at approximately...', o: ['23.5°N', '23.5°S', '66.5°N', '0°'], a: '23.5°N' },
    { q: 'Which landform is built up by deposition at a river\'s mouth?', o: ['Delta', 'Waterfall', 'Gorge', 'Meander'], a: 'Delta' },
    { q: 'Buenos Aires is the capital of...', o: ['Argentina', 'Brazil', 'Chile', 'Uruguay'], a: 'Argentina' },
    { q: 'Which biome has the greatest biodiversity?', o: ['Tropical rainforest', 'Tundra', 'Desert', 'Taiga'], a: 'Tropical rainforest' },
    { q: 'The "Ring of Fire" is associated with...', o: ['Earthquakes and volcanoes around the Pacific', 'Forest fires in the Amazon', 'Northern lights', 'Coral reefs'], a: 'Earthquakes and volcanoes around the Pacific' },
    { q: 'In which country is the Sahara the dominant landform?', o: ['Algeria', 'Kenya', 'Nigeria', 'South Africa'], a: 'Algeria' },
    { q: 'Subsistence farming is most common in...', o: ['Less-developed regions', 'Central London', 'Deserts', 'Antarctica'], a: 'Less-developed regions' }
  ];

  // ---------------- AP ----------------
  const apUSH = [
    { q: 'The Declaration of Independence was adopted in...', o: ['1776', '1783', '1789', '1800'], a: '1776' },
    { q: 'Who was the first President of the United States?', o: ['George Washington', 'Thomas Jefferson', 'John Adams', 'James Madison'], a: 'George Washington' },
    { q: 'The Louisiana Purchase was made during the presidency of...', o: ['Thomas Jefferson', 'George Washington', 'James Monroe', 'Andrew Jackson'], a: 'Thomas Jefferson' },
    { q: 'The American Civil War began in...', o: ['1861', '1865', '1850', '1860'], a: '1861' },
    { q: 'The Emancipation Proclamation was issued by...', o: ['Abraham Lincoln', 'Ulysses Grant', 'Jefferson Davis', 'Andrew Johnson'], a: 'Abraham Lincoln' },
    { q: 'The "Great Migration" refers to...', o: ['African Americans moving from the South to the North', 'Immigrants from Europe', 'Gold Rush settlers', 'The move to the West'], a: 'African Americans moving from the South to the North' },
    { q: 'The New Deal was the program of which US president?', o: ['Franklin D. Roosevelt', 'Harry Truman', 'Woodrow Wilson', 'Calvin Coolidge'], a: 'Franklin D. Roosevelt' },
    { q: 'The US Constitution was ratified in...', o: ['1788', '1776', '1791', '1800'], a: '1788' },
    { q: 'The transcontinental railroad was completed in...', o: ['1869', '1850', '1880', '1900'], a: '1869' },
    { q: 'The Progressive Era focused on...', o: ['Political and social reform', 'Outward expansion', 'Isolationism', 'Monarchy'], a: 'Political and social reform' },
    { q: 'Which amendment abolished slavery?', o: ['13th', '14th', '15th', '12th'], a: '13th' },
    { q: 'The Korean War ended with...', o: ['An armistice (not a peace treaty)', 'A total US victory', 'A communist takeover of the whole peninsula', 'A united Korea'], a: 'An armistice (not a peace treaty)' },
    { q: 'The "Trail of Tears" involved...', o: ['Forced removal of Native Americans', 'A railroad route', 'Gold miners', 'European immigrants'], a: 'Forced removal of Native Americans' },
    { q: 'The Monroe Doctrine of 1823 warned European powers to...', o: ['Not colonize or intervene in the Americas', 'Trade freely', 'Join the US', 'Leave the Caribbean'], a: 'Not colonize or intervene in the Americas' },
    { q: 'The Great Depression began with...', o: ['The 1929 stock market crash', 'The New Deal', 'World War I', 'The Dust Bowl'], a: 'The 1929 stock market crash' },
    { q: 'The US entered World War II after...', o: ['The attack on Pearl Harbor', 'The sinking of the Lusitania', 'The D-Day invasion', 'Germany invading Poland'], a: 'The attack on Pearl Harbor' },
    { q: '"Manifest Destiny" was the belief that...', o: ['Americans were destined to expand across the continent', 'Slavery should end', 'The US should stay isolated', 'States should have more power'], a: 'Americans were destined to expand across the continent' },
    { q: 'The space race was part of...', o: ['The Cold War', 'World War II', 'The Korean War', 'The Vietnam War'], a: 'The Cold War' },
    { q: 'The 19th Amendment granted...', o: ['Women the right to vote', 'Freed slaves citizenship', 'Immigration rights', 'Labor rights'], a: 'Women the right to vote' },
    { q: 'The "Roaring Twenties" is best known for...', o: ['Economic growth and cultural change', 'The Great Depression', 'World War II', 'Colonial expansion'], a: 'Economic growth and cultural change' }
  ];

  const apBio = [
    { q: 'Which organelle is the site of cellular respiration?', o: ['Mitochondria', 'Chloroplast', 'Ribosome', 'Golgi apparatus'], a: 'Mitochondria' },
    { q: 'What is the role of ATP in cells?', o: ['It is the energy currency of the cell', 'It stores genetic information', 'It is a structural protein', 'It is a sugar'], a: 'It is the energy currency of the cell' },
    { q: 'Which phase of mitosis do chromosomes align at the equator?', o: ['Metaphase', 'Prophase', 'Anaphase', 'Telophase'], a: 'Metaphase' },
    { q: 'The specific sequence of codons on mRNA is interpreted by...', o: ['Ribosomes', 'Mitochondria', 'Lysosomes', 'Centrioles'], a: 'Ribosomes' },
    { q: 'Which of these is a monomer of proteins?', o: ['Amino acids', 'Nucleotides', 'Monosaccharides', 'Fatty acids'], a: 'Amino acids' },
    { q: 'The electron transport chain occurs in the...', o: ['Inner mitochondrial membrane', 'Cytoplasm', 'Nucleus', 'Outer membrane'], a: 'Inner mitochondrial membrane' },
    { q: 'Which process produces the most ATP per glucose molecule?', o: ['Aerobic respiration', 'Anaerobic respiration', 'Fermentation', 'Glycolysis'], a: 'Aerobic respiration' },
    { q: 'In photosynthesis, the light-dependent reactions occur in the...', o: ['Thylakoid membranes', 'Stroma', 'Cytoplasm', 'Cell wall'], a: 'Thylakoid membranes' },
    { q: 'The sodium-potassium pump is an example of...', o: ['Active transport', 'Passive diffusion', 'Facilitated diffusion', 'Osmosis'], a: 'Active transport' },
    { q: 'Which is NOT a base in DNA?', o: ['Uracil', 'Adenine', 'Cytosine', 'Thymine'], a: 'Uracil' },
    { q: 'A homozygous dominant genotype is written as...', o: ['AA', 'Aa', 'aa', 'Aa and aa'], a: 'AA' },
    { q: 'The process of converting DNA into mRNA is called...', o: ['Transcription', 'Translation', 'Replication', 'Transduction'], a: 'Transcription' },
    { q: 'Which is an example of a catabolic reaction?', o: ['Breaking down glucose for energy', 'Building proteins', 'Synthesizing DNA', 'Forming glycogen'], a: 'Breaking down glucose for energy' },
    { q: 'The "fluid mosaic model" describes the structure of...', o: ['Cell membranes', 'DNA', 'Ribosomes', 'The nucleus'], a: 'Cell membranes' },
    { q: 'Which factor can denature an enzyme?', o: ['High temperature or extreme pH', 'Increasing substrate slowly', 'Adding inhibitors carefully', 'Cooling slightly'], a: 'High temperature or extreme pH' },
    { q: 'Which drives the movement of water in plants from roots to leaves?', o: ['Transpiration pull', 'Gravity', 'Active transport only', 'Photosynthesis'], a: 'Transpiration pull' },
    { q: 'In an ecosystem, the primary producers are...', o: ['Plants and other autotrophs', 'Herbivores', 'Carnivores', 'Decomposers'], a: 'Plants and other autotrophs' },
    { q: 'DNA polymerase is responsible for...', o: ['Adding nucleotides during replication', 'Unzipping DNA', 'Transcribing RNA', 'Repairing mRNA'], a: 'Adding nucleotides during replication' },
    { q: 'Which blood group is the universal recipient?', o: ['AB positive', 'O negative', 'A positive', 'B negative'], a: 'AB positive' },
    { q: 'The Calvin cycle produces...', o: ['Glucose (via G3P)', 'ATP', 'Oxygen', 'NADPH'], a: 'Glucose (via G3P)' }
  ];

  const apCalc = [
    { q: 'What is the derivative of x³?', o: ['3x²', 'x²', '3x', 'x'], a: '3x²' },
    { q: 'What is the limit as x→∞ of 1/x?', o: ['0', '1', '∞', 'undefined'], a: '0' },
    { q: 'The integral from 0 to 1 of x dx is...', o: ['1/2', '1', '0', '2'], a: '1/2' },
    { q: 'What is the derivative of ln(x)?', o: ['1/x', 'x', 'ln(x)', '1/ln(x)'], a: '1/x' },
    { q: 'What does the second derivative tell you about a function?', o: ['Concavity', 'Slope', 'Intercepts', 'Area'], a: 'Concavity' },
    { q: 'The chain rule is used to differentiate...', o: ['Composite functions', 'Only polynomials', 'Only trigonometric functions', 'Constants'], a: 'Composite functions' },
    { q: 'What is the derivative of eˣ?', o: ['eˣ', 'xeˣ⁻¹', 'ln(eˣ)', '1'], a: 'eˣ' },
    { q: 'The area between a curve and the x-axis from a to b is given by...', o: ['∫ₐᵇ f(x) dx', 'f(b) - f(a)', 'f\'(b) - f\'(a)', '∫ f\'(x) dx'], a: '∫ₐᵇ f(x) dx' },
    { q: 'What is the derivative of cos(x)?', o: ['-sin(x)', 'sin(x)', '-cos(x)', 'tan(x)'], a: '-sin(x)' },
    { q: 'A function is continuous at a point if...', o: ['The limit exists and equals the function value', 'It has a derivative', 'It is positive', 'It is increasing'], a: 'The limit exists and equals the function value' },
    { q: 'L\'Hôpital\'s rule is used to evaluate...', o: ['Indeterminate limits', 'Derivatives', 'Integrals', 'Series'], a: 'Indeterminate limits' },
    { q: 'What is the derivative of x·sin(x) using product rule?', o: ['sin(x) + x·cos(x)', 'x·cos(x)', 'cos(x) - x·sin(x)', 'sin(x) - x·cos(x)'], a: 'sin(x) + x·cos(x)' },
    { q: 'The derivative of a constant is...', o: ['0', '1', 'The constant', 'Infinity'], a: '0' },
    { q: 'What is the derivative of tan(x)?', o: ['sec²(x)', 'cos²(x)', 'sec(x)', 'csc²(x)'], a: 'sec²(x)' },
    { q: 'The integral of 1/x with respect to x is...', o: ['ln|x| + C', '1/x² + C', 'x + C', 'eˣ + C'], a: 'ln|x| + C' },
    { q: 'What does the Mean Value Theorem guarantee?', o: ['At least one point where the derivative equals the average rate of change', 'The function is always increasing', 'The integral is always positive', 'There is no limit'], a: 'At least one point where the derivative equals the average rate of change' },
    { q: 'A point of inflection occurs where...', o: ['The concavity changes', 'The slope is zero', 'The derivative is undefined', 'The function crosses the axis'], a: 'The concavity changes' },
    { q: 'What is ∫₀^π sin(x) dx?', o: ['2', '0', '1', 'π'], a: '2' },
    { q: 'The derivative of sin(2x) using chain rule is...', o: ['2cos(2x)', 'cos(2x)', '2sin(2x)', '-2cos(2x)'], a: '2cos(2x)' },
    { q: 'An antiderivative of 2x is...', o: ['x²', '2', 'x²/2', '2x²'], a: 'x²' }
  ];

  // ---------------- A-Level ----------------
  const alevelMath = [
    { q: 'What is the derivative of ln(3x)?', o: ['1/x', '3/x', '1/(3x)', 'ln(3)'], a: '1/x' },
    { q: 'Using integration by parts, ∫ x eˣ dx = ?', o: ['x eˣ - eˣ + C', 'x eˣ + eˣ + C', 'eˣ + C', 'x eˣ + C'], a: 'x eˣ - eˣ + C' },
    { q: 'What is the binomial expansion of (1+x)²?', o: ['1 + 2x + x²', '1 + x + x²', '1 + 2x', 'x² + 2x + 1'], a: '1 + 2x + x²' },
    { q: 'The modulus sign |z| of a complex number z = a + bi equals...', o: ['√(a² + b²)', 'a² + b²', 'a + b', '√(a + b)'], a: '√(a² + b²)' },
    { q: 'What is the sum to infinity of a geometric series with first term 3 and common ratio 1/2?', o: ['6', '3', '9', '12'], a: '6' },
    { q: 'What is the scalar product of vectors (1,2,3) and (4,5,6)?', o: ['32', '30', '28', '35'], a: '32' },
    { q: 'The equation of a plane in normal form is...', o: ['r·n = d', 'r = n', 'n·n = d', 'r + n = d'], a: 'r·n = d' },
    { q: 'The derivative of a^x (a>0) with respect to x is...', o: ['aˣ ln(a)', 'x aˣ⁻¹', 'aˣ', 'ln(a)'], a: 'aˣ ln(a)' },
    { q: 'Partial fractions are used to...', o: ['Break a rational expression into simpler parts', 'Find limits', 'Solve differentials', 'Factor polynomials'], a: 'Break a rational expression into simpler parts' },
    { q: 'What is the cross product of (1,0,0) and (0,1,0)?', o: ['(0,0,1)', '(1,1,0)', '(0,0,-1)', '(1,0,1)'], a: '(0,0,1)' },
    { q: 'What is the derivative of x³?', o: ['3x²', 'x²', '3x', 'x⁴/4'], a: '3x²' },
    { q: 'What is the indefinite integral of 2x?', o: ['x² + C', '2x² + C', 'x + C', '2x + C'], a: 'x² + C' },
    { q: 'The gradient of a tangent to a curve at a point is given by...', o: ['The first derivative', 'The integral', 'The second derivative', 'The equation of the normal'], a: 'The first derivative' },
    { q: 'Solve ln(x) = 1.', o: ['x = e', 'x = 1', 'x = 10', 'x = e²'], a: 'x = e' },
    { q: 'Which function tends to 0 as x → ∞?', o: ['y = 1/x', 'y = x²', 'y = eˣ', 'y = x'], a: 'y = 1/x' },
    { q: 'The second derivative of position is...', o: ['Acceleration', 'Velocity', 'Jerk', 'Displacement'], a: 'Acceleration' },
    { q: 'A stationary point of f(x) occurs where...', o: ['f\'(x) = 0', 'f(x) = 0', 'f\'\'(x) = 0', 'f\'(x) = 1'], a: 'f\'(x) = 0' },
    { q: 'What is tan(45°)?', o: ['1', '0', '√2', '1/2'], a: '1' },
    { q: 'The binomial coefficient "5 choose 2" (₅C₂) equals...', o: ['10', '7', '20', '25'], a: '10' },
    { q: 'Lim (x→2) of (x² - 4)/(x - 2) equals...', o: ['4', '0', '2', 'undefined'], a: '4' }
  ];

  const alevelChem = [
    { q: 'What is the shape of a methane (CH₄) molecule?', o: ['Tetrahedral', 'Linear', 'Trigonal planar', 'Bent'], a: 'Tetrahedral' },
    { q: 'How many electrons can the third energy level hold?', o: ['18', '8', '32', '10'], a: '18' },
    { q: 'The equilibrium constant Kc for aA + bB ⇌ cC + dD is...', o: ['[C]ᶜ[D]ᵈ/[A]ᵃ[B]ᵇ', '[A]ᵃ[B]ᵇ/[C]ᶜ[D]ᵈ', '[A]+[B]/[C]+[D]', '[C][D]/[A][B]'], a: '[C]ᶜ[D]ᵈ/[A]ᵃ[B]ᵇ' },
    { q: 'A substance that can act as both an acid and a base is...', o: ['Amphoteric', 'Neutral', 'Anhydrous', 'Monoprotic'], a: 'Amphoteric' },
    { q: 'What is the hybridization of the carbon in CH₄?', o: ['sp³', 'sp²', 'sp', 'sp³d'], a: 'sp³' },
    { q: 'The rate of a reaction generally increases with...', o: ['Higher temperature and higher concentration', 'Lower temperature', 'A catalyst\'s absence', 'Less surface area'], a: 'Higher temperature and higher concentration' },
    { q: 'Which element has the smallest atomic radius?', o: ['Helium', 'Lithium', 'Carbon', 'Neon'], a: 'Helium' },
    { q: 'The enthalpy of formation (ΔHf°) is...', o: ['Heat change when 1 mole of compound forms from its elements', 'Heat to melt a substance', 'Heat of vaporization', 'Heat of neutralization'], a: 'Heat change when 1 mole of compound forms from its elements' },
    { q: 'Carbon-12 has how many neutrons?', o: ['6', '12', '4', '8'], a: '6' },
    { q: 'A catalyst works by...', o: ['Lowering activation energy', 'Increasing temperature', 'Adding products', 'Consuming reactants'], a: 'Lowering activation energy' },
    { q: 'What is the pH of a 0.1 M solution of HCl?', o: ['1', '7', '13', '14'], a: '1' },
    { q: 'Le Chatelier\'s principle states that a system at equilibrium...', o: ['Shifts to oppose any change', 'Stops reacting', 'Always shifts right', 'Doubles its rate'], a: 'Shifts to oppose any change' },
    { q: 'Which orbital is spherical in shape?', o: ['s orbital', 'p orbital', 'd orbital', 'f orbital'], a: 's orbital' },
    { q: 'Electronegativity generally increases...', o: ['Across a period (left to right)', 'Down a group', 'From top to bottom in group', 'With atomic size'], a: 'Across a period (left to right)' },
    { q: 'Which compound is organic?', o: ['Methane (CH₄)', 'Sodium chloride', 'Water', 'Calcium carbonate'], a: 'Methane (CH₄)' },
    { q: 'Enthalpy change at constant pressure (ΔH) is...', o: ['Heat absorbed/released by a reaction', 'Total internal energy', 'Temperature change multiplied by mass', 'The rate of reaction'], a: 'Heat absorbed/released by a reaction' },
    { q: 'Which molecule has a linear shape?', o: ['CO₂', 'H₂O', 'NH₃', 'CH₄'], a: 'CO₂' },
    { q: 'A buffer solution...', o: ['Resists small changes in pH', 'Always has pH 7', 'Only contains a strong acid', 'Is always a base'], a: 'Resists small changes in pH' },
    { q: 'The periodic table is organized by increasing...', o: ['Atomic number', 'Atomic mass', 'Density', 'Melting point'], a: 'Atomic number' },
    { q: 'Isomerism means compounds have...', o: ['The same formula but different structures', 'Different formulas but same structure', 'The same mass number only', 'Identical physical properties'], a: 'The same formula but different structures' }
  ];

  // ---------------- General / Trivia (curated) ----------------
  const generalKnowledge = [
    { q: 'Which planet is closest to the Sun?', o: ['Mercury', 'Venus', 'Earth', 'Mars'], a: 'Mercury' },
    { q: 'Who painted the Mona Lisa?', o: ['Leonardo da Vinci', 'Michelangelo', 'Pablo Picasso', 'Vincent van Gogh'], a: 'Leonardo da Vinci' },
    { q: 'What is the currency of Japan?', o: ['Yen', 'Won', 'Yuan', 'Rupee'], a: 'Yen' },
    { q: 'How many continents are there?', o: ['7', '5', '6', '8'], a: '7' },
    { q: 'Which country is famous for the Great Wall?', o: ['China', 'India', 'Japan', 'Korea'], a: 'China' },
    { q: 'What is the largest mammal in the world?', o: ['Blue whale', 'Elephant', 'Giraffe', 'Hippopotamus'], a: 'Blue whale' },
    { q: 'The capital of Canada is...', o: ['Ottawa', 'Toronto', 'Vancouver', 'Montreal'], a: 'Ottawa' },
    { q: 'Which instrument has 88 keys?', o: ['Piano', 'Guitar', 'Violin', 'Harp'], a: 'Piano' },
    { q: 'Which planet has the most moons?', o: ['Saturn', 'Jupiter', 'Mars', 'Venus'], a: 'Saturn' },
    { q: 'What is the chemical symbol for silver?', o: ['Ag', 'Si', 'Sv', 'Sl'], a: 'Ag' },
    { q: 'How many planets are in our solar system?', o: ['8', '9', '7', '10'], a: '8' },
    { q: 'Who developed the theory of general relativity?', o: ['Albert Einstein', 'Isaac Newton', 'Galileo', 'Niels Bohr'], a: 'Albert Einstein' },
    { q: 'The national animal of Australia is...', o: ['Kangaroo', 'Koala', 'Emu', 'Platypus'], a: 'Kangaroo' },
    { q: 'Which ocean surrounds Australia?', o: ['Pacific', 'Atlantic', 'Indian', 'Arctic'], a: 'Pacific' },
    { q: 'What is the tallest animal?', o: ['Giraffe', 'Elephant', 'Ostrich', 'Camel'], a: 'Giraffe' },
    { q: 'Which vitamin is produced by sunlight on skin?', o: ['Vitamin D', 'Vitamin C', 'Vitamin A', 'Vitamin B12'], a: 'Vitamin D' },
    { q: 'The basic unit of currency in the UK is the...', o: ['Pound', 'Euro', 'Dollar', 'Pence'], a: 'Pound' },
    { q: 'Which is the largest continent by area?', o: ['Asia', 'Africa', 'North America', 'Europe'], a: 'Asia' },
    { q: 'What is the smallest prime number?', o: ['2', '1', '3', '0'], a: '2' },
    { q: 'Which country is shaped like a boot?', o: ['Italy', 'Greece', 'Spain', 'Portugal'], a: 'Italy' },
    { q: 'Who is known as the father of modern computers?', o: ['Alan Turing', 'Bill Gates', 'Steve Jobs', 'Charles Babbage'], a: 'Alan Turing' },
    { q: 'What is the freezing point of water in Celsius?', o: ['0°C', '32°C', '100°C', '-10°C'], a: '0°C' },
    { q: 'Which is the national bird of the United States?', o: ['Bald eagle', 'Robin', 'Eagle', 'Falcon'], a: 'Bald eagle' },
    { q: 'What does "www" stand for in a web address?', o: ['World Wide Web', 'World Web Wide', 'Web Wide World', 'Wide World Web'], a: 'World Wide Web' },
    { q: 'Which of these is a programming language?', o: ['Python', 'Banana', 'Mango', 'Potato'], a: 'Python' },
    { q: 'What is the largest desert (hot) in the world?', o: ['Sahara', 'Antarctica', 'Gobi', 'Mojave'], a: 'Sahara' },
    { q: 'The Statue of Liberty is located in which city?', o: ['New York', 'Washington D.C.', 'Boston', 'Philadelphia'], a: 'New York' },
    { q: 'How many zeros are in a million?', o: ['6', '5', '7', '9'], a: '6' },
    { q: 'Who invented the telephone?', o: ['Alexander Graham Bell', 'Thomas Edison', 'Nikola Tesla', 'Guglielmo Marconi'], a: 'Alexander Graham Bell' }
  ];

  const generalGeography = [
    { q: 'What is the capital of Brazil?', o: ['Brasília', 'Rio de Janeiro', 'São Paulo', 'Salvador'], a: 'Brasília' },
    { q: 'Which river flows through Paris?', o: ['Seine', 'Loire', 'Rhône', 'Garonne'], a: 'Seine' },
    { q: 'Mount Fuji is located in...', o: ['Japan', 'China', 'Indonesia', 'South Korea'], a: 'Japan' },
    { q: 'What is the largest country by area?', o: ['Russia', 'Canada', 'China', 'USA'], a: 'Russia' },
    { q: 'Which desert is located in the USA?', o: ['Mojave', 'Sahara', 'Gobi', 'Kalahari'], a: 'Mojave' },
    { q: 'Boundary between Europe and Asia is marked by the...', o: ['Ural Mountains', 'Alps', 'Pyrenees', 'Carpathians'], a: 'Ural Mountains' },
    { q: 'The capital of Egypt is...', o: ['Cairo', 'Alexandria', 'Giza', 'Luxor'], a: 'Cairo' },
    { q: 'Which country has the longest coastline?', o: ['Canada', 'Australia', 'Russia', 'USA'], a: 'Canada' },
    { q: 'What is the capital of Germany?', o: ['Berlin', 'Munich', 'Frankfurt', 'Hamburg'], a: 'Berlin' },
    { q: 'Which of these islands belongs to Greece?', o: ['Crete', 'Sicily', 'Corsica', 'Sardinia'], a: 'Crete' },
    { q: 'The Dead Sea borders which two countries?', o: ['Israel and Jordan', 'Egypt and Israel', 'Jordan and Syria', 'Iraq and Iran'], a: 'Israel and Jordan' },
    { q: 'What is the capital of New Zealand?', o: ['Wellington', 'Auckland', 'Christchurch', 'Queenstown'], a: 'Wellington' },
    { q: 'Which is the longest river in South America?', o: ['Amazon', 'Orinoco', 'Paraná', 'Magdalena'], a: 'Amazon' },
    { q: 'The Great Barrier Reef is located near...', o: ['Australia', 'Hawaii', 'Bahamas', 'Fiji'], a: 'Australia' },
    { q: 'What is the capital of Kenya?', o: ['Nairobi', 'Mombasa', 'Kisumu', 'Eldoret'], a: 'Nairobi' },
    { q: 'Which country borders Portugal to the east?', o: ['Spain', 'France', 'Morocco', 'Italy'], a: 'Spain' },
    { q: 'Which sea lies between Europe and Africa?', o: ['Mediterranean', 'Caribbean', 'Baltic', 'Black'], a: 'Mediterranean' },
    { q: 'The capital of Argentina is...', o: ['Buenos Aires', 'Santiago', 'Lima', 'Montevideo'], a: 'Buenos Aires' },
    { q: 'On which continent is the Sahara Desert?', o: ['Africa', 'Asia', 'Australia', 'South America'], a: 'Africa' },
    { q: 'Vatican City is located inside which city?', o: ['Rome', 'Paris', 'Athens', 'Madrid'], a: 'Rome' },
    { q: 'Which is the highest mountain in Africa?', o: ['Kilimanjaro', 'Everest', 'Fuji', 'Elbrus'], a: 'Kilimanjaro' },
    { q: 'The capital of Turkey is...', o: ['Ankara', 'Istanbul', 'Izmir', 'Antalya'], a: 'Ankara' },
    { q: 'The Amazon rainforest is mostly located in...', o: ['Brazil', 'Peru', 'Colombia', 'Venezuela'], a: 'Brazil' },
    { q: 'Which country is nicknamed "the Land of the Rising Sun"?', o: ['Japan', 'China', 'South Korea', 'Thailand'], a: 'Japan' },
    { q: 'Which is the smallest ocean by area?', o: ['Arctic', 'Pacific', 'Atlantic', 'Indian'], a: 'Arctic' }
  ];

  const generalMath = [
    { q: 'What is 9 × 7?', o: ['63', '61', '72', '48'], a: '63' },
    { q: 'What is the square root of 81?', o: ['9', '8', '7', '11'], a: '9' },
    { q: 'What is 100 ÷ 4?', o: ['25', '20', '40', '50'], a: '25' },
    { q: 'What is 20% of 150?', o: ['30', '20', '25', '15'], a: '30' },
    { q: 'What is the value of 3³?', o: ['27', '9', '30', '81'], a: '27' },
    { q: 'What is 15 + 27?', o: ['42', '32', '40', '37'], a: '42' },
    { q: 'Simplify: 18/24', o: ['3/4', '2/3', '9/12', '4/5'], a: '3/4' },
    { q: 'What is 12 × 12?', o: ['144', '124', '120', '148'], a: '144' },
    { q: 'What is 7² + 3²?', o: ['58', '49', '40', '56'], a: '58' },
    { q: 'What is 25 × 4?', o: ['100', '90', '110', '80'], a: '100' },
    { q: 'What is 10% of 500?', o: ['50', '5', '500', '100'], a: '50' },
    { q: 'What is 1/2 ÷ 1/4?', o: ['2', '1/2', '1/8', '4'], a: '2' },
    { q: 'What is 64 ÷ 8?', o: ['8', '6', '7', '12'], a: '8' },
    { q: 'What is 3 + 4 × 2?', o: ['11', '14', '10', '24'], a: '11' },
    { q: 'What is 40% of 90?', o: ['36', '30', '40', '54'], a: '36' },
    { q: 'What is 5! (5 factorial)?', o: ['120', '60', '25', '80'], a: '120' },
    { q: 'What is 99 × 0?', o: ['0', '99', '1', '990'], a: '0' }
  ];

  const generalScience = [
    { q: 'What is the most abundant element in the universe?', o: ['Hydrogen', 'Helium', 'Oxygen', 'Carbon'], a: 'Hydrogen' },
    { q: 'Which planet is known as the Morning Star?', o: ['Venus', 'Mars', 'Mercury', 'Jupiter'], a: 'Venus' },
    { q: 'What type of energy does a moving car have?', o: ['Kinetic energy', 'Potential energy', 'Chemical energy', 'Nuclear energy'], a: 'Kinetic energy' },
    { q: 'The human heart has how many chambers?', o: ['4', '2', '3', '6'], a: '4' },
    { q: 'Which gas do humans breathe out?', o: ['Carbon dioxide', 'Oxygen', 'Nitrogen', 'Hydrogen'], a: 'Carbon dioxide' },
    { q: 'Sound cannot travel through...', o: ['A vacuum', 'Air', 'Water', 'Steel'], a: 'A vacuum' },
    { q: 'What is the largest bone in the human body?', o: ['Femur (thigh bone)', 'Tibia', 'Skull', 'Humerus'], a: 'Femur (thigh bone)' },
    { q: 'The power of a lens is measured in...', o: ['Diopters', 'Watts', 'Lumens', 'Hertz'], a: 'Diopters' },
    { q: 'Which vitamin is found in oranges and citrus fruits?', o: ['Vitamin C', 'Vitamin D', 'Vitamin K', 'B12'], a: 'Vitamin C' },
    { q: 'The Earth\'s core is mostly made of...', o: ['Iron and nickel', 'Gold', 'Silicon', 'Carbon'], a: 'Iron and nickel' },
    { q: 'Which force keeps planets in orbit around the Sun?', o: ['Gravity', 'Friction', 'Magnetism', 'Air resistance'], a: 'Gravity' },
    { q: 'What is the chemical formula for table salt?', o: ['NaCl', 'HCl', 'NaOH', 'KCl'], a: 'NaCl' },
    { q: 'The human body has approximately how many major organ systems?', o: ['11', '5', '8', '15'], a: '11' },
    { q: 'Which organ filters blood in the human body?', o: ['Kidneys', 'Liver', 'Lungs', 'Stomach'], a: 'Kidneys' },
    { q: 'What is the third planet from the Sun?', o: ['Earth', 'Mars', 'Venus', 'Mercury'], a: 'Earth' },
    { q: 'Electric current is measured in...', o: ['Amperes', 'Volts', 'Ohms', 'Watts'], a: 'Amperes' },
    { q: 'Which gas makes up about 21% of Earth\'s atmosphere?', o: ['Oxygen', 'Nitrogen', 'Carbon dioxide', 'Helium'], a: 'Oxygen' },
    { q: 'An animal that only eats plants is called a...', o: ['Herbivore', 'Carnivore', 'Omnivore', 'Detritivore'], a: 'Herbivore' },
    { q: 'The thin, solid outer layer of the Earth is the...', o: ['Crust', 'Mantle', 'Core', 'Magma'], a: 'Crust' },
    { q: 'Which part of the eye focuses light onto the retina?', o: ['Lens', 'Cornea', 'Iris', 'Optic nerve'], a: 'Lens' }
  ];

  // ---------------- Build the bank registry ----------------
  const banks = [
    // SAT
    { id: 'sat-math', name: 'SAT Math', exam: 'SAT', subject: 'Math', icon: '➗', desc: 'Algebra, arithmetic, and data — the math you\'ll see on the SAT.', count: satMath.length, questions: satMath },
    { id: 'sat-reading', name: 'SAT Reading', exam: 'SAT', subject: 'Reading', icon: '📖', desc: 'Vocabulary, main ideas, and reading comprehension passages.', count: satReading.length, questions: satReading },
    { id: 'sat-writing', name: 'SAT Writing & Language', exam: 'SAT', subject: 'Writing', icon: '✍️', desc: 'Grammar, punctuation, and effective expression.', count: satWriting.length, questions: satWriting },
    { id: 'sat-science', name: 'SAT Science (Concepts)', exam: 'SAT', subject: 'Science', icon: '🔬', desc: 'Scientific reasoning and core science concepts.', count: satScience.length, questions: satScience },
    // IB
    { id: 'ib-math', name: 'IB Mathematics', exam: 'IB', subject: 'Math', icon: '➗', desc: 'Calculus, functions, probability, and vectors (AA/AI).', count: ibMath.length, questions: ibMath },
    { id: 'ib-biology', name: 'IB Biology', exam: 'IB', subject: 'Biology', icon: '🧬', desc: 'Cells, genetics, metabolism, and molecular biology.', count: ibBiology.length, questions: ibBiology },
    { id: 'ib-chemistry', name: 'IB Chemistry', exam: 'IB', subject: 'Chemistry', icon: '⚗️', desc: 'Atomic structure, bonding, energetics, and reactions.', count: ibChemistry.length, questions: ibChemistry },
    { id: 'ib-physics', name: 'IB Physics', exam: 'IB', subject: 'Physics', icon: '🎇', desc: 'Mechanics, waves, electromagnetism, and energy.', count: ibPhysics.length, questions: ibPhysics },
    { id: 'ib-history', name: 'IB History', exam: 'IB', subject: 'History', icon: '🏛️', desc: '20th-century world history, wars, and political change.', count: ibHistory.length, questions: ibHistory },
    { id: 'ib-english', name: 'IB English A/Literature', exam: 'IB', subject: 'English', icon: '📚', desc: 'Literary analysis, genres, and techniques.', count: ibEnglish.length, questions: ibEnglish },
    { id: 'ib-geography', name: 'IB Geography', exam: 'IB', subject: 'Geography', icon: '🌍', desc: 'Natural systems, population, and urban environments.', count: ibGeography.length, questions: ibGeography },
    // GCSE
    { id: 'gcse-math', name: 'GCSE Maths', exam: 'GCSE', subject: 'Math', icon: '➗', desc: 'Number, algebra, geometry, and probability.', count: gcseMath.length, questions: gcseMath },
    { id: 'gcse-science', name: 'GCSE Combined Science', exam: 'GCSE', subject: 'Science', icon: '🔬', desc: 'Biology, chemistry, and physics essentials.', count: gcseScience.length, questions: gcseScience },
    { id: 'gcse-english', name: 'GCSE English', exam: 'GCSE', subject: 'English', icon: '📖', desc: 'Language, grammar, and literary techniques.', count: gcseEnglish.length, questions: gcseEnglish },
    { id: 'gcse-history', name: 'GCSE History', exam: 'GCSE', subject: 'History', icon: '🏛️', desc: 'Key events and figures in British and world history.', count: gcseHistory.length, questions: gcseHistory },
    { id: 'gcse-geography', name: 'GCSE Geography', exam: 'GCSE', subject: 'Geography', icon: '🌍', desc: 'Physical and human geography foundations.', count: gcseGeography.length, questions: gcseGeography },
    // AP
    { id: 'ap-ush', name: 'AP US History', exam: 'AP', subject: 'History', icon: '🗽', desc: 'Colonial era to the present (foundational).', count: apUSH.length, questions: apUSH },
    { id: 'ap-bio', name: 'AP Biology', exam: 'AP', subject: 'Biology', icon: '🧪', desc: 'Cellular processes, energetics, and genetics.', count: apBio.length, questions: apBio },
    { id: 'ap-calc', name: 'AP Calculus AB/BC', exam: 'AP', subject: 'Math', icon: '∫', desc: 'Limits, derivatives, and integrals.', count: apCalc.length, questions: apCalc },
    // A-Level
    { id: 'alevel-math', name: 'A-Level Maths', exam: 'A-Level', subject: 'Math', icon: '➗', desc: 'Pure mathematics and mechanics foundations.', count: alevelMath.length, questions: alevelMath },
    { id: 'alevel-chem', name: 'A-Level Chemistry', exam: 'A-Level', subject: 'Chemistry', icon: '⚗️', desc: 'Physical and inorganic chemistry foundations.', count: alevelChem.length, questions: alevelChem },
    // General
    { id: 'general-knowledge', name: 'General Knowledge', exam: 'General', subject: 'Mixed', icon: '🧠', desc: 'Fun facts and everyday knowledge across many fields.', count: generalKnowledge.length, questions: generalKnowledge },
    { id: 'general-geography', name: 'World Geography', exam: 'General', subject: 'Geography', icon: '🗺️', desc: 'Capitals, countries, landforms, and oceans.', count: generalGeography.length, questions: generalGeography },
    { id: 'general-math', name: 'Mental Math', exam: 'General', subject: 'Math', icon: '🧮', desc: 'Quick arithmetic to sharpen speed and accuracy.', count: generalMath.length, questions: generalMath },
    { id: 'general-science', name: 'General Science', exam: 'General', subject: 'Science', icon: '🧪', desc: 'Everyday science everyone should know.', count: generalScience.length, questions: generalScience }
  ];

  // Open Trivia DB categories (the most useful ones)
  const TRIVIA_CATEGORIES = [
    { id: 9, name: 'General Knowledge' },
    { id: 15, name: 'Video Games' },
    { id: 17, name: 'Science & Nature' },
    { id: 18, name: 'Computers' },
    { id: 19, name: 'Mathematics' },
    { id: 21, name: 'Sports' },
    { id: 22, name: 'Geography' },
    { id: 23, name: 'History' },
    { id: 24, name: 'Politics' },
    { id: 25, name: 'Art' },
    { id: 26, name: 'Celebrities' },
    { id: 27, name: 'Animals' },
    { id: 28, name: 'Vehicles' },
    { id: 29, name: 'Entertainment: Comics' },
    { id: 31, name: 'Entertainment: Japanese Anime & Manga' },
    { id: 32, name: 'Entertainment: Cartoons & Animations' }
  ];

  const TRIVIA_TYPE_LABEL = {
    multiple: 'Multiple choice',
    boolean: 'True / False'
  };

  // Fetch questions from the Open Trivia DB API (free, no key needed).
  async function fetchTrivia(count, categoryId, difficulty) {
    const n = Math.max(5, Math.min(30, +count || 10));
    const params = ['amount=' + n];
    if (categoryId) params.push('category=' + categoryId);
    if (difficulty) params.push('difficulty=' + difficulty);
    const url = 'https://opentdb.com/api.php?' + params.join('&');
    try {
      const res = await fetch(url);
      if (!res.ok) throw new Error('Trivia API HTTP ' + res.status);
      const data = await res.json();
      if (!data || data.response_code !== 0 || !Array.isArray(data.results)) {
        throw new Error('Trivia API returned an error response');
      }
      return data.results.map(function (r) {
        const options = r.type === 'boolean'
          ? ['True', 'False']
          : shuffle(r.incorrect_answers.concat([r.correct_answer]));
        return {
          question: decodeEntities(r.question),
          options: options.map(decodeEntities),
          answer: decodeEntities(r.correct_answer),
          type: r.type === 'boolean' ? 'truefalse' : 'multiple',
          source: 'trivia'
        };
      });
    } catch (e) {
      throw new Error('Could not reach the online question bank: ' + (e && e.message ? e.message : e));
    }
  }

  // Minimal HTML entity decoder (Open Trivia DB returns escaped strings).
  function decodeEntities(str) {
    if (typeof str !== 'string') return str;
    const map = {
      '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"',
      '&#039;': "'", '&apos;': "'", '&nbsp;': ' ', '&hellip;': '…',
      '&mdash;': '—', '&ndash;': '–', '&lsquo;': '‘', '&rsquo;': '’',
      '&ldquo;': '“', '&rdquo;': '”'
    };
    let out = str.replace(/&[a-zA-Z]+;|&#\d+;/g, function (m) {
      if (map[m]) return map[m];
      if (/^&#\d+;/.test(m)) {
        try { return String.fromCharCode(parseInt(m.slice(2, -1), 10)); } catch (_) { return m; }
      }
      return m;
    });
    return out;
  }

  function getBank(id) {
    return banks.find(function (b) { return b.id === id; }) || null;
  }

  // ---- Custom question banks -------------------------------------------
  // The app stores user-created banks in its state and registers them here
  // so every existing helper (getBank, getBankQuestions, search, totalCount,
  // populateBankSelect) picks them up automatically. Custom banks are marked
  // with custom:true so they can be replaced/removed on every refresh.

  function uid() {
    return 'custom-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36).slice(-4);
  }

  // Validate & normalize a single question object into {q, o, a}.
  function normalizeQuestion(obj) {
    if (!obj || typeof obj !== 'object') return null;
    const qText = typeof obj.q === 'string' ? obj.q : typeof obj.question === 'string' ? obj.question : '';
    if (!qText.trim()) return null;
    let opts = null;
    if (Array.isArray(obj.o) && obj.o.length) opts = obj.o.filter(function (x) { return typeof x === 'string' || typeof x === 'number'; }).map(String);
    else if (Array.isArray(obj.options) && obj.options.length) opts = obj.options.map(String);
    const ans0 = obj.a !== undefined && obj.a !== null ? String(obj.a) : obj.answer !== undefined && obj.answer !== null ? String(obj.answer) : '';
    if (!ans0.trim()) return null;
    let ans = ans0;
    // If options are present, the answer must be one of them to auto-grade.
    if (opts && opts.length && opts.indexOf(ans) === -1) {
      // Tolerate whitespace-only mismatch (common in CSV round trips).
      const norm = function (s) { return String(s).trim().toLowerCase(); };
      const hit = opts.find(function (o) { return norm(o) === norm(ans); });
      if (hit) {
        // Use the exact option text so grading matches.
        ans = hit;
      } else {
        return null;
      }
    }
    return { q: qText.trim(), o: opts, a: ans.trim() };
  }

  // Normalize a bank object; returns null if unusable.
  function normalizeBank(obj) {
    if (!obj || typeof obj !== 'object') return null;
    const name = typeof obj.name === 'string' && obj.name.trim() ? obj.name.trim() : null;
    const id = typeof obj.id === 'string' && obj.id.trim() ? obj.id.trim() : uid();
    if (!name || !Array.isArray(obj.questions)) return null;
    const qs = [];
    obj.questions.forEach(function (x) {
      const nq = normalizeQuestion(x);
      if (nq) qs.push(nq);
    });
    if (!qs.length) return null;
    return {
      id: id,
      name: name,
      exam: typeof obj.exam === 'string' ? obj.exam : 'Custom',
      subject: typeof obj.subject === 'string' ? obj.subject : 'General',
      icon: typeof obj.icon === 'string' ? obj.icon : '✨',
      desc: typeof obj.desc === 'string' ? obj.desc : 'Your custom question bank.',
      count: qs.length,
      questions: qs,
      custom: true
    };
  }

  // Replace the registered custom banks with the given list.
  function setCustomBanks(list) {
    for (let i = banks.length - 1; i >= 0; i--) {
      if (banks[i].custom) banks.splice(i, 1);
    }
    (list || []).forEach(function (b) {
      const nb = normalizeBank(b);
      if (nb) banks.push(nb);
    });
    return banks.filter(function (b) { return b.custom; });
  }

  // Parse CSV text (handles quoted fields with commas, escaped quotes, \r\n).
  function parseCSV(text) {
    const rows = [];
    let field = '', row = [], inQuotes = false;
    const src = String(text || '');
    for (let i = 0; i < src.length; i++) {
      const ch = src[i];
      if (inQuotes) {
        if (ch === '"') {
          if (src[i + 1] === '"') { field += '"'; i++; }
          else inQuotes = false;
        } else field += ch;
      } else if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(field); field = '';
      } else if (ch === '\n' || ch === '\r') {
        if (ch === '\r' && src[i + 1] === '\n') i++;
        row.push(field); field = '';
        if (row.some(function (c) { return c.trim() !== ''; })) rows.push(row);
        row = [];
      } else field += ch;
    }
    row.push(field);
    if (row.some(function (c) { return c.trim() !== ''; })) rows.push(row);
    return rows;
  }

  // Build a question bank from CSV rows. Header is optional but expected:
  //   question,optionA,optionB,optionC,optionD,answer
  // Also supported aliases: question|q, optionA|optA|a..d, answer|a.
  function bankFromCSV(name, csvText) {
    const rows = parseCSV(csvText).filter(function (r) { return r && r.length; });
    if (!rows.length) return null;
    let start = 0;
    const header = rows[0].map(function (h) { return h.trim().toLowerCase(); });
    const hasHeader = rows[0].some(function (h) { return /question|prompt|q\b/i.test(h) || /answer|correct/i.test(h); });
    if (hasHeader) start = 1;
    const questions = [];
    for (let i = start; i < rows.length; i++) {
      const cells = rows[i];
      let qText, opts = [], ans;
      if (hasHeader) {
        const idx = function (aliases) {
          for (let k = 0; k < header.length; k++) if (aliases.indexOf(header[k]) !== -1) return k;
          return -1;
        };
        const qi = idx(['question', 'q', 'prompt']);
        const ai = idx(['answer', 'a', 'correct', 'correctanswer']);
        const oi = [0, 1, 2, 3].map(function (n) {
          return idx(['option' + ['a', 'b', 'c', 'd'][n], 'opt' + ['a', 'b', 'c', 'd'][n], 'choice' + ['a', 'b', 'c', 'd'][n], 'o' + (n + 1)]);
        });
        qText = qi >= 0 ? cells[qi] || '' : '';
        ans = ai >= 0 ? cells[ai] || '' : '';
        oi.forEach(function (ix) { if (ix >= 0 && cells[ix]) opts.push(cells[ix]); });
      } else {
        qText = cells[0] || '';
        opts = cells.slice(1, 5).filter(Boolean);
        ans = cells[5] !== undefined ? cells[5] : '';
      }
      const obj = { question: qText, options: opts.length ? opts : undefined, answer: ans };
      const nq = normalizeQuestion(obj);
      if (nq) questions.push(nq);
    }
    if (!questions.length) return null;
    return normalizeBank({ id: uid(), name: name, exam: 'Custom', subject: 'General', icon: '✨', desc: 'Imported from CSV (' + questions.length + ' questions).', questions: questions });
  }

  function bankToJSON(bank) {
    return JSON.stringify({ name: bank.name, exam: bank.exam, subject: bank.subject, icon: bank.icon, desc: bank.desc, questions: bank.questions.map(function (b) { return b.o ? { q: b.q, o: b.o.slice(), a: b.a } : { q: b.q, a: b.a }; }) }, null, 2);
  }

  function bankToCSV(bank) {
    const lines = ['question,optionA,optionB,optionC,optionD,answer'];
    bank.questions.forEach(function (b) {
      const esc = function (s) {
        s = String(s === undefined ? '' : s);
        return /[",\r\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
      };
      const opts = b.o || [];
      const row = [esc(b.q), esc(opts[0] || ''), esc(opts[1] || ''), esc(opts[2] || ''), esc(opts[3] || ''), esc(b.a)];
      lines.push(row.join(','));
    });
    return lines.join('\n');
  }

  // Guess whether a JSON string contains one bank or many.
  function parseBankJSON(text) {
    const data = JSON.parse(text);
    if (Array.isArray(data)) {
      const out = [];
      data.forEach(function (d) { const nb = normalizeBank(d); if (nb) out.push(nb); });
      return out;
    }
    const nb = normalizeBank(data);
    return nb ? [nb] : [];
  }

  // Return questions from a curated bank in quiz-engine format.
  function getBankQuestions(bankId, count, type) {
    const bank = getBank(bankId);
    if (!bank) return [];
    const n = Math.max(1, Math.min(bank.questions.length, +count || 10));
    const picked = shuffle(bank.questions).slice(0, n);
    return picked.map(function (b) { return toQuizFormat(b, type); });
  }

  // Search all curated question text + options for a keyword.
  function search(query) {
    const q = (query || '').trim().toLowerCase();
    if (!q) return [];
    const results = [];
    banks.forEach(function (bank) {
      bank.questions.forEach(function (qi) {
        const text = (qi.q + ' ' + (qi.o || []).join(' ')).toLowerCase();
        if (text.indexOf(q) !== -1) {
          results.push({ bank: bank.id, bankName: bank.name, question: qi.q, options: qi.o ? qi.o.slice() : null, answer: qi.a });
        }
      });
    });
    return results;
  }

  function totalCount() {
    return banks.reduce(function (sum, b) { return sum + b.questions.length; }, 0);
  }

  window.QuestionBank = {
    banks: banks,
    triviaCategories: TRIVIA_CATEGORIES,
    triviaTypeLabel: TRIVIA_TYPE_LABEL,
    totalCount: totalCount,
    getBank: getBank,
    getBankQuestions: getBankQuestions,
    search: search,
    fetchTrivia: fetchTrivia,
    setCustomBanks: setCustomBanks,
    parseCSV: parseCSV,
    bankFromCSV: bankFromCSV,
    bankToJSON: bankToJSON,
    bankToCSV: bankToCSV,
    parseBankJSON: parseBankJSON,
    normalizeBank: normalizeBank,
    uid: uid
  };
})();
