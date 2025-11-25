import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Check, X, Eye, EyeOff, Award, TrendingUp, Trophy } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid } from 'recharts';

const IntegralTutorial = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [rectangleCount, setRectangleCount] = useState(4);
  const [selectedRule, setSelectedRule] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [showSolution, setShowSolution] = useState({});
  const [checkedAnswers, setCheckedAnswers] = useState({});
  const [showHints, setShowHints] = useState({});
  const [failedAttempts, setFailedAttempts] = useState({});
  const [inputHistory, setInputHistory] = useState({});
  
  // Lade Fortschritt aus localStorage
  const [solvedExercises, setSolvedExercises] = useState(() => {
    const saved = localStorage.getItem('integral-tutorial-progress');
    return saved ? JSON.parse(saved) : {};
  });

  // Speichere Fortschritt in localStorage
  useEffect(() => {
    localStorage.setItem('integral-tutorial-progress', JSON.stringify(solvedExercises));
  }, [solvedExercises]);

  // Übungsaufgaben für jede Regel - ERWEITERT mit mehr Aufgaben!
  const exercises = {
    potenz: {
      name: 'Potenzregel',
      formula: '∫ xⁿ dx = xⁿ⁺¹/(n+1) + C',
      color: '#ff6b35',
      exercises: [
        {
          id: 'potenz1',
          difficulty: 'Einfach',
          question: '∫ x³ dx',
          solution: 'x⁴/4 + C',
          alternatives: ['x^4/4 + C', '(x^4)/4 + C', '0.25x^4 + C'],
          steps: [
            'Wende die Potenzregel an: ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C',
            'Hier ist n = 3',
            'Erhöhe den Exponenten: 3 + 1 = 4',
            'Teile durch den neuen Exponenten: x⁴/4',
            'Vergiss nicht die Integrationskonstante C!',
            'Lösung: x⁴/4 + C'
          ],
          hint: 'Erhöhe den Exponenten um 1 und teile durch den neuen Exponenten.'
        },
        {
          id: 'potenz2',
          difficulty: 'Mittel',
          question: '∫ (2x⁵ - 3x² + 7) dx',
          solution: 'x⁶/3 - x³ + 7x + C',
          alternatives: ['(x^6)/3 - x^3 + 7x + C', '(1/3)x^6 - x^3 + 7x + C'],
          steps: [
            'Integriere jeden Term einzeln',
            'Term 1: ∫ 2x⁵ dx = 2 · x⁶/6 = x⁶/3',
            'Term 2: ∫ -3x² dx = -3 · x³/3 = -x³',
            'Term 3: ∫ 7 dx = 7x (Konstanten werden zu x·konstante)',
            'Zusammenfügen: x⁶/3 - x³ + 7x + C'
          ],
          hint: 'Integriere Term für Term. Konstanten bleiben vor dem Integral!'
        },
        {
          id: 'potenz3',
          difficulty: 'Schwer',
          question: '∫₁³ (4x³ - 2x) dx',
          solution: '72',
          alternatives: ['72.0', '72,0'],
          steps: [
            'Schritt 1: Finde die Stammfunktion F(x)',
            '∫ 4x³ dx = 4 · x⁴/4 = x⁴',
            '∫ -2x dx = -2 · x²/2 = -x²',
            'Also: F(x) = x⁴ - x²',
            '',
            'Schritt 2: Berechne F(3) - F(1)',
            'F(3) = 3⁴ - 3² = 81 - 9 = 72',
            'F(1) = 1⁴ - 1² = 1 - 1 = 0',
            '',
            'Schritt 3: Subtrahiere',
            'Ergebnis: F(3) - F(1) = 72 - 0 = 72'
          ],
          hint: 'Bestimmtes Integral: Erst Stammfunktion finden, dann F(obere Grenze) - F(untere Grenze) berechnen!'
        },
        // NEUE AUFGABEN
        {
          id: 'potenz4',
          difficulty: 'Einfach',
          question: '∫ x⁵ dx',
          solution: 'x⁶/6 + C',
          alternatives: ['x^6/6 + C', '(x^6)/6 + C', '(1/6)x^6 + C'],
          steps: [
            'Wende die Potenzregel an: ∫ xⁿ dx = xⁿ⁺¹/(n+1) + C',
            'n = 5',
            'Erhöhe den Exponenten: 5 + 1 = 6',
            'Teile durch 6: x⁶/6',
            'Lösung: x⁶/6 + C'
          ],
          hint: 'Exponent um 1 erhöhen und durch den neuen Exponenten teilen.'
        },
        {
          id: 'potenz5',
          difficulty: 'Mittel',
          question: '∫ (x⁴ + 4x³ - 2x²) dx',
          solution: 'x⁵/5 + x⁴ - 2x³/3 + C',
          alternatives: ['(x^5)/5 + x^4 - (2x^3)/3 + C', '(1/5)x^5 + x^4 - (2/3)x^3 + C'],
          steps: [
            'Integriere jeden Term einzeln',
            '∫ x⁴ dx = x⁵/5',
            '∫ 4x³ dx = 4 · x⁴/4 = x⁴',
            '∫ -2x² dx = -2 · x³/3 = -2x³/3',
            'Zusammen: x⁵/5 + x⁴ - 2x³/3 + C'
          ],
          hint: 'Bearbeite jeden Term mit der Potenzregel separat.'
        },
        {
          id: 'potenz6',
          difficulty: 'Schwer',
          question: '∫₀² (3x² + 2x - 1) dx',
          solution: '10',
          alternatives: ['10.0', '10,0'],
          steps: [
            'Stammfunktion: F(x) = x³ + x² - x',
            'Berechnung:',
            'F(2) = 2³ + 2² - 2 = 8 + 4 - 2 = 10',
            'F(0) = 0³ + 0² - 0 = 0',
            'Ergebnis: F(2) - F(0) = 10 - 0 = 10'
          ],
          hint: 'Erst Stammfunktion bilden, dann Werte einsetzen und subtrahieren.'
        }
      ]
    },
    logarithmus: {
      name: 'Logarithmus',
      formula: '∫ 1/x dx = ln|x| + C',
      color: '#4ecdc4',
      exercises: [
        {
          id: 'log1',
          difficulty: 'Einfach',
          question: '∫ 1/x dx',
          solution: 'ln|x| + C',
          alternatives: ['ln(|x|) + C', 'ln|x|+C'],
          steps: [
            'Dies ist der Spezialfall für n = -1 in der Potenzregel',
            'Die Potenzregel funktioniert NICHT für n = -1',
            'Stattdessen gilt: ∫ 1/x dx = ln|x| + C',
            'Die Betragsstriche sind wichtig! Sie sorgen dafür, dass die Funktion auch für negative x definiert ist',
            'Lösung: ln|x| + C'
          ],
          hint: 'Dies ist eine Standardformel! Die Stammfunktion von 1/x ist ln|x|.'
        },
        {
          id: 'log2',
          difficulty: 'Mittel',
          question: '∫ 5/x dx',
          solution: '5ln|x| + C',
          alternatives: ['5·ln|x| + C', '5*ln|x| + C', 'ln|x|^5 + C'],
          steps: [
            'Konstante Faktoren können vor das Integral gezogen werden',
            '∫ 5/x dx = 5 · ∫ 1/x dx',
            '∫ 1/x dx = ln|x| + C',
            'Multipliziere: 5 · ln|x| + C',
            'Lösung: 5ln|x| + C'
          ],
          hint: 'Ziehe die Konstante 5 vor das Integral!'
        },
        {
          id: 'log3',
          difficulty: 'Schwer',
          question: '∫ (3/x + 2x) dx',
          solution: '3ln|x| + x² + C',
          alternatives: ['3·ln|x| + x^2 + C', '3*ln|x| + x^2 + C'],
          steps: [
            'Integriere beide Terme separat',
            '',
            'Term 1: ∫ 3/x dx',
            '= 3 · ∫ 1/x dx',
            '= 3ln|x|',
            '',
            'Term 2: ∫ 2x dx',
            '= 2 · x²/2',
            '= x²',
            '',
            'Kombiniere: 3ln|x| + x² + C'
          ],
          hint: 'Teile die Summe auf und integriere jeden Term einzeln!'
        },
        // NEUE AUFGABEN
        {
          id: 'log4',
          difficulty: 'Einfach',
          question: '∫ 2/x dx',
          solution: '2ln|x| + C',
          alternatives: ['2·ln|x| + C', '2*ln|x| + C'],
          steps: [
            'Konstante vor das Integral ziehen',
            '∫ 2/x dx = 2 · ∫ 1/x dx',
            '= 2 · ln|x| + C',
            'Lösung: 2ln|x| + C'
          ],
          hint: 'Faktor 2 bleibt vor dem Logarithmus stehen.'
        },
        {
          id: 'log5',
          difficulty: 'Mittel',
          question: '∫ (1/x + x²) dx',
          solution: 'ln|x| + x³/3 + C',
          alternatives: ['ln|x| + (x^3)/3 + C', 'ln|x| + (1/3)x^3 + C'],
          steps: [
            'Zwei Terme getrennt integrieren',
            'Term 1: ∫ 1/x dx = ln|x|',
            'Term 2: ∫ x² dx = x³/3',
            'Zusammen: ln|x| + x³/3 + C'
          ],
          hint: 'Logarithmus und Potenzregel kombinieren!'
        },
        {
          id: 'log6',
          difficulty: 'Schwer',
          question: '∫ (4/x - 3x²) dx',
          solution: '4ln|x| - x³ + C',
          alternatives: ['4·ln|x| - x^3 + C', '4*ln|x| - x^3 + C'],
          steps: [
            'Beide Terme separat integrieren',
            'Term 1: ∫ 4/x dx = 4ln|x|',
            'Term 2: ∫ -3x² dx = -3 · x³/3 = -x³',
            'Zusammen: 4ln|x| - x³ + C'
          ],
          hint: 'Beachte das Minuszeichen beim zweiten Term!'
        }
      ]
    },
    exponential: {
      name: 'Exponentialfunktion',
      formula: '∫ eˣ dx = eˣ + C',
      color: '#f9ca24',
      exercises: [
        {
          id: 'exp1',
          difficulty: 'Einfach',
          question: '∫ eˣ dx',
          solution: 'eˣ + C',
          alternatives: ['e^x + C', 'exp(x) + C'],
          steps: [
            'Die Exponentialfunktion eˣ ist etwas ganz Besonderes!',
            'Sie ist ihre eigene Ableitung: d/dx(eˣ) = eˣ',
            'Und sie ist auch ihre eigene Stammfunktion!',
            '∫ eˣ dx = eˣ + C',
            'Das macht die e-Funktion so wichtig in Mathematik und Naturwissenschaften'
          ],
          hint: 'Die e-Funktion bleibt beim Integrieren unverändert!'
        },
        {
          id: 'exp2',
          difficulty: 'Mittel',
          question: '∫ 4eˣ dx',
          solution: '4eˣ + C',
          alternatives: ['4·e^x + C', '4*e^x + C', '4e^x + C'],
          steps: [
            'Konstante Faktoren bleiben vor dem Integral',
            '∫ 4eˣ dx = 4 · ∫ eˣ dx',
            'Da ∫ eˣ dx = eˣ + C',
            'Erhalten wir: 4 · eˣ + C = 4eˣ + C'
          ],
          hint: 'Ziehe die 4 vor das Integral!'
        },
        {
          id: 'exp3',
          difficulty: 'Schwer',
          question: '∫ (eˣ + 3x²) dx',
          solution: 'eˣ + x³ + C',
          alternatives: ['e^x + x^3 + C', 'exp(x) + x^3 + C'],
          steps: [
            'Integriere beide Terme getrennt',
            '',
            'Term 1: ∫ eˣ dx = eˣ',
            '(Die e-Funktion bleibt gleich)',
            '',
            'Term 2: ∫ 3x² dx',
            '= 3 · x³/3',
            '= x³',
            '',
            'Addiere die Ergebnisse: eˣ + x³ + C'
          ],
          hint: 'Kombiniere zwei Regeln: eˣ und die Potenzregel!'
        },
        // NEUE AUFGABEN
        {
          id: 'exp4',
          difficulty: 'Einfach',
          question: '∫ 3eˣ dx',
          solution: '3eˣ + C',
          alternatives: ['3·e^x + C', '3*e^x + C', '3e^x + C'],
          steps: [
            'Konstante vor das Integral ziehen',
            '∫ 3eˣ dx = 3 · ∫ eˣ dx',
            '= 3eˣ + C'
          ],
          hint: 'Die 3 bleibt als Faktor vor eˣ.'
        },
        {
          id: 'exp5',
          difficulty: 'Mittel',
          question: '∫ (2eˣ - 5x) dx',
          solution: '2eˣ - 5x²/2 + C',
          alternatives: ['2e^x - (5x^2)/2 + C', '2e^x - (5/2)x^2 + C'],
          steps: [
            'Beide Terme getrennt integrieren',
            'Term 1: ∫ 2eˣ dx = 2eˣ',
            'Term 2: ∫ -5x dx = -5 · x²/2 = -5x²/2',
            'Zusammen: 2eˣ - 5x²/2 + C'
          ],
          hint: 'Exponentialfunktion und Potenzregel kombinieren.'
        },
        {
          id: 'exp6',
          difficulty: 'Schwer',
          question: '∫ (eˣ + 2x³ - 1/x) dx',
          solution: 'eˣ + x⁴/2 - ln|x| + C',
          alternatives: ['e^x + (x^4)/2 - ln|x| + C', 'e^x + (1/2)x^4 - ln|x| + C'],
          steps: [
            'Drei Terme einzeln integrieren',
            'Term 1: ∫ eˣ dx = eˣ',
            'Term 2: ∫ 2x³ dx = 2 · x⁴/4 = x⁴/2',
            'Term 3: ∫ -1/x dx = -ln|x|',
            'Zusammen: eˣ + x⁴/2 - ln|x| + C'
          ],
          hint: 'Drei verschiedene Regeln: eˣ, Potenzregel und Logarithmus!'
        }
      ]
    },
    trigonometrie: {
      name: 'Trigonometrie',
      formula: '∫ sin(x) dx = -cos(x) + C; ∫ cos(x) dx = sin(x) + C',
      color: '#e056fd',
      exercises: [
        {
          id: 'trig1',
          difficulty: 'Einfach',
          question: '∫ sin(x) dx',
          solution: '-cos(x) + C',
          alternatives: ['-cos x + C', '-cosx + C'],
          steps: [
            'Denke an die Ableitungen der trigonometrischen Funktionen:',
            'd/dx(cos(x)) = -sin(x)',
            'd/dx(-cos(x)) = sin(x)',
            '',
            'Also ist die Stammfunktion von sin(x) gleich -cos(x)',
            '∫ sin(x) dx = -cos(x) + C',
            '',
            'WICHTIG: Beachte das Minuszeichen! Das wird oft vergessen!'
          ],
          hint: 'Was ist die Ableitung von -cos(x)?'
        },
        {
          id: 'trig2',
          difficulty: 'Mittel',
          question: '∫ cos(x) dx',
          solution: 'sin(x) + C',
          alternatives: ['sin x + C', 'sinx + C'],
          steps: [
            'Die Ableitung von sin(x) ist cos(x)',
            'd/dx(sin(x)) = cos(x)',
            '',
            'Umgekehrt ist die Stammfunktion von cos(x) einfach sin(x)',
            '∫ cos(x) dx = sin(x) + C',
            '',
            'Hier gibt es KEIN Minuszeichen (im Gegensatz zu sin)!'
          ],
          hint: 'Die Stammfunktion von cos ist einfach sin (ohne Minus)!'
        },
        {
          id: 'trig3',
          difficulty: 'Schwer',
          question: '∫ (3sin(x) - 2cos(x)) dx',
          solution: '-3cos(x) - 2sin(x) + C',
          alternatives: ['-3cos x - 2sin x + C', '-3cosx - 2sinx + C'],
          steps: [
            'Integriere beide Terme separat',
            '',
            'Term 1: ∫ 3sin(x) dx',
            '= 3 · ∫ sin(x) dx',
            '= 3 · (-cos(x))',
            '= -3cos(x)',
            '',
            'Term 2: ∫ -2cos(x) dx',
            '= -2 · ∫ cos(x) dx',
            '= -2 · sin(x)',
            '= -2sin(x)',
            '',
            'Kombiniere: -3cos(x) - 2sin(x) + C',
            'Achte genau auf die Vorzeichen!'
          ],
          hint: 'Integriere jeden Term einzeln und achte sorgfältig auf die Vorzeichen!'
        },
        // NEUE AUFGABEN
        {
          id: 'trig4',
          difficulty: 'Einfach',
          question: '∫ 2sin(x) dx',
          solution: '-2cos(x) + C',
          alternatives: ['-2cos x + C', '-2cosx + C'],
          steps: [
            'Konstante vor das Integral',
            '∫ 2sin(x) dx = 2 · ∫ sin(x) dx',
            '= 2 · (-cos(x))',
            '= -2cos(x) + C'
          ],
          hint: 'Faktor 2 vor das Integral, dann wie gewohnt integrieren.'
        },
        {
          id: 'trig5',
          difficulty: 'Mittel',
          question: '∫ (sin(x) + cos(x)) dx',
          solution: '-cos(x) + sin(x) + C',
          alternatives: ['-cos x + sin x + C', '-cosx + sinx + C'],
          steps: [
            'Beide Terme getrennt integrieren',
            'Term 1: ∫ sin(x) dx = -cos(x)',
            'Term 2: ∫ cos(x) dx = sin(x)',
            'Zusammen: -cos(x) + sin(x) + C'
          ],
          hint: 'Integriere sin und cos getrennt und addiere!'
        },
        {
          id: 'trig6',
          difficulty: 'Schwer',
          question: '∫ (4cos(x) + 2sin(x) - x) dx',
          solution: '4sin(x) - 2cos(x) - x²/2 + C',
          alternatives: ['4sin x - 2cos x - (x^2)/2 + C', '4sinx - 2cosx - (x^2)/2 + C'],
          steps: [
            'Drei Terme einzeln integrieren',
            'Term 1: ∫ 4cos(x) dx = 4sin(x)',
            'Term 2: ∫ 2sin(x) dx = 2·(-cos(x)) = -2cos(x)',
            'Term 3: ∫ -x dx = -x²/2',
            'Zusammen: 4sin(x) - 2cos(x) - x²/2 + C'
          ],
          hint: 'Trigonometrie UND Potenzregel kombinieren!'
        }
      ]
    },
    // NEUES KAPITEL: SUBSTITUTION!
    substitution: {
      name: 'Substitution',
      formula: '∫ f(g(x))·g\'(x) dx = F(g(x)) + C',
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
            'Dann: du/dx = 2x, also du = 2x dx',
            '',
            'Das Integral wird zu:',
            '∫ eᵘ du = eᵘ + C',
            '',
            'Rücksubstitution (u = x²):',
            'eˣ² + C'
          ],
          hint: 'Setze u = x². Beachte, dass 2x genau die Ableitung von x² ist!'
        },
        {
          id: 'sub2',
          difficulty: 'Mittel',
          question: '∫ cos(3x) dx',
          solution: 'sin(3x)/3 + C',
          alternatives: ['(1/3)sin(3x) + C', 'sin(3x)/3+C'],
          steps: [
            'Substitution: u = 3x',
            'Dann: du/dx = 3, also dx = du/3',
            '',
            'Das Integral wird zu:',
            '∫ cos(u) · (1/3) du = (1/3)∫ cos(u) du',
            '= (1/3) sin(u) + C',
            '',
            'Rücksubstitution (u = 3x):',
            'sin(3x)/3 + C'
          ],
          hint: 'Substitution u = 3x. Vergiss nicht, dx durch du/3 zu ersetzen!'
        },
        {
          id: 'sub3',
          difficulty: 'Schwer',
          question: '∫ x/(x²+1) dx',
          solution: 'ln|x²+1|/2 + C',
          alternatives: ['(1/2)ln(x^2+1) + C', '0.5ln(x^2+1) + C', 'ln(x²+1)/2 + C'],
          steps: [
            'Substitution: u = x² + 1',
            'Dann: du/dx = 2x, also x dx = du/2',
            '',
            'Das Integral wird zu:',
            '∫ (1/u) · (1/2) du = (1/2) ∫ (1/u) du',
            '= (1/2) ln|u| + C',
            '',
            'Rücksubstitution (u = x² + 1):',
            '(1/2) ln|x² + 1| + C = ln|x²+1|/2 + C',
            '',
            'Hinweis: x²+1 ist immer positiv, Betragsstriche nicht nötig'
          ],
          hint: 'Setze u = x² + 1. Der Zähler x ist fast die Ableitung des Nenners!'
        },
        {
          id: 'sub4',
          difficulty: 'Einfach',
          question: '∫ 3x²·e^(x³) dx',
          solution: 'e^(x³) + C',
          alternatives: ['e^x^3 + C', 'exp(x^3) + C'],
          steps: [
            'Substitution: u = x³',
            'Dann: du/dx = 3x², also du = 3x² dx',
            '',
            'Das Integral wird zu:',
            '∫ eᵘ du = eᵘ + C',
            '',
            'Rücksubstitution:',
            'e^(x³) + C'
          ],
          hint: '3x² ist genau die Ableitung von x³!'
        },
        {
          id: 'sub5',
          difficulty: 'Mittel',
          question: '∫ sin(2x) dx',
          solution: '-cos(2x)/2 + C',
          alternatives: ['-(1/2)cos(2x) + C', '-0.5cos(2x) + C'],
          steps: [
            'Substitution: u = 2x',
            'Dann: du/dx = 2, also dx = du/2',
            '',
            'Das Integral wird zu:',
            '∫ sin(u) · (1/2) du = (1/2) ∫ sin(u) du',
            '= (1/2) · (-cos(u)) + C',
            '= -cos(u)/2 + C',
            '',
            'Rücksubstitution:',
            '-cos(2x)/2 + C'
          ],
          hint: 'u = 2x, dann dx = du/2 einsetzen.'
        },
        {
          id: 'sub6',
          difficulty: 'Schwer',
          question: '∫ x·√(x²+4) dx',
          solution: '(x²+4)^(3/2)/3 + C',
          alternatives: ['(1/3)(x^2+4)^(3/2) + C', '(x^2+4)^(3/2)/3+C'],
          steps: [
            'Substitution: u = x² + 4',
            'Dann: du/dx = 2x, also x dx = du/2',
            '',
            'Das Integral wird zu:',
            '∫ √u · (1/2) du = (1/2) ∫ u^(1/2) du',
            '= (1/2) · u^(3/2) / (3/2) + C',
            '= (1/2) · (2/3) · u^(3/2) + C',
            '= (1/3) u^(3/2) + C',
            '',
            'Rücksubstitution:',
            '(x²+4)^(3/2)/3 + C'
          ],
          hint: 'Setze u = x²+4. Wurzel ist u^(1/2). Mit Potenzregel integrieren!'
        }
      ]
    }
  };

  // Berechne Gesamt-Fortschritt
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

  // Animation für Riemann-Summen
  useEffect(() => {
    if (currentSlide === 2) {
      const interval = setInterval(() => {
        setRectangleCount(prev => {
          if (prev >= 20) return 4;
          return prev + 1;
        });
      }, 500);
      return () => clearInterval(interval);
    }
  }, [currentSlide]);

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

  const checkAnswer = (exerciseId, userAnswer, correctAnswer, alternatives = []) => {
    if (!userAnswer.trim()) return false;
    
    const normalize = (str) => str.toLowerCase().replace(/\s+/g, '').replace(/\*/g, '·');
    const normalizedUser = normalize(userAnswer);
    const normalizedCorrect = normalize(correctAnswer);
    const normalizedAlternatives = alternatives.map(alt => normalize(alt));
    
    const isCorrect = normalizedUser === normalizedCorrect || 
                     normalizedAlternatives.includes(normalizedUser);
    
    // Update checked answers
    setCheckedAnswers(prev => ({
      ...prev,
      [exerciseId]: isCorrect
    }));
    
    // Speichere gelöste Aufgaben
    if (isCorrect) {
      setSolvedExercises(prev => ({
        ...prev,
        [exerciseId]: true
      }));
    }
    
    // Update input history - keep last 3 entries
    setInputHistory(prev => {
      const currentHistory = prev[exerciseId] || [];
      const newHistory = [
        { answer: userAnswer, correct: isCorrect, timestamp: Date.now() },
        ...currentHistory
      ].slice(0, 3);
      
      return {
        ...prev,
        [exerciseId]: newHistory
      };
    });
    
    // Track failed attempts and auto-show hint after 2 failures
    if (!isCorrect) {
      setFailedAttempts(prev => {
        const attempts = (prev[exerciseId] || 0) + 1;
        
        if (attempts >= 2) {
          setShowHints(prevHints => ({
            ...prevHints,
            [exerciseId]: true
          }));
        }
        
        return {
          ...prev,
          [exerciseId]: attempts
        };
      });
    } else {
      setFailedAttempts(prev => ({
        ...prev,
        [exerciseId]: 0
      }));
    }
    
    return isCorrect;
  };

  const ExerciseCard = ({ exercise, ruleColor }) => {
    const [inputValue, setInputValue] = useState('');
    const isChecked = checkedAnswers[exercise.id] !== undefined;
    const isCorrect = checkedAnswers[exercise.id];
    const solutionVisible = showSolution[exercise.id];
    const hintVisible = showHints[exercise.id];
    const attempts = failedAttempts[exercise.id] || 0;
    const history = inputHistory[exercise.id] || [];
    const isSolved = solvedExercises[exercise.id];

    return (
      <div className={`exercise-card ${isSolved ? 'solved' : ''}`}>
        <div className="exercise-header">
          <div className="exercise-header-left">
            <span className={`difficulty difficulty-${exercise.difficulty.toLowerCase()}`}>
              {exercise.difficulty}
            </span>
            {isSolved && (
              <span className="solved-badge">
                <Trophy size={16} />
                Gelöst
              </span>
            )}
          </div>
          {attempts > 0 && !isSolved && (
            <span className="attempts-counter">
              Versuche: {attempts}
            </span>
          )}
        </div>
        
        <div className="exercise-question">
          <div className="question-text">{exercise.question}</div>
          
          <div className="hint-section">
            <button
              className="hint-toggle"
              onClick={() => setShowHints(prev => ({...prev, [exercise.id]: !prev[exercise.id]}))}
              style={{ 
                borderColor: hintVisible ? ruleColor : 'rgba(249, 202, 36, 0.3)',
                color: hintVisible ? ruleColor : 'rgba(249, 202, 36, 0.8)'
              }}
            >
              💡 {hintVisible ? 'Tipp ausblenden' : 'Tipp anzeigen'}
            </button>
            
            {hintVisible && (
              <div className="hint-box" style={{ borderColor: ruleColor }}>
                {exercise.hint}
                {attempts >= 2 && attempts === failedAttempts[exercise.id] && (
                  <div className="auto-hint-notice">
                    (Automatisch angezeigt nach 2 Fehlversuchen)
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
            placeholder="Deine Antwort hier..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                checkAnswer(exercise.id, inputValue, exercise.solution, exercise.alternatives);
              }
            }}
            className={`answer-input ${isChecked ? (isCorrect ? 'correct' : 'incorrect') : ''}`}
          />
          <button
            className="check-button"
            onClick={() => {
              checkAnswer(exercise.id, inputValue, exercise.solution, exercise.alternatives);
            }}
            style={{ borderColor: ruleColor, color: ruleColor }}
          >
            <Check size={20} />
            Prüfen
          </button>
        </div>

        {isChecked && (
          <div className={`feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? (
              <>
                <Check size={24} />
                <span>Richtig! Sehr gut gemacht!</span>
              </>
            ) : (
              <>
                <X size={24} />
                <span>Noch nicht ganz. {attempts < 2 ? 'Versuch es nochmal!' : 'Schau dir den Tipp an!'}</span>
              </>
            )}
          </div>
        )}

        <button
          className="solution-toggle"
          onClick={() => setShowSolution(prev => ({...prev, [exercise.id]: !prev[exercise.id]}))}
        >
          {solutionVisible ? <EyeOff size={18} /> : <Eye size={18} />}
          {solutionVisible ? 'Lösung ausblenden' : 'Lösung anzeigen'}
        </button>

        {solutionVisible && (
          <div className="solution-box">
            <h4>Schritt-für-Schritt-Lösung:</h4>
            {exercise.steps.map((step, idx) => (
              <div key={idx} className={`solution-step ${step === '' ? 'spacer' : ''}`}>
                {step && <><span className="step-number">{idx + 1}.</span> {step}</>}
              </div>
            ))}
            <div className="final-answer" style={{ borderColor: ruleColor }}>
              <strong>Antwort:</strong> {exercise.solution}
            </div>
          </div>
        )}
      </div>
    );
  };

  const slides = [
    {
      title: "Was ist ein Integral?",
      subtitle: "Die fundamentale Idee der Integralrechnung",
      content: (
        <div className="slide-content">
          <div className="concept-box">
            <h3>Die Kernidee</h3>
            <p>
              Stell dir vor, du möchtest die Fläche unter einer Kurve berechnen. 
              Wie würdest du das anpacken?
            </p>
            <div className="idea-flow">
              <div className="step">
                <div className="step-number">1</div>
                <p>Unterteile die Fläche in viele kleine Rechtecke</p>
              </div>
              <div className="arrow">→</div>
              <div className="step">
                <div className="step-number">2</div>
                <p>Addiere alle Rechteckflächen</p>
              </div>
              <div className="arrow">→</div>
              <div className="step">
                <div className="step-number">3</div>
                <p>Mache die Rechtecke unendlich klein</p>
              </div>
            </div>
          </div>
          <div className="visual-representation">
            <div className="integral-symbol">∫</div>
            <p className="symbol-explanation">
              Das Integralsymbol ∫ ist ein langgezogenes "S" für <em>Summa</em> (lateinisch: Summe)
            </p>
          </div>
        </div>
      )
    },
    {
      title: "Die geometrische Bedeutung",
      subtitle: "Fläche unter der Kurve",
      content: (
        <div className="slide-content">
          <div className="formula-box">
            <div className="formula-display">
              ∫<sub>a</sub><sup>b</sup> f(x) dx
            </div>
            <div className="formula-parts">
              <div className="part">
                <span className="highlight-a">a, b</span> = Integrationsgrenzen
              </div>
              <div className="part">
                <span className="highlight-f">f(x)</span> = Funktion (Höhe der Kurve)
              </div>
              <div className="part">
                <span className="highlight-dx">dx</span> = infinitesimal kleine Breite
              </div>
            </div>
          </div>
          <div className="chart-container">
            <AreaChart width={500} height={300} data={generateParabolaData()}>
              <defs>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#ff6b35" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#ff6b35" stopOpacity={0.2}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#444" />
              <XAxis dataKey="x" stroke="#fff" />
              <YAxis stroke="#fff" />
              <Area type="monotone" dataKey="y" stroke="#ff6b35" strokeWidth={3} fill="url(#colorArea)" />
            </AreaChart>
            <p className="chart-label">f(x) = x²  von 0 bis 2</p>
          </div>
        </div>
      )
    },
    {
      title: "Riemann-Summen",
      subtitle: "Die Annäherung durch Rechtecke",
      content: (
        <div className="slide-content">
          <div className="interactive-demo">
            <div className="controls">
              <label>
                Anzahl Rechtecke: <strong>{rectangleCount}</strong>
              </label>
              <input 
                type="range" 
                min="2" 
                max="20" 
                value={rectangleCount} 
                onChange={(e) => setRectangleCount(Number(e.target.value))}
                className="slider"
              />
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
                    fill="#ff6b35"
                    fillOpacity="0.6"
                    stroke="#ff6b35"
                    strokeWidth="2"
                  />
                ))}
              </svg>
            </div>
            <div className="explanation-box">
              <p>
                Je mehr Rechtecke wir verwenden, desto genauer wird unsere Annäherung 
                an die wahre Fläche. Mit unendlich vielen Rechtecken (Grenzwert) erhalten 
                wir das exakte Integral!
              </p>
              <div className="calculation">
                Annäherung mit {rectangleCount} Rechtecken ≈ {
                  generateRectangles(rectangleCount)
                    .reduce((sum, rect) => sum + rect.height * rect.width, 0)
                    .toFixed(3)
                }
                <br />
                <span className="exact-value">Exakter Wert: ∫₀² x² dx = 8/3 ≈ 2.667</span>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Der Hauptsatz",
      subtitle: "Die Verbindung zwischen Ableiten und Integrieren",
      content: (
        <div className="slide-content">
          <div className="theorem-box">
            <h3>Hauptsatz der Differential- und Integralrechnung</h3>
            <div className="theorem-statement">
              Wenn F'(x) = f(x), dann gilt:
              <div className="big-formula">
                ∫<sub>a</sub><sup>b</sup> f(x) dx = F(b) - F(a)
              </div>
            </div>
          </div>
          <div className="insight-box">
            <h4>Was bedeutet das?</h4>
            <p>
              Integrieren ist die <strong>Umkehrung</strong> des Ableitens! 
              Um eine Fläche zu berechnen, musst du nur eine Funktion finden, 
              deren Ableitung deine ursprüngliche Funktion ist (eine "Stammfunktion").
            </p>
            <div className="connection-diagram">
              <div className="function-pair">
                <div className="box">F(x) = x³/3</div>
                <div className="arrow-down">
                  <span>ableiten</span>
                  ↓
                </div>
                <div className="box">f(x) = x²</div>
                <div className="arrow-up">
                  <span>integrieren</span>
                  ↑
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Grundlegende Integrationsregeln",
      subtitle: "Klicke auf eine Regel für Übungsaufgaben!",
      content: (
        <div className="slide-content">
          {!selectedRule ? (
            <>
              <div className="rules-grid">
                {Object.entries(exercises).filter(([key]) => key !== 'substitution').map(([key, rule]) => {
                  const ruleProgress = rule.exercises.filter(ex => solvedExercises[ex.id]).length;
                  const ruleTotal = rule.exercises.length;
                  return (
                    <div 
                      key={key}
                      className="rule-card clickable"
                      onClick={() => setSelectedRule(key)}
                      style={{ borderColor: rule.color }}
                    >
                      <div className="rule-name" style={{ color: rule.color }}>
                        {rule.name}
                      </div>
                      <div className="rule-formula">
                        {rule.formula}
                      </div>
                      <div className="rule-progress">
                        <div className="progress-text">
                          {ruleProgress} / {ruleTotal} Aufgaben gelöst
                        </div>
                        <div className="progress-bar-small">
                          <div 
                            className="progress-fill-small" 
                            style={{ 
                              width: `${(ruleProgress / ruleTotal) * 100}%`,
                              backgroundColor: rule.color
                            }}
                          />
                        </div>
                      </div>
                      <div className="click-hint" style={{ color: rule.color }}>
                        Klicken für {ruleTotal} Übungen →
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="constant-note">
                <strong>Wichtig:</strong> Das "+ C" ist die Integrationskonstante. 
                Da das Ableiten konstante Terme eliminiert, müssen wir sie beim 
                Integrieren wieder hinzufügen!
              </div>
            </>
          ) : (
            <div className="exercises-view">
              <button 
                className="back-button"
                onClick={() => {
                  setSelectedRule(null);
                  setCheckedAnswers({});
                  setShowSolution({});
                  setShowHints({});
                  setFailedAttempts({});
                  setInputHistory({});
                }}
                style={{ borderColor: exercises[selectedRule].color }}
              >
                ← Zurück zu allen Regeln
              </button>
              
              <div className="exercise-header-info">
                <h3 style={{ color: exercises[selectedRule].color }}>
                  {exercises[selectedRule].name}
                </h3>
                <p className="formula-reminder">{exercises[selectedRule].formula}</p>
              </div>

              <div className="exercises-container">
                {exercises[selectedRule].exercises.map((exercise) => (
                  <ExerciseCard 
                    key={exercise.id} 
                    exercise={exercise}
                    ruleColor={exercises[selectedRule].color}
                  />
                ))}
              </div>

              <div className="progress-summary">
                <Award size={24} style={{ color: exercises[selectedRule].color }} />
                <span>
                  {exercises[selectedRule].exercises.filter(ex => solvedExercises[ex.id]).length} von {exercises[selectedRule].exercises.length} Aufgaben gelöst
                </span>
              </div>
            </div>
          )}
        </div>
      )
    },
    // NEUES KAPITEL: SUBSTITUTION
    {
      title: "Substitution",
      subtitle: "Komplexere Integrale vereinfachen",
      content: (
        <div className="slide-content">
          {!selectedRule ? (
            <>
              <div className="substitution-intro">
                <h3>Was ist Substitution?</h3>
                <p>
                  Substitution ist eine mächtige Technik, um komplizierte Integrale zu vereinfachen. 
                  Die Idee: Wir ersetzen einen komplizierten Teil durch eine neue Variable u, 
                  integrieren in u, und setzen dann zurück.
                </p>
              </div>

              <div className="method-box">
                <h4>Die Methode in 4 Schritten:</h4>
                <div className="method-steps">
                  <div className="method-step">
                    <div className="method-number">1</div>
                    <div>
                      <strong>Substitution wählen:</strong> Setze u = g(x) für einen inneren Term
                    </div>
                  </div>
                  <div className="method-step">
                    <div className="method-number">2</div>
                    <div>
                      <strong>Ableiten:</strong> Berechne du/dx = g'(x), also du = g'(x)dx
                    </div>
                  </div>
                  <div className="method-step">
                    <div className="method-number">3</div>
                    <div>
                      <strong>Ersetzen:</strong> Schreibe das Integral in u
                    </div>
                  </div>
                  <div className="method-step">
                    <div className="method-number">4</div>
                    <div>
                      <strong>Rücksubstitution:</strong> Ersetze u wieder durch g(x)
                    </div>
                  </div>
                </div>
              </div>

              <div className="example-box">
                <h4>Beispiel: ∫ 2x · e^(x²) dx</h4>
                <div className="example-solution">
                  <p><strong>Schritt 1:</strong> Setze u = x² (der Exponent)</p>
                  <p><strong>Schritt 2:</strong> du/dx = 2x, also du = 2x dx</p>
                  <p><strong>Schritt 3:</strong> ∫ e^u du = e^u + C</p>
                  <p><strong>Schritt 4:</strong> e^(x²) + C</p>
                </div>
              </div>

              <div className="rule-card clickable substitution-card" 
                   onClick={() => setSelectedRule('substitution')}
                   style={{ borderColor: exercises.substitution.color }}>
                <div className="rule-name" style={{ color: exercises.substitution.color }}>
                  {exercises.substitution.name}
                </div>
                <div className="rule-formula">
                  {exercises.substitution.formula}
                </div>
                <div className="rule-progress">
                  <div className="progress-text">
                    {exercises.substitution.exercises.filter(ex => solvedExercises[ex.id]).length} / {exercises.substitution.exercises.length} Aufgaben gelöst
                  </div>
                  <div className="progress-bar-small">
                    <div 
                      className="progress-fill-small" 
                      style={{ 
                        width: `${(exercises.substitution.exercises.filter(ex => solvedExercises[ex.id]).length / exercises.substitution.exercises.length) * 100}%`,
                        backgroundColor: exercises.substitution.color
                      }}
                    />
                  </div>
                </div>
                <div className="click-hint" style={{ color: exercises.substitution.color }}>
                  Klicken für {exercises.substitution.exercises.length} Übungen →
                </div>
              </div>
            </>
          ) : (
            <div className="exercises-view">
              <button 
                className="back-button"
                onClick={() => {
                  setSelectedRule(null);
                  setCheckedAnswers({});
                  setShowSolution({});
                  setShowHints({});
                  setFailedAttempts({});
                  setInputHistory({});
                }}
                style={{ borderColor: exercises[selectedRule].color }}
              >
                ← Zurück zur Erklärung
              </button>
              
              <div className="exercise-header-info">
                <h3 style={{ color: exercises[selectedRule].color }}>
                  {exercises[selectedRule].name}
                </h3>
                <p className="formula-reminder">{exercises[selectedRule].formula}</p>
              </div>

              <div className="exercises-container">
                {exercises[selectedRule].exercises.map((exercise) => (
                  <ExerciseCard 
                    key={exercise.id} 
                    exercise={exercise}
                    ruleColor={exercises[selectedRule].color}
                  />
                ))}
              </div>

              <div className="progress-summary">
                <Award size={24} style={{ color: exercises[selectedRule].color }} />
                <span>
                  {exercises[selectedRule].exercises.filter(ex => solvedExercises[ex.id]).length} von {exercises[selectedRule].exercises.length} Aufgaben gelöst
                </span>
              </div>
            </div>
          )}
        </div>
      )
    },
    {
      title: "Anwendungen in der Biologie",
      subtitle: "Integrale in deinem Studium",
      content: (
        <div className="slide-content">
          <div className="applications-grid">
            <div className="app-card">
              <div className="app-icon">📈</div>
              <h4>Populationswachstum</h4>
              <p>
                Wenn du die Wachstumsrate r(t) kennst, erhältst du die 
                Gesamtpopulation durch Integration: P(t) = ∫ r(t) dt
              </p>
            </div>
            
            <div className="app-card">
              <div className="app-icon">⚗️</div>
              <h4>Stoffwechselraten</h4>
              <p>
                Die Gesamtmenge eines produzierten Stoffes über Zeit ist das 
                Integral der Produktionsrate.
              </p>
            </div>
            
            <div className="app-card">
              <div className="app-icon">🧬</div>
              <h4>Diffusionsprozesse</h4>
              <p>
                Konzentrationsgradient über eine Membran? Integration liefert 
                die Gesamtmenge diffundierter Moleküle.
              </p>
            </div>
            
            <div className="app-card">
              <div className="app-icon">🔬</div>
              <h4>Enzymkinetik</h4>
              <p>
                Die Michaelis-Menten-Gleichung wird oft integriert, um die 
                Substratkonzentration über Zeit zu bestimmen.
              </p>
            </div>
          </div>
          
          <div className="bio-example">
            <h4>Konkretes Beispiel: Bakterienwachstum</h4>
            <p>
              Eine Bakterienkultur wächst mit der Rate r(t) = 100e<sup>0.3t</sup> Zellen/Stunde.
              Wie viele Bakterien wurden zwischen t=0 und t=5 Stunden neu produziert?
            </p>
            <div className="solution">
              ∫₀⁵ 100e<sup>0.3t</sup> dt = [100/0.3 · e<sup>0.3t</sup>]₀⁵ 
              = 333.33(e<sup>1.5</sup> - 1) ≈ 1161 Zellen
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Zusammenfassung",
      subtitle: "Die wichtigsten Punkte",
      content: (
        <div className="slide-content">
          <div className="summary-box">
            <h3>Was du jetzt über Integrale weißt:</h3>
            <div className="summary-points">
              <div className="point">
                <span className="number">1</span>
                <div>
                  <strong>Geometrische Bedeutung:</strong> Integrale berechnen Flächen unter Kurven 
                  durch unendlich viele infinitesimal kleine Rechtecke.
                </div>
              </div>
              
              <div className="point">
                <span className="number">2</span>
                <div>
                  <strong>Hauptsatz:</strong> Integrieren ist die Umkehrung des Ableitens. 
                  Finde eine Stammfunktion F(x) und berechne F(b) - F(a).
                </div>
              </div>
              
              <div className="point">
                <span className="number">3</span>
                <div>
                  <strong>Grundregeln:</strong> Potenzregel, Logarithmus, e-Funktion, 
                  und trigonometrische Funktionen sind deine wichtigsten Werkzeuge.
                </div>
              </div>
              
              <div className="point">
                <span className="number">4</span>
                <div>
                  <strong>Substitution:</strong> Eine mächtige Technik für komplexere Integrale - 
                  ersetze komplizierte Terme durch neue Variablen.
                </div>
              </div>
              
              <div className="point">
                <span className="number">5</span>
                <div>
                  <strong>Anwendungen:</strong> Von Populationsdynamik über Stoffwechsel 
                  bis hin zu Diffusion – Integrale sind überall in der Biologie!
                </div>
              </div>
            </div>
          </div>
          
          <div className="next-steps">
            <h4>Weiter üben!</h4>
            <p>
              Du hast jetzt {progress.solved} von {progress.total} Aufgaben gelöst ({progress.percentage}%)! 
              Der beste Weg, Integrale zu meistern, ist kontinuierliches Üben. Gehe zurück zu den 
              Kapiteln und arbeite durch alle Übungsaufgaben. Mit der Zeit entwickelst du ein 
              Gefühl dafür, welche Technik du wann anwenden musst. Viel Erfolg!
            </p>
          </div>
        </div>
      )
    }
  ];

  const nextSlide = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
      setSelectedRule(null);
      setCheckedAnswers({});
      setShowSolution({});
      setShowHints({});
      setFailedAttempts({});
      setInputHistory({});
    }
  };

  const prevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
      setSelectedRule(null);
      setCheckedAnswers({});
      setShowSolution({});
      setShowHints({});
      setFailedAttempts({});
      setInputHistory({});
    }
  };

  return (
    <div className="tutorial-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Bitter:wght@300;400;600;700&display=swap');
        
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        .tutorial-container {
          min-height: 100vh;
          background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
          color: #fff;
          font-family: 'Bitter', serif;
          position: relative;
          overflow: hidden;
          padding-bottom: 100px;
        }
        
        .tutorial-container::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: 
            radial-gradient(circle at 20% 50%, rgba(255, 107, 53, 0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 80%, rgba(78, 205, 196, 0.1) 0%, transparent 50%);
          pointer-events: none;
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
          background-clip: text;
          font-family: 'Space Mono', monospace;
        }
        
        .header p {
          font-size: 1.1rem;
          color: rgba(255, 255, 255, 0.7);
        }

        /* PROGRESS INDICATOR IM HEADER */
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

        .progress-icon {
          color: #4ecdc4;
        }

        .progress-info {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .progress-label {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.6);
          font-family: 'Space Mono', monospace;
        }

        .progress-stats {
          font-size: 1.1rem;
          font-weight: 700;
          color: #4ecdc4;
          font-family: 'Space Mono', monospace;
        }

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
        
        .slide-header {
          text-align: center;
          margin-bottom: 3rem;
          animation: slideIn 0.6s ease-out;
        }
        
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
        
        .slide-content {
          animation: fadeIn 0.8s ease-out 0.2s both;
        }
        
        .concept-box, .formula-box, .theorem-box {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(78, 205, 196, 0.3);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
          backdrop-filter: blur(10px);
        }
        
        .concept-box h3, .formula-box h3, .theorem-box h3 {
          color: #4ecdc4;
          margin-bottom: 1rem;
          font-size: 1.5rem;
          font-family: 'Space Mono', monospace;
        }
        
        .idea-flow {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 2rem;
          flex-wrap: wrap;
          gap: 1rem;
        }
        
        .step {
          flex: 1;
          min-width: 200px;
          text-align: center;
          padding: 1.5rem;
          background: rgba(255, 107, 53, 0.1);
          border: 2px solid rgba(255, 107, 53, 0.3);
          border-radius: 12px;
          transition: transform 0.3s ease;
        }
        
        .step:hover {
          transform: translateY(-5px);
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
          font-family: 'Space Mono', monospace;
        }
        
        .arrow {
          font-size: 2rem;
          color: #4ecdc4;
          font-weight: 700;
        }
        
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
          text-shadow: 0 0 30px rgba(255, 107, 53, 0.5);
        }
        
        .symbol-explanation {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
        }
        
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
        
        .highlight-a { color: #ff6b35; font-weight: 700; }
        .highlight-f { color: #4ecdc4; font-weight: 700; }
        .highlight-dx { color: #f9ca24; font-weight: 700; }
        
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
        
        .controls {
          margin-bottom: 2rem;
          text-align: center;
        }
        
        .controls label {
          display: block;
          margin-bottom: 1rem;
          font-size: 1.2rem;
        }
        
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
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #ff6b35;
          cursor: pointer;
          box-shadow: 0 0 10px rgba(255, 107, 53, 0.5);
        }
        
        .slider::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: #ff6b35;
          cursor: pointer;
          border: none;
        }
        
        .rectangle-visualization {
          display: flex;
          justify-content: center;
          margin: 2rem 0;
        }
        
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
        
        .exact-value {
          color: #4ecdc4;
          font-weight: 700;
        }
        
        .theorem-statement {
          text-align: center;
          padding: 2rem;
        }
        
        .big-formula {
          font-size: 2.5rem;
          color: #ff6b35;
          margin: 2rem 0;
          font-family: 'Space Mono', monospace;
        }
        
        .insight-box {
          background: rgba(255, 107, 53, 0.1);
          border: 2px solid rgba(255, 107, 53, 0.3);
          border-radius: 16px;
          padding: 2rem;
        }
        
        .insight-box h4 {
          color: #ff6b35;
          margin-bottom: 1rem;
          font-size: 1.4rem;
        }
        
        .connection-diagram {
          display: flex;
          justify-content: center;
          margin-top: 2rem;
        }
        
        .function-pair {
          text-align: center;
        }
        
        .function-pair .box {
          background: rgba(0, 0, 0, 0.4);
          padding: 1.5rem 2rem;
          border-radius: 12px;
          border: 2px solid #4ecdc4;
          font-size: 1.3rem;
          font-family: 'Space Mono', monospace;
          margin: 1rem 0;
        }
        
        .arrow-down, .arrow-up {
          font-size: 1.5rem;
          color: #4ecdc4;
          margin: 0.5rem 0;
          font-weight: 700;
        }
        
        .arrow-down span, .arrow-up span {
          font-size: 0.9rem;
          margin-left: 1rem;
          color: rgba(255, 255, 255, 0.6);
        }

        /* SUBSTITUTION INTRO STYLES */
        .substitution-intro {
          background: rgba(155, 89, 182, 0.1);
          border: 2px solid rgba(155, 89, 182, 0.3);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .substitution-intro h3 {
          color: #9b59b6;
          margin-bottom: 1rem;
          font-size: 1.5rem;
        }

        .method-box {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(155, 89, 182, 0.3);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .method-box h4 {
          color: #9b59b6;
          margin-bottom: 1.5rem;
          font-size: 1.3rem;
        }

        .method-steps {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .method-step {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
          padding: 1rem;
          background: rgba(155, 89, 182, 0.1);
          border-radius: 8px;
          border-left: 4px solid #9b59b6;
        }

        .method-number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 36px;
          height: 36px;
          background: #9b59b6;
          color: #fff;
          border-radius: 50%;
          font-weight: 700;
          font-family: 'Space Mono', monospace;
          flex-shrink: 0;
        }

        .example-box {
          background: rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(155, 89, 182, 0.3);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
        }

        .example-box h4 {
          color: #9b59b6;
          margin-bottom: 1rem;
          font-size: 1.3rem;
          font-family: 'Space Mono', monospace;
        }

        .example-solution {
          margin-top: 1rem;
        }

        .example-solution p {
          padding: 0.5rem;
          margin-bottom: 0.5rem;
          background: rgba(155, 89, 182, 0.1);
          border-radius: 6px;
        }

        .substitution-card {
          margin-top: 2rem;
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
          transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
        }
        
        .rule-card.clickable {
          cursor: pointer;
        }
        
        .rule-card.clickable:hover {
          transform: translateY(-5px) scale(1.02);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        }
        
        .rule-name {
          color: #ff6b35;
          font-weight: 700;
          font-size: 1.2rem;
          margin-bottom: 1rem;
          font-family: 'Space Mono', monospace;
        }
        
        .rule-formula {
          font-size: 1.1rem;
          margin-bottom: 1rem;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 8px;
          font-family: 'Space Mono', monospace;
          color: #4ecdc4;
        }

        .rule-progress {
          margin: 1rem 0;
        }

        .progress-text {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 0.5rem;
          font-family: 'Space Mono', monospace;
        }

        .progress-bar-small {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 3px;
          overflow: hidden;
        }

        .progress-fill-small {
          height: 100%;
          transition: width 0.5s ease;
          border-radius: 3px;
        }
        
        .click-hint {
          font-size: 0.9rem;
          margin-top: 1rem;
          font-weight: 600;
          animation: pulse 2s ease-in-out infinite;
        }
        
        @keyframes pulse {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
        
        .constant-note {
          background: rgba(249, 202, 36, 0.1);
          border-left: 4px solid #f9ca24;
          padding: 1.5rem;
          border-radius: 8px;
          font-size: 1.1rem;
        }
        
        /* Exercise Styles */
        .exercises-view {
          animation: fadeIn 0.5s ease-out;
        }
        
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
        
        .back-button:hover {
          transform: translateX(-5px);
          background: rgba(255, 255, 255, 0.1);
        }
        
        .exercise-header-info {
          text-align: center;
          margin-bottom: 2rem;
        }
        
        .exercise-header-info h3 {
          font-size: 2rem;
          margin-bottom: 0.5rem;
          font-family: 'Space Mono', monospace;
        }
        
        .formula-reminder {
          font-size: 1.2rem;
          color: rgba(255, 255, 255, 0.7);
          font-family: 'Space Mono', monospace;
        }
        
        .exercises-container {
          display: flex;
          flex-direction: column;
          gap: 2rem;
          margin-bottom: 2rem;
        }
        
        .exercise-card {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.1);
          border-radius: 16px;
          padding: 2rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
        }

        .exercise-card.solved {
          border-color: rgba(78, 205, 196, 0.5);
          background: rgba(78, 205, 196, 0.05);
        }

        .exercise-card.solved::before {
          content: '';
          position: absolute;
          top: -2px;
          left: -2px;
          right: -2px;
          bottom: -2px;
          background: linear-gradient(135deg, rgba(78, 205, 196, 0.3), rgba(255, 107, 53, 0.3));
          border-radius: 16px;
          z-index: -1;
          opacity: 0.5;
        }
        
        .exercise-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 8px 25px rgba(0, 0, 0, 0.3);
        }
        
        .exercise-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }

        .exercise-header-left {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

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
          font-family: 'Space Mono', monospace;
        }
        
        .difficulty {
          padding: 0.5rem 1rem;
          border-radius: 20px;
          font-size: 0.9rem;
          font-weight: 700;
          font-family: 'Space Mono', monospace;
        }
        
        .attempts-counter {
          padding: 0.5rem 1rem;
          background: rgba(255, 107, 53, 0.2);
          border: 1px solid rgba(255, 107, 53, 0.5);
          border-radius: 20px;
          font-size: 0.85rem;
          font-weight: 600;
          color: #ff6b35;
          font-family: 'Space Mono', monospace;
        }
        
        .difficulty-einfach {
          background: rgba(78, 205, 196, 0.2);
          color: #4ecdc4;
          border: 1px solid #4ecdc4;
        }
        
        .difficulty-mittel {
          background: rgba(249, 202, 36, 0.2);
          color: #f9ca24;
          border: 1px solid #f9ca24;
        }
        
        .difficulty-schwer {
          background: rgba(255, 107, 53, 0.2);
          color: #ff6b35;
          border: 1px solid #ff6b35;
        }
        
        .exercise-question {
          margin-bottom: 1.5rem;
        }
        
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
        
        .hint-section {
          margin-top: 1rem;
        }
        
        .hint-toggle {
          display: inline-flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 1rem;
          background: rgba(249, 202, 36, 0.1);
          border: 2px solid;
          border-radius: 8px;
          font-family: 'Bitter', serif;
          font-size: 0.95rem;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 0.75rem;
        }
        
        .hint-toggle:hover {
          background: rgba(249, 202, 36, 0.2);
          transform: translateY(-2px);
        }
        
        .hint-box {
          background: rgba(249, 202, 36, 0.1);
          border-left: 4px solid;
          padding: 1rem;
          border-radius: 4px;
          font-size: 0.95rem;
          color: rgba(255, 255, 255, 0.9);
          animation: fadeIn 0.3s ease-out;
        }
        
        .auto-hint-notice {
          margin-top: 0.5rem;
          font-size: 0.85rem;
          color: rgba(249, 202, 36, 0.7);
          font-style: italic;
        }
        
        .input-history {
          margin: 1.5rem 0;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.2);
          border-radius: 8px;
          border: 2px solid rgba(255, 255, 255, 0.1);
        }
        
        .history-title {
          font-size: 0.9rem;
          color: rgba(255, 255, 255, 0.6);
          margin-bottom: 0.75rem;
          font-family: 'Space Mono', monospace;
          font-weight: 600;
        }
        
        .history-entry {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 0.75rem;
          margin-bottom: 0.5rem;
          border-radius: 6px;
          font-family: 'Space Mono', monospace;
          font-size: 0.95rem;
          transition: transform 0.2s ease;
        }
        
        .history-entry:last-child {
          margin-bottom: 0;
        }
        
        .history-entry:hover {
          transform: translateX(3px);
        }
        
        .history-correct {
          background: rgba(78, 205, 196, 0.15);
          border-left: 3px solid #4ecdc4;
        }
        
        .history-incorrect {
          background: rgba(255, 107, 53, 0.15);
          border-left: 3px solid #ff6b35;
        }
        
        .history-number {
          font-weight: 700;
          color: rgba(255, 255, 255, 0.5);
          min-width: 20px;
        }
        
        .history-answer {
          flex: 1;
          color: rgba(255, 255, 255, 0.9);
        }
        
        .history-icon {
          font-size: 1.1rem;
          font-weight: 700;
        }
        
        .history-correct .history-icon {
          color: #4ecdc4;
        }
        
        .history-incorrect .history-icon {
          color: #ff6b35;
        }
        
        .answer-section {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }
        
        .answer-input {
          flex: 1;
          padding: 1rem;
          background: rgba(0, 0, 0, 0.3);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: #fff;
          font-size: 1.1rem;
          font-family: 'Space Mono', monospace;
          transition: border-color 0.3s ease;
        }
        
        .answer-input:focus {
          outline: none;
          border-color: #4ecdc4;
        }
        
        .answer-input.correct {
          border-color: #4ecdc4;
          background: rgba(78, 205, 196, 0.1);
        }
        
        .answer-input.incorrect {
          border-color: #ff6b35;
          background: rgba(255, 107, 53, 0.1);
        }
        
        .check-button {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 1rem 2rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid;
          border-radius: 8px;
          font-family: 'Space Mono', monospace;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .check-button:hover {
          background: rgba(255, 255, 255, 0.1);
          transform: scale(1.05);
        }
        
        .feedback {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1rem;
          border-radius: 8px;
          margin-bottom: 1rem;
          font-weight: 600;
          animation: slideIn 0.3s ease-out;
        }
        
        .feedback.correct {
          background: rgba(78, 205, 196, 0.2);
          border: 2px solid #4ecdc4;
          color: #4ecdc4;
        }
        
        .feedback.incorrect {
          background: rgba(255, 107, 53, 0.2);
          border: 2px solid #ff6b35;
          color: #ff6b35;
        }
        
        .solution-toggle {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 255, 255, 0.2);
          border-radius: 8px;
          color: #fff;
          font-family: 'Bitter', serif;
          cursor: pointer;
          transition: all 0.3s ease;
          width: 100%;
          justify-content: center;
        }
        
        .solution-toggle:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        
        .solution-box {
          margin-top: 1.5rem;
          padding: 1.5rem;
          background: rgba(0, 0, 0, 0.4);
          border-radius: 12px;
          border: 2px solid rgba(78, 205, 196, 0.3);
          animation: fadeIn 0.4s ease-out;
        }
        
        .solution-box h4 {
          color: #4ecdc4;
          margin-bottom: 1rem;
          font-family: 'Space Mono', monospace;
        }
        
        .solution-step {
          padding: 0.75rem;
          margin-bottom: 0.5rem;
          background: rgba(255, 255, 255, 0.03);
          border-radius: 6px;
          display: flex;
          gap: 0.75rem;
        }
        
        .solution-step.spacer {
          background: transparent;
          height: 0.5rem;
          padding: 0;
        }
        
        .step-number {
          color: #ff6b35;
          font-weight: 700;
          font-family: 'Space Mono', monospace;
          flex-shrink: 0;
        }
        
        .final-answer {
          margin-top: 1.5rem;
          padding: 1.5rem;
          background: rgba(78, 205, 196, 0.1);
          border-left: 4px solid;
          border-radius: 8px;
          font-size: 1.2rem;
          font-family: 'Space Mono', monospace;
        }
        
        .progress-summary {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 1rem;
          padding: 1.5rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 12px;
          border: 2px solid rgba(255, 255, 255, 0.1);
          font-size: 1.2rem;
          font-weight: 600;
        }
        
        /* Applications Section */
        .applications-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }
        
        .app-card {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(255, 107, 53, 0.3);
          border-radius: 12px;
          padding: 2rem;
          text-align: center;
          transition: transform 0.3s ease, border-color 0.3s ease;
        }
        
        .app-card:hover {
          transform: translateY(-5px);
          border-color: #ff6b35;
        }
        
        .app-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }
        
        .app-card h4 {
          color: #4ecdc4;
          margin-bottom: 1rem;
          font-size: 1.3rem;
        }
        
        .bio-example {
          background: rgba(78, 205, 196, 0.1);
          border: 2px solid #4ecdc4;
          border-radius: 16px;
          padding: 2rem;
          margin-top: 2rem;
        }
        
        .bio-example h4 {
          color: #4ecdc4;
          margin-bottom: 1rem;
          font-size: 1.4rem;
        }
        
        .solution {
          background: rgba(0, 0, 0, 0.4);
          padding: 1.5rem;
          border-radius: 8px;
          margin-top: 1rem;
          font-family: 'Space Mono', monospace;
          font-size: 1.1rem;
          border-left: 4px solid #ff6b35;
        }
        
        .summary-box {
          background: rgba(255, 255, 255, 0.05);
          border: 2px solid rgba(78, 205, 196, 0.3);
          border-radius: 16px;
          padding: 2rem;
          margin-bottom: 2rem;
        }
        
        .summary-box h3 {
          color: #4ecdc4;
          margin-bottom: 2rem;
          font-size: 1.8rem;
          text-align: center;
        }
        
        .summary-points {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }
        
        .point {
          display: flex;
          align-items: flex-start;
          gap: 1.5rem;
          padding: 1.5rem;
          background: rgba(0, 0, 0, 0.3);
          border-radius: 12px;
          border-left: 4px solid #ff6b35;
        }
        
        .point .number {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 50px;
          height: 50px;
          background: #ff6b35;
          color: #1a1a2e;
          border-radius: 50%;
          font-weight: 700;
          font-size: 1.5rem;
          font-family: 'Space Mono', monospace;
          flex-shrink: 0;
        }
        
        .next-steps {
          background: rgba(255, 107, 53, 0.1);
          border: 2px solid rgba(255, 107, 53, 0.3);
          border-radius: 16px;
          padding: 2rem;
        }
        
        .next-steps h4 {
          color: #ff6b35;
          margin-bottom: 1rem;
          font-size: 1.4rem;
        }
        
        .navigation {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(10px);
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
          font-family: 'Space Mono', monospace;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        
        .nav-button:hover:not(:disabled) {
          background: #4ecdc4;
          color: #1a1a2e;
          transform: translateY(-2px);
        }
        
        .nav-button:disabled {
          opacity: 0.3;
          cursor: not-allowed;
        }
        
        .progress-indicator {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }
        
        .progress-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.2);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        
        .progress-dot.active {
          background: #ff6b35;
          width: 16px;
          height: 16px;
          box-shadow: 0 0 10px rgba(255, 107, 53, 0.5);
        }
        
        .progress-text {
          font-family: 'Space Mono', monospace;
          color: rgba(255, 255, 255, 0.7);
          margin-left: 1rem;
        }
        
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @media (max-width: 768px) {
          .header h1 {
            font-size: 1.8rem;
          }

          .global-progress {
            position: static;
            margin-top: 1rem;
            justify-content: center;
          }
          
          .slide-title {
            font-size: 1.8rem;
          }
          
          .idea-flow {
            flex-direction: column;
          }
          
          .arrow {
            transform: rotate(90deg);
          }
          
          .rules-grid, .applications-grid {
            grid-template-columns: 1fr;
          }
          
          .navigation {
            flex-wrap: wrap;
            gap: 1rem;
          }
          
          .answer-section {
            flex-direction: column;
          }
        }
      `}</style>
      
      <div className="header">
        <h1>Integrale Meistern</h1>
        <p>Ein interaktives Tutorial zur Integralrechnung mit Übungen</p>
        
        {/* GLOBALER FORTSCHRITT */}
        <div className="global-progress">
          <TrendingUp size={24} className="progress-icon" />
          <div className="progress-info">
            <div className="progress-label">Dein Fortschritt</div>
            <div className="progress-stats">{progress.solved} / {progress.total}</div>
          </div>
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress.percentage}%` }}
            />
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
              onClick={() => {
                setCurrentSlide(index);
                setSelectedRule(null);
                setCheckedAnswers({});
                setShowSolution({});
                setShowHints({});
                setFailedAttempts({});
                setInputHistory({});
              }}
            />
          ))}
          <span className="progress-text">
            {currentSlide + 1} / {slides.length}
          </span>
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