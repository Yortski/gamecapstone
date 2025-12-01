import { Canvas } from "@react-three/fiber";
import { Suspense, useState } from "react";
import DormScene from "./scenes/DormScene/DormScene";
import DormUI from "./scenes/DormScene/DormUI";

function DialogueBox({ dialogue, hidden }) {
  if (!dialogue?.text || hidden) return null;

  return (
    <div
      className="absolute bottom-10 left-1/2 transform -translate-x-1/2 
                 p-4 bg-white text-[#1e1e1e] border-2 border-[#1e1e1e]
                 max-w-lg text-center pointer-events-none"
    >
      {dialogue.speaker && <strong>{dialogue.speaker}: </strong>}
      {dialogue.text}
    </div>
  );
}

function ModalBox({ visible, message, type = "success", closeModal }) {
  if (!visible) return null;

  const bgColor = type === "success" ? "bg-green-100" : "bg-red-100";
  const borderColor = type === "success" ? "border-green-500" : "border-red-500";
  const textColor = type === "success" ? "text-green-800" : "text-red-800";

  return (
    <div
      className="absolute inset-0 flex items-center justify-center bg-black/20"
      onClick={closeModal}
    >
      <div
        className={`p-6 max-w-md text-center border-2 ${borderColor} ${bgColor}`}
        onClick={(e) => e.stopPropagation()}
      >
        <p className={`mb-4 font-bold ${textColor}`}>{message}</p>
        <button className="btn rounded-none" onClick={closeModal}>
          Close
        </button>
      </div>
    </div>
  );
}

function ChapterComplete({ visible, title, message, onContinue }) {
  if (!visible) return null;

  return (
    <div
      className="absolute inset-0 hero min-h-screen"
      style={{
        backgroundImage:
          "url(https://img.daisyui.com/images/stock/photo-1507358522600-9f71e620c44e.webp)",
      }}
    >
      <div className="hero-overlay"></div>
      <div className="hero-content text-neutral-content text-center">
        <div className="max-w-md">
          <h1 className="mb-5 text-5xl font-bold">{title}</h1>
          <p className="mb-5">{message}</p>
          <button className="btn btn-primary" onClick={onContinue}>
            Continue
          </button>
        </div>
      </div>
    </div>
  );
}

export default function SceneManager() {
  const [uiState, setUiState] = useState(null);
  const [dialogue, setDialogue] = useState({ speaker: "", text: "" });

  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [modalType, setModalType] = useState("success");

  const [chapterVisible, setChapterVisible] = useState(false);
  const [chapterTitle, setChapterTitle] = useState("Chapter Complete!");
  const [chapterMessage, setChapterMessage] = useState(
    "You have finished this part of the story."
  );

  const showModal = (msg, type = "success") => {
    setModalMsg(msg);
    setModalType(type);
    setModalVisible(true);
  };

  const showChapterComplete = (title, message) => {
    setChapterTitle(title);
    setChapterMessage(message);
    setChapterVisible(true);
  };

  const closeModal = () => setModalVisible(false);

  return (
    <div className="w-full h-full relative">
      <Canvas shadows camera={{ fov: 50 }}>
        <Suspense fallback={null}>
          <DormScene
            onUIChange={setUiState}
            setDialogue={setDialogue}
            showModal={showModal}
            showChapterComplete={showChapterComplete} 
          />
        </Suspense>
      </Canvas>

      {/* Disable UI if modal or chapter screen is open */}
      {!modalVisible && !chapterVisible && uiState && (
        <div className="pointer-events-auto absolute inset-0">
          <DormUI
            question={uiState.question}
            choices={uiState.choices}
            onSelect={uiState.onSelect}
          />
        </div>
      )}

      <DialogueBox dialogue={dialogue} hidden={modalVisible || chapterVisible} />

      <ModalBox
        visible={modalVisible}
        message={modalMsg}
        type={modalType}
        closeModal={closeModal}
      />

      <ChapterComplete
        visible={chapterVisible}
        title={chapterTitle}
        message={chapterMessage}
        onContinue={() => setChapterVisible(false)}
      />
    </div>
  );
}
