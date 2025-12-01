import { useState, useEffect, useRef, forwardRef } from "react";
import DormEnvironment from "./DormEnvironment";
import DormCamera from "./DormCamera";
import DormStudentBase from "./DormStudent";
import BossMinibotBase from "./BossMinibot";
import { dormScenarios } from "./scenarios";
import DormIntroCutscene from "./DormIntroCutscene";
import DormOutroCutscene from "./DormOutroCutscene";

// Forward refs for models
const DormStudent = forwardRef((props, ref) => (
  <DormStudentBase ref={ref} {...props} />
));

const BossMinibot = forwardRef((props, ref) => (
  <BossMinibotBase ref={ref} {...props} />
));

export default function DormScene({ onUIChange, setDialogue, showModal, showChapterComplete }) {
  const [phase, setPhase] = useState("intro"); // intro → quiz → outro → done
  const [index, setIndex] = useState(0);

  const [cameraTarget, setCameraTarget] = useState("juan");

  const studentRef = useRef();
  const bossRef = useRef();

  const scenario = dormScenarios[index];

  const [studentAnim, setStudentAnim] = useState("Idle");
  const [bossAnim, setBossAnim] = useState("Idle.1");

  // When entering QUIZ mode
  useEffect(() => {
    if (phase === "quiz") {
      onUIChange({
        question: scenario.question,
        choices: scenario.choices,
        onSelect: handleChoice,
      });

      setStudentAnim("typing");
      setBossAnim(scenario.isBoss ? "Idle.2" : "Idle.1");
    }
  }, [index, phase]);

  // Boss fly-away animation effect !NOT WORKING!
  const playBossFlyAway = () => {
    const boss = bossRef.current;
    if (!boss) return;

    const startPos = boss.position.clone();
    const startRot = boss.rotation.y;

    const rotateTime = 1500;
    const flyTime = 2000;

    const rotStart = performance.now();

    const rotateStep = () => {
      const t = performance.now() - rotStart;

      if (t < rotateTime) {
        boss.rotation.y = startRot + Math.PI * 2 * (t / rotateTime);
        requestAnimationFrame(rotateStep);
      } else {
        const flyStart = performance.now();

        const flyStep = () => {
          const f = performance.now() - flyStart;

          if (f < flyTime) {
            boss.position.set(
              startPos.x,
              startPos.y + f * 0.008 * 10,
              startPos.z
            );
            requestAnimationFrame(flyStep);
          } else {
            boss.visible = false;
          }
        };

        requestAnimationFrame(flyStep);
      }
    };

    requestAnimationFrame(rotateStep);
  };

  // User selects an answer
  const handleChoice = (choice) => {
    if (choice.correct) {
      setStudentAnim("win");
      showModal(scenario.successMessage, "success");

      if (scenario.isBoss) playBossFlyAway();

      setTimeout(() => {
        if (index < dormScenarios.length - 1) {
          setIndex((i) => i + 1);
        } else {
          onUIChange(null);
          setPhase("outro");
        }
      }, 700);
    } else {
      setStudentAnim("fail");

      if (scenario.isBoss) setBossAnim("laughing");

      showModal(scenario.failMessage, "fail");

      setTimeout(() => {
        setStudentAnim("typing");
        if (scenario.isBoss) setBossAnim("Idle.1");
      }, 1200);
    }
  };

  return (
    <>
      <DormCamera 
        active={cameraTarget}
        studentRef={studentRef}
        bossRef={bossRef}
      />
      <DormEnvironment />

      <DormStudent ref={studentRef} animation={studentAnim} />
      <BossMinibot
        ref={bossRef}
        visible={scenario.isBoss || phase === "intro" || phase === "outro"}
        animation={bossAnim}
      />

      {/* INTRO CUTSCENE */}
      {phase === "intro" && (
        <DormIntroCutscene
          studentRef={studentRef}
          bossRef={bossRef}
          setDialogue={setDialogue}
          setCamera={setCameraTarget}
          onFinish={() => {
            setDialogue({ text: "" });
            setPhase("quiz");
          }}
        />
      )}

      {/* OUTRO CUTSCENE */}
      {phase === "outro" && (
        <DormOutroCutscene
          studentRef={studentRef}
          bossRef={bossRef}
          setDialogue={setDialogue}
          setCamera={setCameraTarget}
          onFinish={() => {
            setDialogue({ text: "" });
            setPhase("done");

            if (showChapterComplete) {
              showChapterComplete(
                "Chapter 1 Complete!",
                "You have finished this part of the story. Well done!"
              );
            }
          }}
        />
      )}
    </>
  );
}
