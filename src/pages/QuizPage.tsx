import { useState } from 'react';
import { Brain, Check, X, Trophy, Medal, Award, BookOpen, RotateCcw } from 'lucide-react';
import { SectionHeader } from '../components/ui/SectionHeader';
import { BookmarkButton } from '../components/ui/BookmarkButton';
import { QUIZ_QUESTIONS } from '../data/quiz';
import styles from './QuizPage.module.css';

interface AnswerRecord {
  correct: boolean;
  selected: number;
}

export default function QuizPage() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [answers, setAnswers] = useState<AnswerRecord[]>([]);

  const q = QUIZ_QUESTIONS[current];

  function pick(idx: number) {
    if (selected !== null) return;
    setSelected(idx);
    const correct = idx === q.answer;
    if (correct) setScore((s) => s + 1);
    setAnswers((a) => [...a, { correct, selected: idx }]);
  }

  function next() {
    if (current + 1 >= QUIZ_QUESTIONS.length) {
      setFinished(true);
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
    }
  }

  function restart() {
    setCurrent(0);
    setSelected(null);
    setScore(0);
    setFinished(false);
    setAnswers([]);
  }

  const pct = Math.round((score / QUIZ_QUESTIONS.length) * 100);
  const gradeLabel =
    pct >= 90
      ? 'F1 Expert'
      : pct >= 70
      ? 'Solid Fan'
      : pct >= 50
      ? 'Getting There'
      : 'Keep Learning';

  const GradeIcon =
    pct >= 90 ? Trophy : pct >= 70 ? Medal : pct >= 50 ? Award : BookOpen;

  if (finished) {
    return (
      <div className={styles.page}>
        <div className={styles.sectionHeader}>
          <SectionHeader
            title="F1"
            accent="Quiz"
            group="Learn the Basics"
            icon={Brain}
          />
          <BookmarkButton sectionId="quiz" />
        </div>

        <div className={styles.resultsCard}>
          <div className={styles.gradeIcon} aria-hidden="true">
            <GradeIcon size={40} />
          </div>
          <div className={styles.gradeText}>{gradeLabel}</div>
          <div className={styles.scoreValue}>
            {score} / {QUIZ_QUESTIONS.length}
          </div>
          <div className={styles.scorePct}>{pct}% correct</div>
          <button onClick={restart} className={styles.primaryBtn}>
            <RotateCcw size={16} />
            TRY AGAIN
          </button>
        </div>

        <div className={styles.reviewGrid}>
          {QUIZ_QUESTIONS.map((question, i) => (
            <div
              key={i}
              className={styles.reviewCard}
              data-correct={answers[i]?.correct}
            >
              <div className={styles.reviewStatus}>
                {answers[i]?.correct ? (
                  <>
                    <Check size={12} /> CORRECT
                  </>
                ) : (
                  <>
                    <X size={12} /> WRONG
                  </>
                )}
              </div>
              <div className={styles.reviewQuestion}>{question.q}</div>
              {!answers[i]?.correct && (
                <div className={styles.reviewAnswer}>
                  <Check size={12} />
                  {question.options[question.answer]}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.sectionHeader}>
        <SectionHeader
          title="F1"
          accent="Quiz"
          group="Learn the Basics"
          icon={Brain}
        />
        <BookmarkButton sectionId="quiz" />
      </div>

      <div className={styles.progressInfo}>
        <span>
          Question {current + 1} of {QUIZ_QUESTIONS.length}
        </span>
        <span className={styles.scorePts}>{score} pts</span>
      </div>

      <div className={styles.progressBar} aria-label="Quiz progress">
        <div
          className={styles.progressFill}
          style={{
            width: `${(current / QUIZ_QUESTIONS.length) * 100}%`,
          }}
          aria-hidden="true"
        />
      </div>

      <div className={styles.questionCard}>
        <div className={styles.questionLabel}>
          QUESTION {current + 1}
        </div>
        <div className={styles.questionText}>{q.q}</div>

        {q.options.map((opt, i) => (
          <button
            key={i}
            disabled={selected !== null}
            onClick={() => pick(i)}
            className={[
              styles.option,
              selected !== null
                ? i === q.answer
                  ? styles.optionCorrect
                  : i === selected
                  ? styles.optionWrong
                  : ''
                : '',
            ].join(' ')}
            aria-label={opt}
          >
            <span className={styles.optionLetter} aria-hidden="true">
              {String.fromCharCode(65 + i)}
            </span>
            {opt}
          </button>
        ))}

        {selected !== null && (
          <div className={styles.explanationBox}>
            <div className={styles.explanationLabel}>EXPLANATION</div>
            <p className={styles.explanationText}>{q.exp}</p>
            <button onClick={next} className={styles.primaryBtn}>
              {current + 1 >= QUIZ_QUESTIONS.length
                ? 'SEE RESULTS'
                : 'NEXT'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
