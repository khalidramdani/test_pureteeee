
"use client";
import styles from "./page.module.css";
import { useState } from "react";
import { supabase } from "@/lib/supabase";

const questions = [
  {
    question: "Est-ce que tu as déjà léché les pieds d'Hady ?",
    reponses: ["Oui", "Non"],
  },
  {
    question: "Est-ce que tu as déjà demandé à Nassim de te faire un virement ?",
    reponses: ["Oui", "Non"],
  },
  {
    question: "Est-ce que tu t'es déjà excusé(e) seulement dans le but de ne pas te faire ban ?",
    reponses: ["Oui", "Non"],
  },
  {
    question: "Est-ce que tu as déjà songé à aider Perrine à sortir sans que son père le sache ?",
    reponses: ["Oui", "Non"],
  },
  {
    question: "Es-tu jaloux(se) de la relation entre Nassim et Meissa ?",
    reponses: ["Oui", "Non"],
  },
  {
    question: "Est-ce que tu penses que Célia est aussi folle qu'elle le pense ?",
    reponses: ["Oui", "Non"],
  },
  {
    question: "As-tu déjà eu des envies de meurtre envers Khalid suite à ses mutes abusifs ?",
    reponses: ["Oui", "Non"],
  },
  {
    question: "Penses-tu que Lyrem est une IMMENSE bdh ?",
    reponses: ["Oui", "Non"],
  },
  {
    question: "Est-ce que tu aurais pu sortir avec Mehdi s'il avait été en France ? (Perrine t'es visée)",
    reponses: ["Oui", "Non"],
  },
  {
    question: "Pour toi, ce qu'il se passe entre Hady et Manoé est-il sérieux ?",
    reponses: ["Oui", "Non"],
  },
  {
    question: "Nassim a-t-il déjà eu une relation avec Manoé avant Hady ? (force Hady)",
    reponses: ["Oui", "Non"],
  },
  {
    question: "Penses-tu qu'Hady est un énorme charognard ?",
    reponses: ["Oui", "Non"],
  },
  {
    question: "Penses-tu que Meissa est secrètement amoureuse de Mehdi ?",
    reponses: ["Oui", "Non"],
  },
  {
    question: "Penses-tu qu'Hervé est encore dans la cave à Célia ?",
    reponses: ["Oui", "Non"],
  },
  {
    question: "Penses-tu que Manoé a déjà envoyé des nudes à Hady ?",
    reponses: ["Oui", "Non"],
  },
  {
    question: "Penses-tu vraiment que la veste d'exorciste d'Hady a coûté 103 euros ?",
    reponses: ["Oui", "Non"],
  },
  {
    question: "Penses-tu que Khalid et Célia formeraient un beau couple ?",
    reponses: ["Oui", "Non"],
  },
  {
    question: "Penses-tu que Célia préfère Manoé à Khalid ?",
    reponses: ["Oui", "Non"],
  },
  {
    question: "Penses-tu que Célia a plus de bodycount que Khalid ?",
    reponses: ["Oui", "Non"],
  },
  {
    question: "Penses-tu que Perrine fait vraiment du 44 en taille de pied ?",
    reponses: ["Oui", "Non"],
  },
  {
    question: "Penses-tu que Manoé a vraiment un BBL issue de Dubaï ?",
    reponses: ["Oui", "Non"],
  },
  {
    question: "Penses-tu que Meissa a un passé douteux ?",
    reponses: ["Oui", "Non"],
  },
];

function getResultEmoji(score: number, total: number) {
  const pct = score / total;
  if (pct >= 0.8) return "💀";
  if (pct >= 0.6) return "😈";
  if (pct >= 0.4) return "😏";
  if (pct >= 0.2) return "😇";
  return "👼";
}

function getResultMessage(pseudo: string, score: number, total: number) {
  const pct = score / total;
  if (pct >= 0.8) return `${pseudo}, t'es un cas désespéré...`;
  if (pct >= 0.6) return `${pseudo}, t'as pas mal de choses à te reprocher`;
  if (pct >= 0.4) return `${pseudo}, on voit que t'es pas tout blanc`;
  if (pct >= 0.2) return `${pseudo}, t'es plutôt clean`;
  return `${pseudo}, t'es un ange tombé du ciel`;
}

