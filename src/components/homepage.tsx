import { useState, useEffect } from "react";

// --- Types ---
interface Flashcard {
  question: string;
  answer: string;
}
interface FlashcardSet {
  id?: number; // <-- Add id as optional for new sets
  name: string;
  cards: Flashcard[];
}

// --- API Helper (move outside Dashboard) ---
export async function apiGenerateAIFlashcards({ prompt, file }: { prompt?: string; file?: File }) {
  if (file) {
    const form = new FormData();
    if (prompt) form.append('prompt', prompt);
    form.append('file', file);
    const res = await fetch('http://localhost:3000/api/generate-flashcards', {
      method: 'POST',
      body: form
    });
    if (!res.ok) throw new Error('AI file upload failed');
    return await res.json();
  } else {
    const res = await fetch('http://localhost:3000/api/generate-flashcards', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt })
    });
    if (!res.ok) throw new Error('AI prompt failed');
    return await res.json();
  }
}

// --- Main Dashboard Component ---
export default function Dashboard({ user }: { user: { email: string } }) {
  const [sets, setSets] = useState<FlashcardSet[]>([]);
  const [showAddSet, setShowAddSet] = useState(false);
  const [editingSetIdx, setEditingSetIdx] = useState<number | null>(null);
  const [activeSetIdx, setActiveSetIdx] = useState<number | null>(null);

  // --- Fetch sets on mount or when user changes ---
  useEffect(() => {
    async function fetchSets() {
      try {
        const res = await fetch(`http://localhost:3000/api/flashcard-sets?email=${encodeURIComponent(user.email)}`);
        if (!res.ok) throw new Error("Failed to fetch sets");
        const data = await res.json();
        setSets(data.sets || []);
      } catch (e) {
        setSets([]);
      }
    }
    fetchSets();
  }, [user.email]);

  // --- API Helpers ---
  async function apiCreateSet(set: FlashcardSet) {
    const res = await fetch('http://localhost:3000/api/flashcard-sets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ set, email: user.email })
    });

    if (!res.ok) throw new Error('Failed to create set');

    return await res.json();
  }

  async function apiUpdateSet(id: number, set: FlashcardSet) {
    const res = await fetch(`http://localhost:3000/api/flashcard-sets/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(set)
    });
    if (!res.ok) throw new Error('Failed to update set');
    return await res.json();
  }

async function apiDeleteSet(id: number) {
  const res = await fetch(`http://localhost:3000/api/flashcard-sets/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to delete set');
  return await res.json();
}
  // --- Handlers ---
  function handleRemoveSet(idx: number) {
    const setToRemove = sets[idx];
    setSets(sets => sets.filter((_, i) => i !== idx));
    if (activeSetIdx === idx) setActiveSetIdx(null);
    if (setToRemove.id !== undefined) {
      apiDeleteSet(setToRemove.id).catch(() => {});
    }
  }

  async function handleAddSet(set: FlashcardSet) {
    setShowAddSet(false);
    try {
      const res = await apiCreateSet(set);
      // Assume backend returns { id: ..., ... }
      setSets(sets => [...sets, { ...set, id: res.id }]);
    } catch (e) {
      // handle error (toast, etc)
    }
  }

  function handleEditSet(idx: number) {
    setEditingSetIdx(idx);
  }

  async function handleUpdateSet(idx: number, updatedSet: FlashcardSet) {
    const deckId = sets[idx]?.id;
    setSets(sets => sets.map((s, i) => (i === idx ? { ...updatedSet, id: deckId } : s)));
    setEditingSetIdx(null);
    try {
      if (deckId !== undefined) {
        await apiUpdateSet(deckId, updatedSet);
      }
    } catch (e) {
      // handle error
    }
  }

  // --- Render ---
  return (
    <section className="w-full min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-[#f5efe6] to-[#e9e4d8] relative">
      <h1 className="text-[#2d3142] text-5xl md:text-6xl font-extrabold mb-6 text-center font-serif tracking-tight drop-shadow">
        Welcome, {user.email}!
      </h1>
      <p className="text-[#4f5d75] text-lg md:text-2xl mb-8 text-center max-w-2xl font-medium">
        Here are your flashcard sets. Add, edit, remove, or study your sets!
      </p>
      <div className="flex gap-4 mb-8">
        <button
          className="bg-gradient-to-r from-[#2d3142] to-[#4f5d75] text-[#f5efe6] px-8 py-4 rounded-2xl font-extrabold text-lg shadow-lg hover:scale-105 hover:from-[#4f5d75] hover:to-[#2d3142] transition-all duration-200"
          onClick={() => setShowAddSet(true)}
        >
          + Create New Set
        </button>
      </div>
      <div className="w-full max-w-4xl">
        {sets.length === 0 && <div className="text-[#4f5d75] text-xl text-center">No flashcard sets yet.</div>}
        <ul className="space-y-8 w-full">
          {sets.map((set, idx) => (
            <li key={set.id ?? idx} className="bg-white border border-[#e0d9c7] rounded-3xl p-10 shadow-xl flex flex-col mb-2 relative hover:shadow-2xl transition-shadow duration-200">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4 gap-4">
                <div className="font-bold text-3xl text-[#2d3142] font-serif text-center md:text-left">{set.name}</div>
                <div className="flex gap-3">
                  <button
                    className="bg-gradient-to-r from-[#457b9d] to-[#2d3142] text-[#f5efe6] px-6 py-2 rounded-xl font-bold shadow hover:scale-105 hover:from-[#2d3142] hover:to-[#457b9d] transition-all duration-200"
                    onClick={() => handleEditSet(idx)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-gradient-to-r from-[#e63946] to-[#b71c1c] text-white px-6 py-2 rounded-xl font-bold shadow hover:scale-105 hover:from-[#b71c1c] hover:to-[#e63946] transition-all duration-200"
                    onClick={() => handleRemoveSet(idx)}
                  >
                    Remove
                  </button>
                  <button
                    className="bg-gradient-to-r from-[#2d3142] to-[#4f5d75] text-[#f5efe6] px-6 py-2 rounded-xl font-bold shadow hover:scale-105 hover:from-[#4f5d75] hover:to-[#2d3142] transition-all duration-200"
                    onClick={() => setActiveSetIdx(idx)}
                  >
                    Study
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
      {showAddSet && <AddSet onAdd={handleAddSet} onCancel={() => setShowAddSet(false)} />}
      {editingSetIdx !== null && (
        <EditSet
          set={sets[editingSetIdx]}
          onUpdate={updated => handleUpdateSet(editingSetIdx, updated)}
          onCancel={() => setEditingSetIdx(null)}
        />
      )}
      {activeSetIdx !== null && (
        <FlashcardStudyModal
          set={sets[activeSetIdx]}
          onClose={() => setActiveSetIdx(null)}
        />
      )}
    </section>
  );
}

// --- Helper Components ---
function FlashcardStudyModal({ set, onClose }: { set: FlashcardSet; onClose: () => void }) {
  const [idx, setIdx] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  if (!set.cards.length) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-[#f5efe6] to-[#e9e4d8] flex items-center justify-center z-50 min-h-screen">
        <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-2xl flex flex-col items-center border border-[#e0d9c7]">
          <h2 className="text-3xl font-bold text-[#2d3142] mb-6 font-serif">{set.name}</h2>
          <div className="text-[#4f5d75] mb-6 text-lg">No cards in this set.</div>
          <button className="bg-gradient-to-r from-[#2d3142] to-[#4f5d75] text-[#f5efe6] px-8 py-3 rounded-xl font-bold shadow hover:scale-105 hover:from-[#4f5d75] hover:to-[#2d3142] transition-all duration-200" onClick={onClose}>Close</button>
        </div>
      </div>
    );
  }

  const card = set.cards[idx];

  function next() {
    setShowAnswer(false);
    setIdx(i => (i + 1) % set.cards.length);
  }
  function prev() {
    setShowAnswer(false);
    setIdx(i => (i - 1 + set.cards.length) % set.cards.length);
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#f5efe6] to-[#e9e4d8] flex items-center justify-center z-50 min-h-screen">
      <div className="bg-white rounded-3xl shadow-2xl p-12 w-full max-w-2xl flex flex-col items-center border border-[#e0d9c7]">
        <h2 className="text-3xl font-bold text-[#2d3142] mb-6 font-serif">{set.name}</h2>
        <div className="w-full flex flex-col items-center mb-8">
          <div className="text-[#2d3142] text-2xl font-bold mb-4">Card {idx + 1} of {set.cards.length}</div>
          <div className="text-[#4f5d75] text-xl mb-6 text-center">Q: {card.question}</div>
          {showAnswer ? (
            <div className="text-[#2d3142] text-xl font-bold mb-6 text-center">A: {card.answer}</div>
          ) : (
            <button className="bg-gradient-to-r from-[#2d3142] to-[#4f5d75] text-[#f5efe6] px-8 py-3 rounded-xl font-bold shadow hover:scale-105 hover:from-[#4f5d75] hover:to-[#2d3142] transition-all duration-200 mb-6" onClick={() => setShowAnswer(true)}>
              Show Answer
            </button>
          )}
        </div>
        <div className="flex gap-6 mb-6">
          <button className="bg-gradient-to-r from-[#e0d9c7] to-[#f5efe6] text-[#2d3142] px-8 py-3 rounded-xl font-bold shadow hover:scale-105 hover:from-[#f5efe6] hover:to-[#e0d9c7] transition-all duration-200" onClick={prev}>Previous</button>
          <button className="bg-gradient-to-r from-[#2d3142] to-[#4f5d75] text-[#f5efe6] px-8 py-3 rounded-xl font-bold shadow hover:scale-105 hover:from-[#4f5d75] hover:to-[#2d3142] transition-all duration-200" onClick={next}>Next</button>
        </div>
        <button className="mt-2 bg-gradient-to-r from-[#e63946] to-[#b71c1c] text-white px-8 py-3 rounded-xl font-bold shadow hover:scale-105 hover:from-[#b71c1c] hover:to-[#e63946] transition-all duration-200" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

function AddSet({ onAdd, onCancel }: { onAdd: (set: { name: string; cards: { question: string; answer: string }[] }) => void; onCancel: () => void }) {
  const [name, setName] = useState("");
  const [cards, setCards] = useState<{ question: string; answer: string }[]>([{ question: "", answer: "" }]);
  const [error, setError] = useState<string | null>(null);
  const [aiMode, setAiMode] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [aiFile, setAiFile] = useState<File | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  function handleCardChange(idx: number, field: "question" | "answer", value: string) {
    setCards(cards => cards.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  }

  function handleAddCardField() {
    setCards(cards => [...cards, { question: "", answer: "" }]);
  }

  function handleRemoveCardField(idx: number) {
    setCards(cards => cards.filter((_, i) => i !== idx));
  }

  async function handleAIGenerate(e: React.FormEvent) {
    e.preventDefault();
    setAiLoading(true);
    setAiError(null);
    try {
      let result;
      if (aiFile) {
        result = await apiGenerateAIFlashcards({ file: aiFile, prompt: aiPrompt });
      } else if (aiPrompt.trim()) {
        result = await apiGenerateAIFlashcards({ prompt: aiPrompt });
      } else {
        setAiError("Please provide a prompt or upload a file.");
        setAiLoading(false);
        return;
      }
      if (result.cards && Array.isArray(result.cards) && result.cards.length > 0) {
        setCards(result.cards);
      } else {
        setAiError("AI did not return any cards.");
      }
    } catch (err: any) {
      setAiError(err.message || "AI error");
    }
    setAiLoading(false);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Set name is required.");
      return;
    }
    if (cards.some(card => !card.question.trim() || !card.answer.trim())) {
      setError("All questions and answers are required.");
      return;
    }
    onAdd({ name, cards });
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#f5efe6] to-[#e9e4d8] flex items-center justify-center z-50 min-h-screen">
      <form className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl flex flex-col gap-6 border border-[#e0d9c7] relative animate-fadeIn" onSubmit={handleSubmit}>
        <h2 className="text-4xl font-extrabold text-[#2d3142] mb-2 font-serif text-center tracking-tight drop-shadow">Create New Flashcard Set</h2>
        <div className="flex flex-col md:flex-row gap-4 items-center mb-2">
          <input
            type="text"
            placeholder="Set Name"
            className="border border-[#e0d9c7] rounded-xl px-6 py-4 focus:outline-none focus:border-[#2d3142] bg-[#f5efe6] text-[#2d3142] text-xl font-semibold flex-1 shadow"
            value={name}
            onChange={e => setName(e.target.value)}
          />
          <button
            type="button"
            className={`px-6 py-3 rounded-xl font-bold shadow transition-all duration-200 text-lg ${aiMode ? "bg-gradient-to-r from-[#457b9d] to-[#2d3142] text-[#f5efe6]" : "bg-gradient-to-r from-[#e0d9c7] to-[#f5efe6] text-[#2d3142] hover:from-[#f5efe6] hover:to-[#e0d9c7]"}`}
            onClick={() => setAiMode(m => !m)}
          >
            {aiMode ? "Manual Entry" : "Generate with AI"}
          </button>
        </div>
        {aiMode ? (
          <div className="flex flex-col gap-4 mb-2 animate-fadeIn">
            <label className="text-[#2d3142] font-bold text-lg">Describe your topic or upload a file for AI:</label>
            <textarea
              className="border border-[#e0d9c7] rounded-xl px-4 py-3 focus:outline-none focus:border-[#2d3142] bg-[#f5efe6] text-[#2d3142] text-lg min-h-[80px] resize-none shadow"
              placeholder="e.g. 'Basics of Photosynthesis', 'Key facts about World War II', or 'Python programming fundamentals'"
              value={aiPrompt}
              onChange={e => setAiPrompt(e.target.value)}
              disabled={aiLoading}
            />
            <div className="flex flex-col gap-2">
              <label className="text-[#2d3142] font-medium">Or upload a text file (.txt, .md, .csv):</label>
              <input
                type="file"
                accept=".txt,.md,.csv"
                className="file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-gradient-to-r file:from-[#2d3142] file:to-[#4f5d75] file:text-[#f5efe6] file:shadow"
                onChange={e => {
                  const file = e.target.files && e.target.files[0];
                  setAiFile(file || null);
                }}
                disabled={aiLoading}
              />
              {aiFile && <span className="text-[#457b9d] text-sm">Selected: {aiFile.name}</span>}
            </div>
            <button
              type="button"
              className="bg-gradient-to-r from-[#457b9d] to-[#2d3142] text-[#f5efe6] px-8 py-3 rounded-xl font-bold shadow hover:scale-105 hover:from-[#2d3142] hover:to-[#457b9d] transition-all duration-200 disabled:opacity-60"
              onClick={handleAIGenerate}
              disabled={aiLoading || (!aiPrompt.trim() && !aiFile)}
            >
              {aiLoading ? "Generating..." : "Generate Cards"}
            </button>
            {aiError && <div className="text-red-600 text-base font-semibold">{aiError}</div>}
            <div className="text-[#4f5d75] text-sm italic">AI will generate a set of flashcards based on your topic or uploaded file.</div>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mb-2 animate-fadeIn">
            {cards.map((card, idx) => (
              <div key={idx} className="flex gap-2 items-center">
                <input
                  type="text"
                  placeholder={`Question ${idx + 1}`}
                  className="border border-[#e0d9c7] rounded-xl px-4 py-3 focus:outline-none focus:border-[#2d3142] bg-[#f5efe6] text-[#2d3142] text-lg flex-1 shadow"
                  value={card.question}
                  onChange={e => handleCardChange(idx, "question", e.target.value)}
                />
                <input
                  type="text"
                  placeholder={`Answer ${idx + 1}`}
                  className="border border-[#e0d9c7] rounded-xl px-4 py-3 focus:outline-none focus:border-[#2d3142] bg-[#f5efe6] text-[#2d3142] text-lg flex-1 shadow"
                  value={card.answer}
                  onChange={e => handleCardChange(idx, "answer", e.target.value)}
                />
                {cards.length > 1 && (
                  <button type="button" className="text-[#e63946] font-bold text-2xl px-2 hover:scale-125 transition" onClick={() => handleRemoveCardField(idx)} title="Remove">×</button>
                )}
              </div>
            ))}
            <button type="button" className="bg-gradient-to-r from-[#2d3142] to-[#4f5d75] text-[#f5efe6] px-6 py-2 rounded-full font-bold hover:scale-105 hover:from-[#4f5d75] hover:to-[#2d3142] transition shadow mt-2 self-start" onClick={handleAddCardField}>
              Add Another Card
            </button>
          </div>
        )}
        {error && <div className="text-red-600 text-base font-semibold">{error}</div>}
        <div className="flex gap-6 mt-2 justify-center">
          <button type="submit" className="bg-gradient-to-r from-[#2d3142] to-[#4f5d75] text-[#f5efe6] px-8 py-3 rounded-xl font-bold shadow hover:scale-105 hover:from-[#4f5d75] hover:to-[#2d3142] transition-all duration-200">Create Set</button>
          <button type="button" className="bg-gradient-to-r from-[#e0d9c7] to-[#f5efe6] text-[#2d3142] px-8 py-3 rounded-xl font-bold shadow hover:scale-105 hover:from-[#f5efe6] hover:to-[#e0d9c7] transition-all duration-200" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}

function EditSet({ set, onUpdate, onCancel }: { set: FlashcardSet; onUpdate: (set: FlashcardSet) => void; onCancel: () => void }) {
  const [name, setName] = useState(set.name);
  const [cards, setCards] = useState<Flashcard[]>(set.cards);
  const [showAddCard, setShowAddCard] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function handleAddCard(card: Flashcard) {
    setCards(cards => [...cards, card]);
    setShowAddCard(false);
  }

  function handleRemoveCard(idx: number) {
    setCards(cards => cards.filter((_, i) => i !== idx));
  }

  function handleCardChange(idx: number, field: "question" | "answer", value: string) {
    setCards(cards => cards.map((c, i) => i === idx ? { ...c, [field]: value } : c));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) {
      setError("Set name is required.");
      return;
    }
    if (cards.some(card => !card.question.trim() || !card.answer.trim())) {
      setError("All questions and answers are required.");
      return;
    }
    onUpdate({ name, cards });
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#f5efe6]/80 to-[#e9e4d8]/80 flex items-center justify-center z-50 min-h-screen">
      <form className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-2xl flex flex-col gap-6 border border-[#e0d9c7] relative animate-fadeIn" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-extrabold text-[#2d3142] mb-2 font-serif text-center">Edit Flashcard Set</h2>
        <input
          type="text"
          placeholder="Set Name"
          className="border border-[#e0d9c7] rounded-xl px-5 py-4 focus:outline-none focus:border-[#2d3142] bg-[#f5efe6] text-[#2d3142] w-full text-lg shadow"
          value={name}
          onChange={e => setName(e.target.value)}
        />
        <div className="flex gap-2 mb-2">
          <button type="button" className="bg-gradient-to-r from-[#2d3142] to-[#4f5d75] text-[#f5efe6] px-4 py-2 rounded-full font-bold hover:scale-105 transition shadow" onClick={() => setShowAddCard(true)}>
            Add Card
          </button>
        </div>
        <div className="flex flex-col gap-4 mb-2 animate-fadeIn">
          {cards.map((card, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="text"
                placeholder={`Question ${idx + 1}`}
                className="border border-[#e0d9c7] rounded-lg px-3 py-2 focus:outline-none focus:border-[#2d3142] bg-[#f5efe6] text-[#2d3142] flex-1 text-base"
                value={card.question}
                onChange={e => handleCardChange(idx, "question", e.target.value)}
              />
              <input
                type="text"
                placeholder={`Answer ${idx + 1}`}
                className="border border-[#e0d9c7] rounded-lg px-3 py-2 focus:outline-none focus:border-[#2d3142] bg-[#f5efe6] text-[#2d3142] flex-1 text-base"
                value={card.answer}
                onChange={e => handleCardChange(idx, "answer", e.target.value)}
              />
              {cards.length > 1 && (
                <button type="button" className="text-[#e63946] font-bold text-lg px-2" onClick={() => handleRemoveCard(idx)} title="Remove">×</button>
              )}
            </div>
          ))}
        </div>
        {error && <div className="text-red-600 text-base text-center font-semibold">{error}</div>}
        <div className="flex gap-4 mt-2 justify-center">
          <button type="submit" className="bg-gradient-to-r from-[#2d3142] to-[#4f5d75] text-[#f5efe6] px-8 py-3 rounded-xl font-bold shadow hover:scale-105 transition-all duration-200">Save Changes</button>
          <button type="button" className="bg-gradient-to-r from-[#e0d9c7] to-[#f5efe6] text-[#2d3142] px-8 py-3 rounded-xl font-bold shadow hover:scale-105 transition-all duration-200" onClick={onCancel}>Cancel</button>
        </div>
      </form>
      {showAddCard && <AddFlashcard onAdd={handleAddCard} onCancel={() => setShowAddCard(false)} />}
    </div>
  );
}

function AddFlashcard({ onAdd, onCancel }: { onAdd: (card: { question: string; answer: string }) => void; onCancel: () => void }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || !answer.trim()) {
      setError("Both question and answer are required.");
      return;
    }
    onAdd({ question, answer });
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-[#f5efe6] to-[#e9e4d8] flex items-center justify-center z-50 min-h-screen">
      <form className="bg-white rounded-3xl shadow-2xl p-10 w-full max-w-xl flex flex-col gap-6 border border-[#e0d9c7] items-center" onSubmit={handleSubmit}>
        <h2 className="text-3xl font-bold text-[#2d3142] mb-2 font-serif">Add Flashcard</h2>
        <input
          type="text"
          placeholder="Question"
          className="border border-[#e0d9c7] rounded-xl px-5 py-4 focus:outline-none focus:border-[#2d3142] bg-[#f5efe6] text-[#2d3142] w-full text-lg shadow"
          value={question}
          onChange={e => setQuestion(e.target.value)}
        />
        <input
          type="text"
          placeholder="Answer"
          className="border border-[#e0d9c7] rounded-xl px-5 py-4 focus:outline-none focus:border-[#2d3142] bg-[#f5efe6] text-[#2d3142] w-full text-lg shadow"
          value={answer}
          onChange={e => setAnswer(e.target.value)}
        />
        {error && <div className="text-red-600 text-base font-semibold">{error}</div>}
        <div className="flex gap-6 mt-2 w-full justify-center">
          <button type="submit" className="bg-gradient-to-r from-[#2d3142] to-[#4f5d75] text-[#f5efe6] px-8 py-3 rounded-xl font-bold shadow hover:scale-105 hover:from-[#4f5d75] hover:to-[#2d3142] transition-all duration-200">Add</button>
          <button type="button" className="bg-gradient-to-r from-[#e0d9c7] to-[#f5efe6] text-[#2d3142] px-8 py-3 rounded-xl font-bold shadow hover:scale-105 hover:from-[#f5efe6] hover:to-[#e0d9c7] transition-all duration-200" onClick={onCancel}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
