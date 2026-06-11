import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, X, Eye, EyeOff, Award, TrendingUp, Trophy, RefreshCw } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

const IntegralTutorial = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [rectangleCount, setRectangleCount] = useState(4);
  const [isAutoAnimating, setIsAutoAnimating] = useState(true);
  const [selectedRule, setSelectedRule] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [showSolution, setShowSolution] = useState({});
  const [checkedAnswers, setCheckedAnswers] = useState({});
  const [showHints, setShowHints] = useState({});
  const [failedAttempts, setFailedAttempts] = useState({});
  const [inputHistory, setInputHistory] = useState({});
  const [generatedExercises, setGeneratedExercises] = useState({});
  
  const [solvedExercises, setSolvedExercises] = useState(() => {
    const saved = localStorage.getItem('integral-tutorial-progress');
    return saved ? JSON.parse(saved) : {};
  });

  useEffect(() => {
    localStorage.setItem('integral-tutorial-progress', JSON.stringify(solvedExercises));
  }, [solvedExercises]);

  const Fraction = ({ num, den }) => (
    <span className="fraction">
      <span className="numerator">{num}</span>
      <span className="denominator">{den}</span>
    </span>
  );

  const toSuperscript = (n) => {
    const map = { '0': '⁰', '1': '¹', '2': '²', '3': '³', '4': '⁴', '5': '⁵', '6': '⁶', '7': '⁷', '8': '⁸', '9': '⁹', '-': '⁻' };
    return String(n).split('').map(d => map[d] || d).join('');
  };

  const generateExercise = (template) => {
    const randomCoeff = () => Math.floor(Math.random() * 7) + 2;
    const randomPower = () => Math.floor(Math.random() * 4) + 2;
    const randomSmallCoeff = () => Math.floor(Math.random() * 5) + 1;
    
    switch(template.type) {
      case 'potenz_einfach': {
        const n = randomPower();
        return {
          ...template,
          question: `∫ x${toSuperscript(n)} dx`,
          solution: `x${toSuperscript(n+1)}/${n+1} + C`,
          alternatives: [`x^${n+1}/${n+1} + C`, `(x^${n+1})/${n+1} + C`, `(1/${n+1})x^${n+1} + C`],
          steps: [
            `Wende die Potenzregel an: ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C`,
            `Hier ist n = ${n}`,
            `Erhöhe den Exponenten: ${n} + 1 = ${n+1}`,
            `Teile durch den neuen Exponenten: x${toSuperscript(n+1)}/${n+1}`,
            `Lösung: x${toSuperscript(n+1)}/${n+1} + C`
          ]
        };
      }
      case 'potenz_mittel': {
        const a = randomCoeff();
        const n = randomPower();
        const b = randomCoeff();
        const newExp = n + 1;
        return {
          ...template,
          question: `∫ (${a}x${toSuperscript(n)} + ${b}) dx`,
          solution: `${a}x${toSuperscript(newExp)}/${newExp} + ${b}x + C`,
          alternatives: [
            `${a}x^${newExp}/${newExp} + ${b}x + C`,
            `(${a}x^${newExp})/${newExp} + ${b}x + C`,
            `(${a}/${newExp})x^${newExp} + ${b}x + C`
          ],
          steps: [
            'Integriere jeden Term einzeln',
            `Term 1: ∫ ${a}x${toSuperscript(n)} dx = ${a} · x${toSuperscript(newExp)}/${newExp}`,
            `Term 2: ∫ ${b} dx = ${b}x`,
            `Zusammen: ${a}x${toSuperscript(newExp)}/${newExp} + ${b}x + C`
          ]
        };
      }
      case 'exponential': {
        const a = randomCoeff();
        return {
          ...template,
          question: `∫ ${a}eˣ dx`,
          solution: `${a}eˣ + C`,
          alternatives: [`${a}e^x + C`, `${a}*e^x + C`],
          steps: [
            'Konstante vor das Integral ziehen',
            `∫ ${a}eˣ dx = ${a} · ∫ eˣ dx`,
            `= ${a}eˣ + C`
          ]
        };
      }
      case 'log': {
        const a = randomCoeff();
        return {
          ...template,
          question: `∫ ${a}/x dx`,
          solution: `${a}ln|x| + C`,
          alternatives: [`${a}·ln|x| + C`, `${a}*ln|x| + C`, `${a}ln(|x|) + C`],
          steps: [
            'Konstante vor das Integral',
            `∫ ${a}/x dx = ${a} · ∫ 1/x dx`,
            `= ${a}ln|x| + C`
          ]
        };
      }
      case 'trig_sin': {
        const a = randomSmallCoeff();
        return {
          ...template,
          question: `∫ ${a}sin(x) dx`,
          solution: `-${a}cos(x) + C`,
          alternatives: [`-${a}cos x + C`, `-${a}cosx + C`],
          steps: [
            'Konstante vor das Integral',
            `∫ ${a}sin(x) dx = ${a} · ∫ sin(x) dx`,
            `= ${a} · (-cos(x)) + C`,
            `= -${a}cos(x) + C`
          ]
        };
      }
      case 'trig_cos': {
        const a = randomSmallCoeff();
        return {
          ...template,
          question: `∫ ${a}cos(x) dx`,
          solution: `${a}sin(x) + C`,
          alternatives: [`${a}sin x + C`, `${a}sinx + C`],
          steps: [
            'Konstante vor das Integral',
            `∫ ${a}cos(x) dx = ${a} · ∫ cos(x) dx`,
            `= ${a}sin(x) + C`
          ]
        };
      }
      default:
        return template;
    }
  };

  const exercises = {
    potenz: {
      name: 'Potenzregel',
      formula: <>∫ x<sup>n</sup> dx = <Fraction num={<>x<sup>n+1</sup></>} den="n+1" /> + C</>,
      color: '#ff6b35',
      exercises: [
        {
          id: 'potenz1',
          difficulty: 'Einfach',
          question: '∫ x³ dx',
          solution: 'x⁴/4 + C',
          alternatives: ['x^4/4 + C', '(x^4)/4 + C', '0.25x^4 + C', '(1/4)x^4 + C'],
          steps: [
            'Wende die Potenzregel an: ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C',
            'Hier ist n = 3',
            'Erhöhe den Exponenten: 3 + 1 = 4',
            'Teile durch den neuen Exponenten: x⁴/4',
            'Lösung: x⁴/4 + C'
          ],
          hint: 'Erhöhe den Exponenten um 1 und teile durch den neuen Exponenten.'
        },
        {
          id: 'potenz_gen_1',
          difficulty: 'Einfach',
          isGenerated: true,
          template: { type: 'potenz_einfach' },
          question: 'Wird generiert...',
          solution: '',
          alternatives: [],
          steps: [],
          hint: 'Wende die Potenzregel an: erhöhe den Exponenten um 1 und teile durch den neuen Exponenten.'
        },
        {
          id: 'potenz_gen_2',
          difficulty: 'Mittel',
          isGenerated: true,
          template: { type: 'potenz_mittel' },
          question: 'Wird generiert...',
          solution: '',
          alternatives: [],
          steps: [],
          hint: 'Integriere jeden Term einzeln mit der Potenzregel.'
        }
      ]
    },
    logarithmus: {
      name: 'Logarithmus',
      formula: <>∫ <Fraction num="1" den="x" /> dx = ln|x| + C</>,
      color: '#4ecdc4',
      exercises: [
        {
          id: 'log1',
          difficulty: 'Einfach',
          question: '∫ 1/x dx',
          solution: 'ln|x| + C',
          alternatives: ['ln(|x|) + C', 'ln|x|+C'],
          steps: [
            'Dies ist der Spezialfall für n = −1',
            'Die Potenzregel funktioniert NICHT für n = −1',
            'Stattdessen: ∫ 1/x dx = ln|x| + C',
            'Lösung: ln|x| + C'
          ],
          hint: 'Standardformel! Stammfunktion von 1/x ist ln|x|.'
        },
        {
          id: 'log_gen_1',
          difficulty: 'Einfach',
          isGenerated: true,
          template: { type: 'log' },
          question: 'Wird generiert...',
          solution: '',
          alternatives: [],
          steps: [],
          hint: 'Stammfunktion von 1/x ist ln|x|.'
        }
      ]
    },
    exponential: {
      name: 'Exponentialfunktion',
      formula: <>∫ e<sup>x</sup> dx = e<sup>x</sup> + C</>,
      color: '#f9ca24',
      exercises: [
        {
          id: 'exp1',
          difficulty: 'Einfach',
          question: '∫ eˣ dx',
          solution: 'eˣ + C',
          alternatives: ['e^x + C', 'exp(x) + C'],
          steps: [
            'Die e-Funktion ist besonders!',
            '∫ eˣ dx = eˣ + C'
          ],
          hint: 'Die e-Funktion bleibt beim Integrieren unverändert!'
        },
        {
          id: 'exp_gen_1',
          difficulty: 'Einfach',
          isGenerated: true,
          template: { type: 'exponential' },
          question: 'Wird generiert...',
          solution: '',
          alternatives: [],
          steps: [],
          hint: 'Die e-Funktion bleibt beim Integrieren gleich.'
        }
      ]
    },
    trigonometrie: {
      name: 'Trigonometrie',
      formula: <>∫ sin(x) dx = −cos(x) + C; ∫ cos(x) dx = sin(x) + C</>,
      color: '#e056fd',
      exercises: [
        {
          id: 'trig1',
          difficulty: 'Einfach',
          question: '∫ sin(x) dx',
          solution: '-cos(x) + C',
          alternatives: ['-cos x + C', '-cosx + C'],
          steps: [
            'd/dx(−cos(x)) = sin(x)',
            '∫ sin(x) dx = −cos(x) + C',
            'WICHTIG: Minuszeichen!'
          ],
          hint: 'Stammfunktion von sin(x) ist −cos(x).'
        },
        {
          id: 'trig_gen_1',
          difficulty: 'Einfach',
          isGenerated: true,
          template: { type: 'trig_sin' },
          question: 'Wird generiert...',
          solution: '',
          alternatives: [],
          steps: [],
          hint: 'Stammfunktion von sin(x) ist −cos(x).'
        }
      ]
    },
    substitution: {
      name: 'Substitution',
      formula: <>∫ f(g(x))·g′(x) dx = F(g(x)) + C</>,
      color: '#9b59b6',
      exercises: [
        {
          id: 'sub1',
          difficulty: 'Einfach',
          question: '∫ 2x·eˣ² dx',
          solution: 'eˣ² + C',
          alternatives: ['e^(x^2) + C', 'e^x^2 + C'],
          steps: [
            'Substitution: u = x²',
            'Dann: du = 2x dx',
            '∫ eᵘ du = eᵘ + C',
            'Rücksubstitution: eˣ² + C'
          ],
          hint: 'Setze u = x². 2x ist die Ableitung von x²!'
        }
      ]
    },
    partiell: {
      name: 'Partielle Integration',
      formula: <>∫ u·v′ dx = u·v − ∫ u′·v dx</>,
      color: '#e74c3c',
      exercises: [
        {
          id: 'part1',
          difficulty: 'Einfach',
          question: '∫ x·eˣ dx',
          solution: 'x·eˣ - eˣ + C',
          alternatives: ['xeˣ - eˣ + C', 'xe^x - e^x + C', '(x-1)e^x + C'],
          steps: [
            'u = x, v′ = eˣ',
            'u′ = 1, v = eˣ',
            '∫ x·eˣ dx = x·eˣ − ∫ eˣ dx',
            '= x·eˣ − eˣ + C'
          ],
          hint: 'u = x, v′ = eˣ.'
        }
      ]
    },
    partialbruch: {
      name: 'Partialbruchzerlegung',
      formula: <>Zerlege <Fraction num="P(x)" den="Q(x)" /> in einfachere Brüche</>,
      color: '#3498db',
      exercises: [
        {
          id: 'pb1',
          difficulty: 'Mittel',
          question: '∫ 1/(x²-1) dx',
          solution: '(1/2)ln|x-1| - (1/2)ln|x+1| + C',
          alternatives: ['0.5ln|x-1| - 0.5ln|x+1| + C'],
          steps: [
            'x² − 1 = (x−1)(x+1)',
            '1/((x−1)(x+1)) = A/(x−1) + B/(x+1)',
            'A = 1/2, B = −1/2',
            '= (1/2)ln|x−1| − (1/2)ln|x+1| + C'
          ],
          hint: 'Faktorisiere x² − 1!'
        }
      ]
    },
    trigsubst: {
      name: 'Trigonometrische Substitution',
      formula: <>Nutze sin/cos/tan für Wurzeln</>,
      color: '#16a085',
      exercises: [
        {
          id: 'ts1',
          difficulty: 'Schwer',
          question: '∫ √(1-x²) dx',
          solution: '(x√(1-x²) + arcsin(x))/2 + C',
          alternatives: ['0.5(x√(1-x²) + arcsin(x)) + C'],
          steps: [
            'x = sin(θ), dx = cos(θ) dθ',
            '√(1−x²) = cos(θ)',
            '∫ cos²(θ) dθ = ...',
            '= (arcsin(x) + x√(1−x²))/2 + C'
          ],
          hint: 'x = sin(θ)!'
        }
      ]
    },
    uneigentlich: {
      name: 'Uneigentliche Integrale',
      formula: <>∫<sub>a</sub><sup>∞</sup> f(x) dx = lim<sub>b→∞</sub> ∫<sub>a</sub><sup>b</sup> f(x) dx</>,
      color: '#c0392b',
      exercises: [
        {
          id: 'un1',
          difficulty: 'Mittel',
          question: '∫₁^∞ 1/x² dx',
          solution: '1',
          alternatives: ['1.0', '1,0'],
          steps: [
            '= lim(b→∞) ∫₁^b 1/x² dx',
            'F(x) = −1/x',
            '= lim(b→∞) (−1/b + 1) = 1'
          ],
          hint: 'Ersetze ∞ durch b, dann Grenzwert!'
        }
      ]
    }
  };

  useEffect(() => {
    if (selectedRule && exercises[selectedRule]) {
      const rule = exercises[selectedRule];
      const newGenerated = {};
      
      rule.exercises.forEach(ex => {
        if (ex.isGenerated && !generatedExercises[ex.id]) {
          newGenerated[ex.id] = generateExercise(ex.template);
        }
      });
      
      if (Object.keys(newGenerated).length > 0) {
        setGeneratedExercises(prev => ({ ...prev, ...newGenerated }));
      }
    }
  }, [selectedRule]);

  useEffect(() => {
    if (currentSlide === 2 && isAutoAnimating) {
      const interval = setInterval(() => {
        setRectangleCount(prev => {
          if (prev >= 50) return 4;
          return prev + 1;
        });
      }, 100);
      return () => clearInterval(interval);
    }
  }, [currentSlide, isAutoAnimating]);

  const handleSliderChange = (value) => {
    setIsAutoAnimating(false);
    setRectangleCount(value);
  };

  const generateParabolaData = () => {
    const data = [];
    for (let x = 0; x <= 2; x += 0.05) {
      data.push({ x: x, y: x * x });
    }
    return data;
  };

  const generateRectangles = (n) => {
    const width = 2 / n;
    const rects = [];
    for (let i = 0; i < n; i++) {
      const x = i * width;
      const height = x * x;
      rects.push({ x, height, width });
    }
    return rects;
  };

  const formatXAxis = (value) => {
    return value.toFixed(2);
  };

  const checkAnswer = (exerciseId, userAnswer, correctAnswer, alternatives = []) => {
    if (!userAnswer.trim()) return false;
    
    const normalize = (str) => str.toLowerCase()
      .replace(/\s+/g, '')
      .replace(/\*/g, '·')
      .replace(/\^/g, '');
    
    const normalizedUser = normalize(userAnswer);
    const normalizedCorrect = normalize(correctAnswer);
    const normalizedAlternatives = alternatives.map(alt => normalize(alt));
    
    const isCorrect = normalizedUser === normalizedCorrect || 
                     normalizedAlternatives.includes(normalizedUser);
    
    setCheckedAnswers(prev => ({ ...prev, [exerciseId]: isCorrect }));
    
    if (isCorrect) {
      setSolvedExercises(prev => ({ ...prev, [exerciseId]: true }));
    }
    
    setInputHistory(prev => {
      const currentHistory = prev[exerciseId] || [];
      const newHistory = [
        { answer: userAnswer, correct: isCorrect, timestamp: Date.now() },
        ...currentHistory
      ].slice(0, 3);
      
      return { ...prev, [exerciseId]: newHistory };
    });
    
    if (!isCorrect) {
      setFailedAttempts(prev => {
        const attempts = (prev[exerciseId] || 0) + 1;
        if (attempts >= 2) {
          setShowHints(prevHints => ({ ...prevHints, [exerciseId]: true }));
        }
        return { ...prev, [exerciseId]: attempts };
      });
    }
    
    return isCorrect;
  };

  const calculateProgress = () => {
    let totalExercises = 0;
    let solvedCount = 0;

    Object.values(exercises).forEach(rule => {
      totalExercises += rule.exercises.length;
      rule.exercises.forEach(ex => {
        if (solvedExercises[ex.id]) {
          solvedCount++;
        }
      });
    });

    return {
      solved: solvedCount,
      total: totalExercises,
      percentage: Math.round((solvedCount / totalExercises) * 100)
    };
  };

  const progress = calculateProgress();

  const ExerciseCard = ({ exercise, ruleColor }) => {
    const actualExercise = exercise.isGenerated && generatedExercises[exercise.id] 
      ? { ...exercise, ...generatedExercises[exercise.id] }
      : exercise;

    const [inputValue, setInputValue] = useState('');
    const isChecked = checkedAnswers[actualExercise.id] !== undefined;
    const isCorrect = checkedAnswers[actualExercise.id];
    const solutionVisible = showSolution[actualExercise.id];
    const hintVisible = showHints[actualExercise.id];
    const attempts = failedAttempts[actualExercise.id] || 0;
    const history = inputHistory[actualExercise.id] || [];
    const isSolved = solvedExercises[actualExercise.id];

    const regenerateExercise = () => {
      if (actualExercise.isGenerated) {
        const newEx = generateExercise(actualExercise.template);
        setGeneratedExercises(prev => ({ ...prev, [actualExercise.id]: newEx }));
        setInputValue('');
        setCheckedAnswers(prev => { const n = { ...prev }; delete n[actualExercise.id]; return n; });
        setShowSolution(prev => { const n = { ...prev }; delete n[actualExercise.id]; return n; });
        setShowHints(prev => { const n = { ...prev }; delete n[actualExercise.id]; return n; });
        setFailedAttempts(prev => { const n = { ...prev }; delete n[actualExercise.id]; return n; });
        setInputHistory(prev => { const n = { ...prev }; delete n[actualExercise.id]; return n; });
        setSolvedExercises(prev => { const n = { ...prev }; delete n[actualExercise.id]; return n; });
      }
    };

    return (
      <div className={`exercise-card ${isSolved ? 'solved' : ''}`}>
        <div className="exercise-header">
          <div className="exercise-header-left">
            <span className={`difficulty difficulty-${actualExercise.difficulty.toLowerCase()}`}>
              {actualExercise.difficulty}
            </span>
            {isSolved && (
              <span className="solved-badge">
                <Trophy size={16} />
                Gelöst
              </span>
            )}
            {actualExercise.isGenerated && (
              <button 
                className="regenerate-button"
                onClick={regenerateExercise}
              >
                <RefreshCw size={16} />
                Neu
              </button>
            )}
          </div>
          {attempts > 0 && !isSolved && (
            <span className="attempts-counter">Versuche: {attempts}</span>
          )}
        </div>
        
        <div className="exercise-question">
          <div className="question-text">{actualExercise.question}</div>
          
          <div className="hint-section">
            <button
              className="hint-toggle"
              onClick={() => setShowHints(prev => ({...prev, [actualExercise.id]: !prev[actualExercise.id]}))}
              style={{ 
                borderColor: hintVisible ? ruleColor : 'rgba(249, 202, 36, 0.3)',
                color: hintVisible ? ruleColor : 'rgba(249, 202, 36, 0.8)'
              }}
            >
              💡 {hintVisible ? 'Tipp ausblenden' : 'Tipp anzeigen'}
            </button>
            
            {hintVisible && (
              <div className="hint-box" style={{ borderColor: ruleColor }}>
                {actualExercise.hint}
                {attempts >= 2 && (
                  <div className="auto-hint-notice">
                    (Automatisch nach 2 Fehlversuchen)
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {history.length > 0 && (
          <div className="input-history">
            <div className="history-title">Letzte Eingaben:</div>
            {history.map((entry, idx) => (
              <div 
                key={entry.timestamp} 
                className={`history-entry ${entry.correct ? 'history-correct' : 'history-incorrect'}`}
              >
                <span className="history-number">{history.length - idx}.</span>
                <span className="history-answer">{entry.answer}</span>
                <span className="history-icon">{entry.correct ? '✓' : '✗'}</span>
              </div>
            ))}
          </div>
        )}

        <div className="answer-section">
          <input
            type="text"
            placeholder="Deine Antwort..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                checkAnswer(actualExercise.id, inputValue, actualExercise.solution, actualExercise.alternatives);
              }
            }}
            className={`answer-input ${isChecked ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
          />
          <button
            className="check-button"
            onClick={() => checkAnswer(actualExercise.id, inputValue, actualExercise.solution, actualExercise.alternatives)}
            style={{ borderColor: ruleColor, color: ruleColor }}
          >
            <Check size={20} />
            Prüfen
          </button>
        </div>

        {isChecked && (
          <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? (
              <><Check size={24} /><span>Richtig!</span></>
            ) : (
              <><X size={24} /><span>Noch nicht ganz.</span></>
            )}
          </div>
        )}

        <button
          className="solution-toggle"
          onClick={() => setShowSolution(prev => ({...prev, [actualExercise.id]: !prev[actualExercise.id]}))}
        >
          {solutionVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          {solutionVisible ? 'Lösung ausblenden' : 'Lösung anzeigen'}
        </button>

        {solutionVisible && (
          <div className="solution-box">
            <h4>Lösung:</h4>
            {actualExercise.steps.map((step, idx) => (
              <div key={idx} className={`solution-step ${step === '' ? 'spacer' : ''}`}>
                {step && <><span className="step-number">{idx + 1}.</span> {step}</>}
              </div>
            ))}
            <div className="final-answer" style={{ borderColor: ruleColor }}>
              <strong>Antwort:</strong> {actualExercise.solution}
            </div>
          </div>
        )}
      </div>
    );
  };

  const slides = [
    {
      title: "Was ist ein Integral?",
      subtitle: "Die fundamentale Idee",
      content: (
        <div className="slide-content">
          <div className="concept-box">
            <h3>Die Kernidee</h3>
            <p>Wie berechnet man die Fläche unter einer Kurve?</p>
            <div className="idea-flow">
              <div className="step">
                <div className="step-number">1</div>
                <p>Rechtecke</p>
              </div>
              <div className="arrow">→</div>
              <div className="step">
                <div className="step-number">2</div>
                <p>Addieren</p>
              </div>
              <div className="arrow">→</div>
              <div className="step">
                <div className="step-number">3</div>
                <p>Unendlich klein</p>
              </div>
            </div>
          </div>
          <div className="visual-representation">
            <div className="integral-symbol">∫</div>
            <p className="symbol-explanation">∫ = "Summa" (Summe)</p>
          </div>
        </div>
      )
    },
    {
      title: "Geometrische Bedeutung",
      subtitle: "Fläche unter der Kurve",
      content: (
        <div className="slide-content">
          <div className="formula-box">
            <div className="formula-display">
              <span className="integral-green">∫</span>
              <sub className="limits-orange">a</sub>
              <sup className="limits-orange">b</sup>{' '}
              <span className="function-turquoise">f(x)</span>{' '}
              <span className="dx-yellow">dx</span>
            </div>
            <div className="formula-explanation-row">
              <div className="explanation-item">
                <span className="integral-green big-symbol">∫</span>
                <span className="explanation-text">= Summe über alle infinitesimal kleinen Flächenelemente</span>
              </div>
            </div>
            <div className="formula-parts">
              <div className="part">
                <span className="limits-orange">a, b</span> = Integrationsgrenzen
              </div>
              <div className="part">
                <span className="function-turquoise">f(x)</span> = Funktion (Höhe)
              </div>
              <div className="part">
                <span className="dx-yellow">dx</span> = infinitesimal kleine Breite
              </div>
            </div>
          </div>
          <div className="chart-container">
            <AreaChart width={500} height={300} data={generateParabolaData()}>
              <defs>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4ecdc4" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#4ecdc4" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis 
                dataKey="x" 
                stroke="#fff" 
                tickFormatter={formatXAxis}
              />
              <YAxis stroke="#fff" />
              <Area 
                type="monotone" 
                dataKey="y" 
                stroke="#4ecdc4" 
                strokeWidth={3} 
                fill="url(#colorArea)" 
              />
            </AreaChart>
            <p className="chart-label">f(x) = x²</p>
          </div>
        </div>
      )
    },
    {
      title: "Riemann-Summen",
      subtitle: "Annäherung durch Rechtecke",
      content: (
        <div className="slide-content">
          <div className="interactive-demo">
            <div className="controls">
              <label>Anzahl Rechtecke: <strong>{rectangleCount}</strong></label>
              <input 
                type="range" 
                min="2" 
                max="50" 
                value={rectangleCount} 
                onChange={(e) => handleSliderChange(Number(e.target.value))}
                className="slider"
              />
              {!isAutoAnimating && (
                <button 
                  className="restart-animation-btn"
                  onClick={() => {
                    setRectangleCount(4);
                    setIsAutoAnimating(true);
                  }}
                >
                  <RefreshCw size={18} />
                  Animation neu starten
                </button>
              )}
            </div>
            <div className="rectangle-visualization">
              <svg width="500" height="300" viewBox="0 0 500 300">
                <line x1="50" y1="250" x2="450" y2="250" stroke="#666" strokeWidth="2" />
                <line x1="50" y1="250" x2="50" y2="50" stroke="#666" strokeWidth="2" />
                
                <path
                  d={generateParabolaData().map((p, i) => 
                    `${i === 0 ? 'M' : 'L'} ${50 + p.x * 200} ${250 - p.y * 50}`
                  ).join(' ')}
                  stroke="#4ecdc4"
                  strokeWidth="3"
                  fill="none"
                />
                
                {generateRectangles(rectangleCount).map((rect, i) => (
                  <rect
                    key={i}
                    x={50 + rect.x * 200}
                    y={250 - rect.height * 50}
                    width={rect.width * 200}
                    height={rect.height * 50}
                    fill="#f9ca24"
                    fillOpacity="0.6"
                    stroke="#f9ca24"
                    strokeWidth="2"
                  />
                ))}
              </svg>
            </div>
            <div className="explanation-box">
              <p>Je mehr Rechtecke, desto genauer!</p>
              <div className="calculation">
                Annäherung: {generateRectangles(rectangleCount).reduce((sum, rect) => sum + rect.height * rect.width, 0).toFixed(3)}
                <br />
                <span className="exact-value">Exakt: <Fraction num="8" den="3" /> ≈ 2.667</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Hauptsatz",
      subtitle: "Ableiten ↔ Integrieren",
      content: (
        <div className="slide-content">
          <div className="theorem-box">
            <h3>Hauptsatz der Integralrechnung</h3>
            <div className="theorem-statement">
              Wenn F'(x) = f(x), dann:
              <div className="big-formula">
                ∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) − F(a)
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Grundregeln",
      subtitle: "Klick auf eine Regel!",
      content: (
        <div className="slide-content">
          {!selectedRule ? (
            <div className="rules-grid">
              {['potenz', 'logarithmus', 'exponential', 'trigonometrie'].map(key => {
                const rule = exercises[key];
                const ruleProgress = rule.exercises.filter(ex => solvedExercises[ex.id]).length;
                const ruleTotal = rule.exercises.length;
                return (
                  <div 
                    key={key}
                    className="rule-card clickable"
                    onClick={() => setSelectedRule(key)}
                    style={{ borderColor: rule.color }}
                  >
                    <div className="rule-name" style={{ color: rule.color }}>{rule.name}</div>
                    <div className="rule-formula">{rule.formula}</div>
                    <div className="rule-progress">
                      <div className="progress-text">{ruleProgress} / {ruleTotal} gelöst</div>
                      <div className="progress-bar-small">
                        <div className="progress-fill-small" style={{ width: `${(ruleProgress / ruleTotal) * 100}%`, backgroundColor: rule.color }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="exercises-view">
              <button 
                className="back-button"
                onClick={() => setSelectedRule(null)}
                style={{ borderColor: exercises[selectedRule].color }}
              >
                ← Zurück
              </button>
              <div className="exercise-header-info">
                <h3 style={{ color: exercises[selectedRule].color }}>{exercises[selectedRule].name}</h3>
              </div>
              <div className="exercises-container">
                {exercises[selectedRule].exercises.map((exercise) => (
                  <ExerciseCard key={exercise.id} exercise={exercise} ruleColor={exercises[selectedRule].color} />
                ))}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: "Substitution",
      subtitle: "Komplexe Integrale vereinfachen",
      content: (
        <div className="slide-content">
          {!selectedRule ? (
            <>
              <div className="substitution-intro">
                <h3>Was ist Substitution?</h3>
                <p>Ersetze komplizierte Terme durch neue Variablen.</p>
              </div>
              <div className="rule-card clickable" 
                   onClick={() => setSelectedRule('substitution')}
                   style={{ borderColor: exercises.substitution.color }}>
                <div className="rule-name" style={{ color: exercises.substitution.color }}>Substitution</div>
                <div className="rule-formula">{exercises.substitution.formula}</div>
              </div>
            </>
          ) : (
            <div className="exercises-view">
              <button 
                className="back-button"
                onClick={() => setSelectedRule(null)}
                style={{ borderColor: exercises[selectedRule].color }}
              >
                ← Zurück
              </button>
              <div className="exercises-container">
                {exercises[selectedRule].exercises.map((exercise) => (
                  <ExerciseCard key={exercise.id} exercise={exercise} ruleColor={exercises[selectedRule].color} />
                ))}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: "Partielle Integration",
      subtitle: "Produktregel rückwärts",
      content: (
        <div className="slide-content">
          {!selectedRule ? (
            <>
              <div className="method-box">
                <h3>Die Methode</h3>
                <p>∫ u·v′ dx = u·v − ∫ u′·v dx</p>
              </div>
              <div className="rule-card clickable" 
                   onClick={() => setSelectedRule('partiell')}
                   style={{ borderColor: exercises.partiell.color }}>
                <div className="rule-name" style={{ color: exercises.partiell.color }}>Partielle Integration</div>
                <div className="rule-formula">{exercises.partiell.formula}</div>
              </div>
            </>
          ) : (
            <div className="exercises-view">
              <button 
                className="back-button"
                onClick={() => setSelectedRule(null)}
                style={{ borderColor: exercises[selectedRule].color }}
              >
                ← Zurück
              </button>
              <div className="exercises-container">
                {exercises[selectedRule].exercises.map((exercise) => (
                  <ExerciseCard key={exercise.id} exercise={exercise} ruleColor={exercises[selectedRule].color} />
                ))}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: "Partialbruchzerlegung",
      subtitle: "Brüche aufteilen",
      content: (
        <div className="slide-content">
          {!selectedRule ? (
            <>
              <div className="method-box">
                <h3>Die Methode</h3>
                <p>Zerlege komplexe Brüche in einfache Summanden.</p>
              </div>
              <div className="rule-card clickable" 
                   onClick={() => setSelectedRule('partialbruch')}
                   style={{ borderColor: exercises.partialbruch.color }}>
                <div className="rule-name" style={{ color: exercises.partialbruch.color }}>Partialbruchzerlegung</div>
                <div className="rule-formula">{exercises.partialbruch.formula}</div>
              </div>
            </>
          ) : (
            <div className="exercises-view">
              <button 
                className="back-button"
                onClick={() => setSelectedRule(null)}
                style={{ borderColor: exercises[selectedRule].color }}
              >
                ← Zurück
              </button>
              <div className="exercises-container">
                {exercises[selectedRule].exercises.map((exercise) => (
                  <ExerciseCard key={exercise.id} exercise={exercise} ruleColor={exercises[selectedRule].color} />
                ))}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: "Trigonometrische Substitution",
      subtitle: "Wurzeln vereinfachen",
      content: (
        <div className="slide-content">
          {!selectedRule ? (
            <>
              <div className="method-box">
                <h3>Die Methode</h3>
                <p>Nutze sin/cos/tan für Wurzelausdrücke.</p>
              </div>
              <div className="rule-card clickable" 
                   onClick={() => setSelectedRule('trigsubst')}
                   style={{ borderColor: exercises.trigsubst.color }}>
                <div className="rule-name" style={{ color: exercises.trigsubst.color }}>Trigonometrische Substitution</div>
                <div className="rule-formula">{exercises.trigsubst.formula}</div>
              </div>
            </>
          ) : (
            <div className="exercises-view">
              <button 
                className="back-button"
                onClick={() => setSelectedRule(null)}
                style={{ borderColor: exercises[selectedRule].color }}
              >
                ← Zurück
              </button>
              <div className="exercises-container">
                {exercises[selectedRule].exercises.map((exercise) => (
                  <ExerciseCard key={exercise.id} exercise={exercise} ruleColor={exercises[selectedRule].color} />
                ))}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: "Uneigentliche Integrale",
      subtitle: "Grenzwerte bei ∞",
      content: (
        <div className="slide-content">
          {!selectedRule ? (
            <>
              <div className="method-box">
                <h3>Die Methode</h3>
                <p>Ersetze ∞ durch Variable, dann Grenzwert berechnen.</p>
              </div>
              <div className="rule-card clickable" 
                   onClick={() => setSelectedRule('uneigentlich')}
                   style={{ borderColor: exercises.uneigentlich.color }}>
                <div className="rule-name" style={{ color: exercises.uneigentlich.color }}>Uneigentliche Integrale</div>
                <div className="rule-formula">{exercises.uneigentlich.formula}</div>
              </div>
            </>
          ) : (
            <div className="exercises-view">
              <button 
                className="back-button"
                onClick={() => setSelectedRule(null)}
                style={{ borderColor: exercises[selectedRule].color }}
              >
                ← Zurück
              </button>
              <div className="exercises-container">
                {exercises[selectedRule].exercises.map((exercise) => (
                  <ExerciseCard key={exercise.id} exercise={exercise} ruleColor={exercises[selectedRule].color} />
                ))}
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: "Zusammenfassung",
      subtitle: "Du hast es geschafft!",
      content: (
        <div className="slide-content">
          <div className="summary-box">
            <h3>Dein Fortschritt</h3>
            <div className="big-stat">{progress.solved} / {progress.total}</div>
            <p>Aufgaben gelöst ({progress.percentage}%)</p>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      setSelectedRule(null);
      setIsAutoAnimating(true);
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setSelectedRule(null);
      setIsAutoAnimating(true);
    }
  };

  return (
    <div className="tutorial-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Bitter:wght@300;400;600;700&display=swap');
        
        * { margin: 0; padding: 0; box-sizing: border-box; }
        
        .fraction {
          display: inline-flex;
          flex-direction: column;
          align-items: center;
          vertical-align: middle;
          margin: 0 0.2em;
        }
        
        .numerator {
          border-bottom: 1px solid currentColor;
          padding: 0 0.3em 0.1em;
        }
        
        .denominator {
          padding: 0.1em 0.3em 0;
        }
        
        .integral-green { color: #4ecdc4; font-size: 1.2em; font-weight: 700; }
        .limits-orange { color: #ff6b35; font-weight: 700; }
        .function-turquoise { color: #4ecdc4; font-weight: 700; }
        .dx-yellow { color: #f9ca24; font-weight: 700; }
        .big-symbol { font-size: 3rem; margin-right: 1rem; }
        
        .formula-explanation-row {
          display: flex;
          justify-content: center;
          margin: 2rem 0;
          padding: 1.5rem;
          background: rgba(78, 205, 196, 0.1);
          border-radius: 12px;
          border: 2px solid rgba(78, 205, 196, 0.3);
        }
        
        .explanation-item { display: flex; align-items: center; gap: 1rem; }
        .explanation-text { font-size: 1.1rem; color: rgba(255, 255, 255, 0.9); }
        
        .regenerate-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(78, 205, 196, 0.2);
          border: 1px solid #4ecdc4;
          border-radius: 20px;
          color: #4ecdc4;
          font-size: 0.85rem;
          font-weight: 700;
          font-family: 'Space Mono', monospace;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .regenerate-button:hover {
          background: rgba(78, 205, 196, 0.3);
          transform: scale(1.05);
        }
        
        .restart-animation-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(78, 205, 196, 0.2);
          border: 2px solid #4ecdc4;
          border-radius: 8px;
          color: #4ecdc4;
          font-family: 'Space Mono', monospace;
          font-weight: 700;
          cursor: pointer;
          margin-top: 1rem;
          transition: all 0.3s ease;
        }
        
        .restart-animation-btn:hover {
          background: #4ecdc4;
          color: #1a1a2e;
          transform: translateY(-2px);
        }
        
        .tutorial-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: #fff;
          font-family: 'Bitter', serif;
          position: relative;
          padding-bottom: 100px;
        }
        
        .header {
          padding: 2rem;
          text-align: center;
          border-bottom: 2px solid rgba(255, 255, 255, 0.1);
          background: rgba(0, 0, 0, 0.2);
          backdrop-filter: blur(10px);
          position: relative;
        }
        
        .header h1 {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          background: linear-gradient(135deg, #ff6b35 0%, #4ecdc4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          font-family: 'Space Mono', monospace;
        }
        
        .header p { font-size: 1.1rem; color: rgba(255, 255, 255, 0.7); }
        
        .global-progress {
          position: absolute;
          top: 1rem;
          right: 2rem;
          display: flex;
          align-items: center;
          gap: 1rem;
          background: rgba(0, 0, 0, 0.3);
          padding: 0.75rem 1.5rem;
          border-radius: 50px;
          border: 2px solid rgba(78, 205, 196, 0.3);
        }
        
        .progress-icon { color: #4ecdc4; }
        .progress-info { display: flex; flex-direction: column; align-items: flex-start; }
        .progress-label { font-size: 0.8rem; color: rgba(255, 255, 255, 0.6); font-family: 'Space Mono', monospace; }
        .progress-stats { font-size: 1.1rem; font-weight: 700; color: #4ecdc4; font-family: 'Space Mono', monospace; }
        
        .progress-bar {
          width: 150px;
          height: 8px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          overflow: hidden;
        }
        
        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #ff6b35 0%, #4ecdc4 100%);
          transition: width 0.5s ease;
          border-radius: 4px;
        }
        
        .slide-wrapper {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          padding: 3rem 2rem;
        }
        
        .slide-header { text-align: center; margin-bottom: 3rem; }
        .slide-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
          font-family: 'Space Mono', monospace;
          color: #4ecdc4;
        }
        
        .slide-subtitle {
          font-size: 1.3rem;
          color: rgba(255, 255, 255, 0.6);
          font-weight: 300;
        }
        
        .concept-box, .formula-box, .theorem-box, .method-box, .substitution-intro {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(78, 205, 196, 0.3);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
        }
        
        .concept-box h3, .formula-box h3, .theorem-box h3, .method-box h3, .substitution-intro h3 {
          color: #4ecdc4;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }
        
        .idea-flow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 2rem;
          gap: 1rem;
        }
        
        .step {
          flex: 1;
          min-width: 150px;
          text-align: center;
          padding: 1.5rem;
          background: rgba(255, 107, 53, 0.1);
          border: 2px solid rgba(255, 107, 53, 0.3);
          border-radius: 12px;
        }
        
        .step-number {
          display: inline-block;
          width: 40px;
          height: 40px;
          background: #ff6b35;
          color: #1a1a2e;
          border-radius: 50%;
          line-height: 40px;
          font-weight: 700;
          margin-bottom: 1rem;
        }
        
        .arrow { font-size: 2rem; color: #4ecdc4; font-weight: 700; }
        
        .visual-representation {
          text-align: center;
          padding: 3rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 16px;
        }
        
        .integral-symbol {
          font-size: 8rem;
          color: #ff6b35;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 1rem;
        }
        
        .symbol-explanation { font-size: 1.2rem; color: rgba(255, 255, 255, 0.7); }
        
        .formula-display {
          font-size: 3rem;
          text-align: center;
          margin: 2rem 0;
          color: #4ecdc4;
          font-family: 'Space Mono', monospace;
          font-weight: 700;
        }
        
        .formula-parts {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-top: 2rem;
        }
        
        .part {
          padding: 1rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          font-size: 1.1rem;
        }
        
        .chart-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          margin-top: 2rem;
          background: rgba(0, 0, 0, 0.3);
          padding: 2rem;
          border-radius: 16px;
        }
        
        .chart-label {
          margin-top: 1rem;
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.8);
          font-family: 'Space Mono', monospace;
        }
        
        .interactive-demo {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(78, 205, 196, 0.3);
          border-radius: 16px;
          padding: 2rem;
        }
        
        .controls { margin-bottom: 2rem; text-align: center; }
        .controls label { display: block; margin-bottom: 1rem; font-size: 1.2rem; }
        
        .slider {
          width: 100%;
          max-width: 400px;
          height: 8px;
          border-radius: 4px;
          background: rgba(255, 255, 255, 0.1);
          outline: none;
          -webkit-appearance: none;
        }
        
        .slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #ff6b35;
          cursor: pointer;
        }
        
        .rectangle-visualization { display: flex; justify-content: center; margin: 2rem 0; }
        
        .explanation-box {
          background: rgba(0, 0, 0, 0.3);
          padding: 1.5rem;
          border-radius: 12px;
          margin-top: 2rem;
        }
        
        .calculation {
          margin-top: 1rem;
          padding: 1rem;
          background: rgba(78, 205, 196, 0.1);
          border-left: 4px solid #4ecdc4;
          border-radius: 4px;
          font-family: 'Space Mono', monospace;
        }
        
        .exact-value { color: #4ecdc4; font-weight: 700; }
        
        .theorem-statement { text-align: center; padding: 2rem; }
        .big-formula {
          font-size: 2.5rem;
          color: #ff6b35;
          margin: 2rem 0;
          font-family: 'Space Mono', monospace;
        }
        
        .rules-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .rule-card {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(78, 205, 196, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          transition: transform 0.3s ease;
        }
        
        .rule-card.clickable { cursor: pointer; }
        .rule-card.clickable:hover { transform: translateY(-5px); }
        
        .rule-name {
          color: #ff6b35;
          font-weight: 700;
          font-size: 1.2rem;
          margin-bottom: 1rem;
        }
        
        .rule-formula {
          font-size: 1.1rem;
          margin-bottom: 1rem;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          color: #4ecdc4;
        }
        
        .rule-progress { margin: 1rem 0; }
        .progress-text { font-size: 0.9rem; color: rgba(255, 255, 255, 0.7); margin-bottom: 0.5rem; }
        .progress-bar-small { width: 100%; height: 6px; background: rgba(255, 255, 255, 0.1); border-radius: 3px; overflow: hidden; }
        .progress-fill-small { height: 100%; transition: width 0.5s ease; border-radius: 3px; }
        
        .exercises-view { animation: fadeIn 0.5s ease-out; }
        
        .back-button {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid;
          border-radius: 8px;
          color: inherit;
          font-family: 'Space Mono', monospace;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 2rem;
        }
        
        .back-button:hover { transform: translateX(-5px); }
        
        .exercise-header-info { text-align: center; margin-bottom: 2rem; }
        .exercise-header-info h3 { font-size: 2rem; margin-bottom: 0.5rem; }
        
        .exercises-container { display: flex; flex-direction: column; gap: 2rem; margin-bottom: 2rem; }
        
        .exercise-card {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
        }
        
        .exercise-card.solved {
          border-color: rgba(78, 205, 196, 0.5);
          background: rgba(78, 205, 196, 0.05);
        }
        
        .exercise-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1.5rem; }
        .exercise-header-left { display: flex; align-items: center; gap: 1rem; }
        
        .solved-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(78, 205, 196, 0.2);
          border: 1px solid #4ecdc4;
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 700;
          color: #4ecdc4;
        }
        
        .difficulty {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 700;
        }
        
        .attempts-counter {
          padding: 0.5rem 1rem;
          background: rgba(255, 107, 53, 0.2);
          border: 1px solid rgba(255, 107, 53, 0.5);
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #ff6b35;
        }
        
        .difficulty-einfach { background: rgba(78, 205, 196, 0.2); color: #4ecdc4; border: 1px solid #4ecdc4; }
        .difficulty-mittel { background: rgba(249, 202, 36, 0.2); color: #f9ca24; border: 1px solid #f9ca24; }
        .difficulty-schwer { background: rgba(255, 107, 53, 0.2); color: #ff6b35; border: 1px solid #ff6b35; }
        
        .exercise-question { margin-bottom: 1.5rem; }
        .question-text {
          font-size: 2rem;
          font-family: 'Space Mono', monospace;
          color: #4ecdc4;
          margin-bottom: 1rem;
          padding: 1.5rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          text-align: center;
        }
        
        .hint-section { margin-top: 1rem; }
        .hint-toggle {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(249, 202, 36, 0.1);
          border: 2px solid;
          border-radius: 8px;
          font-size: 0.95rem;
          cursor: pointer;
          margin-bottom: 0.75rem;
        }
        
        .hint-box {
          background: rgba(249, 202, 36, 0.1);
          border-left: 4px solid;
          padding: 1rem;
          border-radius: 4px;
          font-size: 0.95rem;
        }
        
        .auto-hint-notice { margin-top: 0.5rem; font-size: 0.85rem; color: rgba(249, 202, 36, 0.7); font-style: italic; }
        
        .input-history {
          margin: 1.5rem 0;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }
        
        .history-title { font-size: 0.9rem; color: rgba(255, 255, 255, 0.6); margin-bottom: 0.75rem; font-weight: 600; }
        
        .history-entry {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.75rem;
          margin-bottom: 0.5rem;
          border-radius: 6px;
          font-size: 0.95rem;
        }
        
        .history-correct { background: rgba(78, 205, 196, 0.15); border-left: 3px solid #4ecdc4; }
        .history-incorrect { background: rgba(255, 107, 53, 0.15); border-left: 3px solid #ff6b35; }
        .history-number { font-weight: 700; color: rgba(255, 255, 255, 0.5); min-width: 20px; }
        .history-answer { flex: 1; color: rgba(255, 255, 255, 0.9); }
        .history-icon { font-size: 1.1rem; font-weight: 700; }
        .history-correct .history-icon { color: #4ecdc4; }
        .history-incorrect .history-icon { color: #ff6b35; }
        
        .answer-section { display: flex; gap: 1rem; margin-bottom: 1rem; }
        
        .answer-input {
          flex: 1;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: #fff;
          font-size: 1.1rem;
          font-family: 'Space Mono', monospace;
        }
        
        .answer-input:focus { outline: none; border-color: #4ecdc4; }
        .answer-input.correct { border-color: #4ecdc4; background: rgba(78, 205, 196, 0.1); }
        .answer-input.incorrect { border-color: #ff6b35; background: rgba(255, 107, 53, 0.1); }
        
        .check-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid;
          border-radius: 8px;
          font-weight: 700;
          cursor: pointer;
        }
        
        .feedback {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-weight: 600;
        }
        
        .feedback.correct { background: rgba(78, 205, 196, 0.2); border: 2px solid #4ecdc4; color: #4ecdc4; }
        .feedback.incorrect { background: rgba(255, 107, 53, 0.2); border: 2px solid #ff6b35; color: #ff6b35; }
        
        .solution-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: #fff;
          cursor: pointer;
          width: 100%;
          justify-content: center;
        }
        
        .solution-box {
          margin-top: 1.5rem;
          padding: 1.5rem;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 12px;
          border: 2px solid rgba(78, 205, 196, 0.3);
        }
        
        .solution-box h4 { color: #4ecdc4; margin-bottom: 1rem; }
        
        .solution-step {
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 6px;
          display: flex;
          gap: 0.75rem;
        }
        
        .solution-step.spacer { background: transparent; height: 0.5rem; padding: 0; }
        .step-number { color: #ff6b35; font-weight: 700; flex-shrink: 0; }
        
        .final-answer {
          margin-top: 1.5rem;
          padding: 1.5rem;
          background: rgba(78, 205, 196, 0.1);
          border-left: 4px solid;
          border-radius: 8px;
          font-size: 1.2rem;
          font-family: 'Space Mono', monospace;
        }
        
        .summary-box {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(78, 205, 196, 0.3);
          border-radius: 16px;
          padding: 2rem;
          text-align: center;
        }
        
        .summary-box h3 { color: #4ecdc4; margin-bottom: 2rem; font-size: 1.8rem; }
        .big-stat { font-size: 4rem; font-weight: 700; color: #ff6b35; margin: 2rem 0; }
        
        .navigation {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.9);
          border-top: 2px solid rgba(255, 255, 255, 0.1);
          padding: 1.5rem 2rem;
          display: flex;
          justify-content: space-between;
          align-items: center;
          z-index: 100;
        }
        
        .nav-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(78, 205, 196, 0.2);
          border: 2px solid #4ecdc4;
          border-radius: 8px;
          color: #4ecdc4;
          font-weight: 700;
          cursor: pointer;
        }
        
        .nav-button:hover:not(:disabled) { background: #4ecdc4; color: #1a1a2e; }
        .nav-button:disabled { opacity: 0.3; cursor: not-allowed; }
        
        .progress-indicator { display: flex; gap: 0.5rem; align-items: center; }
        .progress-dot { width: 12px; height: 12px; border-radius: 50%; background: rgba(255, 255, 255, 0.2); cursor: pointer; }
        .progress-dot.active { background: #ff6b35; width: 16px; height: 16px; }
        .progress-text { font-family: 'Space Mono', monospace; color: rgba(255, 255, 255, 0.7); margin-left: 1rem; }
        
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        
        @media (max-width: 768px) {
          .header h1 { font-size: 1.8rem; }
          .global-progress { position: static; margin-top: 1rem; justify-content: center; }
          .slide-title { font-size: 1.8rem; }
          .idea-flow { flex-direction: column; }
          .arrow { transform: rotate(90deg); }
          .rules-grid { grid-template-columns: 1fr; }
          .navigation { flex-wrap: wrap; gap: 1rem; }
          .answer-section { flex-direction: column; }
        }
      `}</style>
      
      <div className="header">
        <h1>Integrale Meistern</h1>
        <p>Interaktives Tutorial zur Integralrechnung</p>
        
        <div className="global-progress">
          <TrendingUp size={24} className="progress-icon" />
          <div className="progress-info">
            <div className="progress-label">Dein Fortschritt</div>
            <div className="progress-stats">{progress.solved} / {progress.total}</div>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress.percentage}%` }} />
          </div>
        </div>
      </div>
      
      <div className="slide-wrapper">
        <div className="slide-header">
          <div className="slide-title">{slides[currentSlide].title}</div>
          <div className="slide-subtitle">{slides[currentSlide].subtitle}</div>
        </div>
        {slides[currentSlide].content}
      </div>
      
      <div className="navigation">
        <button 
          className="nav-button" 
          onClick={prevSlide}
          disabled={currentSlide === 0}
        >
          <ChevronLeft size={20} />
          Zurück
        </button>
        
        <div className="progress-indicator">
          {slides.map((_, index) => (
            <div 
              key={index}
              className={`progress-dot ${currentSlide === index ? 'active' : ''}`}
              onClick={() => setCurrentSlide(index)}
            />
          ))}
          <span className="progress-text">{currentSlide + 1} / {slides.length}</span>
        </div>
        
        <button 
          className="nav-button" 
          onClick={nextSlide}
          disabled={currentSlide === slides.length - 1}
        >
          Weiter
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default IntegralTutorial;