export default function Test() {
  const [pseudo, setPseudo] = useState("");
  const [pseudoValide, setPseudoValide] = useState(false);
  const [current, setCurrent] = useState(0);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [animKey, setAnimKey] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);

  const saveToSupabase = async (finalAnswers: string[], finalScore: number) => {
    setSaving(true);
    try {
      // Build an object with each question's answer
      const reponsesObj: Record<string, string> = {};
      questions.forEach((q, i) => {
        reponsesObj[`Q${i + 1}`] = finalAnswers[i];
      });

      await supabase.from("resultats").insert({
        pseudo: pseudo.trim(),
        score: finalScore,
        total: questions.length,
        reponses: reponsesObj,
      });
    } catch (err) {
      console.error("Erreur Supabase:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleAnswer = (rep: string) => {
    const newScore = rep === "Oui" ? score + 1 : score;
    const newAnswers = [...answers, rep];
    setAnswers(newAnswers);
    setScore(newScore);

    if (current < questions.length - 1) {
      setCurrent(current + 1);
      setAnimKey((k) => k + 1);
    } else {
      setFinished(true);
      saveToSupabase(newAnswers, newScore);
    }
  };

  const handlePseudoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pseudo.trim().length > 0) {
      setPseudoValide(true);
    }
  };

  const handleRestart = () => {
    setPseudo("");
    setPseudoValide(false);
    setCurrent(0);
    setFinished(false);
    setScore(0);
    setAnimKey(0);
    setAnswers([]);
  };

  const progress = pseudoValide && !finished
    ? ((current) / questions.length) * 100
    : finished
    ? 100
    : 0;

  return (
    <div className={styles.page}>
      {/* Progress bar */}
      <div className={styles.header}>
        <div className={styles.progressBar} style={{ width: `${progress}%` }} />
      </div>
      {pseudoValide && !finished && (
        <p className={styles.progressText}>
          {current + 1} / {questions.length}
        </p>
      )}

      <div className={styles.wrapper}>
        {/* --- PSEUDO SCREEN --- */}
        {!pseudoValide ? (
          <div className={styles.card}>
            <h3 className={styles.pseudoTitle}>Test de pureté</h3>
            <p className={styles.pseudoSubtitle}>
              Réponds honnêtement... ou pas 👀
            </p>
            <form onSubmit={handlePseudoSubmit} className={styles.form}>
              <input
                type="text"
                value={pseudo}
                onChange={(e) => setPseudo(e.target.value)}
                placeholder="Entre ton pseudo..."
                className={styles.input}
                autoFocus
              />
              <button type="submit" className={styles.submitBtn}>
                C&apos;est parti 🚀
              </button>
            </form>
          </div>

        /* --- QUESTION SCREEN --- */
        ) : !finished ? (
          <div className={styles.card} key={animKey}>
            <div className={styles.top}>
              <p className={styles.numero}>{current + 1}</p>
              <h3 className={styles.title}>
                {questions[current].question}
              </h3>
            </div>
            <div className={styles.buttons}>
              {questions[current].reponses.map((rep, i) => (
                <button
                  key={i}
                  className={i === 0 ? styles.yes : styles.no}
                  onClick={() => handleAnswer(rep)}
                >
                  {rep}
                </button>
              ))}
            </div>
          </div>

        /* --- RESULTS SCREEN --- */
        ) : (
          <div className={styles.resultsCard}>
            <span className={styles.emoji}>
              {getResultEmoji(score, questions.length)}
            </span>
            <h3 className={styles.resultsTitle}>
              {getResultMessage(pseudo, score, questions.length)}
            </h3>
            <div className={styles.scoreContainer}>
              <span className={styles.scoreNumber}>
                {score} / {questions.length}
              </span>
              <div className={styles.scoreBarBg}>
                <div
                  className={styles.scoreBarFill}
                  style={{ width: `${(score / questions.length) * 100}%` }}
                />
              </div>
              <span className={styles.scoreLabel}>
                {Math.round((score / questions.length) * 100)}% de &quot;Oui&quot;
              </span>
            </div>
            <button className={styles.restartBtn} onClick={handleRestart}>
              Recommencer ↻
            </button>
          </div>
        )}
      </div>
    </div>
  );
}