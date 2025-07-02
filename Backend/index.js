import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import OpenAI from 'openai';
import { pool } from './db.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

// --- AI Flashcard Generation Endpoint ---
const upload = multer({ storage: multer.memoryStorage() });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.post('/api/generate-flashcards', upload.single('file'), async (req, res) => {
  try {
    let prompt = req.body.prompt;
    // If file is uploaded, use its content as prompt
    if (req.file) {
      prompt = req.body.prompt
        ? `${req.body.prompt}\n\n${req.file.buffer.toString()}`
        : req.file.buffer.toString();
    }
    if (!prompt || !prompt.trim()) {
      return res.status(400).json({ error: 'Prompt or file required.' });
    }

    // Compose a system prompt for GPT
    const systemPrompt = `
You are a flashcard generator. Given the following content, extract 5-10 key facts and return them as JSON in this format:
[
  {"question": "...", "answer": "..."},
  ...
]
Content:
${prompt}
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: systemPrompt }
      ],
      max_tokens: 800,
      temperature: 0.3,
    });
    const content = completion.choices[0].message.content;

    // Try to parse the response as JSON
    let cards = [];
    try {
      // Find the first JSON array in the response
      const match = content.match(/\[.*\]/s);
      if (match) {
        cards = JSON.parse(match[0]);
      }
    } catch (err) {
      return res.status(500).json({ error: 'Failed to parse AI response.' });
    }

    if (!Array.isArray(cards) || !cards.length) {
      return res.status(500).json({ error: 'No flashcards generated.' });
    }

    res.json({ cards });
  } catch (err) {
    console.error('AI generation error:', err);
    res.status(500).json({ error: 'AI generation failed.' });
  }
});

app.post('/api/signup', async (req, res) => {
  console.log('Received signup request:', req.body);
  const { username, password, email } = req.body;

  try {
    console.log('Username:', req.body.username);
    // Insert the user into the database
    const result = await pool.query(
      'INSERT INTO users (username, password, email) VALUES ($1, $2, $3) RETURNING *',
      [username, password, email]
    );

    // Respond with the inserted user
    res.status(201).json({
      message: 'User created successfully',
      user: result.rows[0]
    });


  } catch (err) {
    if (err.code === '23505') {
      // Unique violation error code
      console.error('Username or email already exists:', err);
      return res.status(409).json({ error: 'Username or email already exists' });
      
    }else{
      console.error('Error inserting user:', err);
      res.status(500).json({ error: 'Failed to create user' });
    }
  }
});
app.post('/api/signin', async(req, res) => {
  console.log('Received signin request:', req.body);
  const { email, password } = req.body;

  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1 AND password = $2', [email, password]
  );
  if (result.rows.length > 0) {
    console.log('User found:', result.rows[0]);
    return res.status(200).json({ message: 'Signin successful', user: result.rows[0] });
  } else {
    console.log('User not found');
    return res.status(401).json({ error: 'Invalid email or password' });
  }
});
app.post('/api/flashcard-sets' , async (req, res) => {
   const { set, email } = req.body;
    const { name, cards } = set;
  try{
    let  user_id = await pool.query(
      'SELECT id from users WHERE email = $1', [email]
    ); 
    user_id = user_id.rows[0].id;
    const deck_result = await pool.query(
      'INSERT INTO decks (name, user_id) VALUES ($1, $2) RETURNING *',
      [name, user_id]
    );
    const deckId = deck_result.rows[0].id;
    const values = [];
    const placeholders = cards.map((card, i) => {
      const idx = i * 3;
      values.push(card.question, card.answer, deckId);
      return `($${idx + 1}, $${idx + 2}, $${idx + 3})`;
    }).join(', ');
    if (cards.length > 0) {
      const query = `
        INSERT INTO flashcards (question, answer, deck_id)
        VALUES ${placeholders}
        RETURNING *
      `;
      await pool.query(query, values);
    }
    // Return the new deck id so frontend can use it
    res.status(201).json({ id: deckId });
  } catch (err) {
    console.error('Error inserting flashcard set:', err);
    return res.status(500).json({ error: 'Failed to create flashcard set' });
  }
});
app.get('/api/flashcard-sets', async (req, res) => {
  const { email } = req.query;
  try {
    const userResult = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userResult.rows.length === 0) return res.json({ sets: [] });
    const userId = userResult.rows[0].id;
    const decks = await pool.query('SELECT * FROM decks WHERE user_id = $1', [userId]);
    const sets = [];
    for (const deck of decks.rows) {
      const cards = await pool.query('SELECT question, answer FROM flashcards WHERE deck_id = $1', [deck.id]);
      sets.push({ id: deck.id, name: deck.name, cards: cards.rows });
    }
    res.json({ sets });
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sets" });
  }
});
app.put('/api/flashcard-sets/:id', async (req, res) => {
  const deckId = req.params.id;
  const { name, cards } = req.body;
  try {
    // Update the deck name
    await pool.query(
      'UPDATE decks SET name = $1 WHERE id = $2',
      [name, deckId]
    );
    // Remove existing cards for this deck
    await pool.query(
      'DELETE FROM flashcards WHERE deck_id = $1',
      [deckId]
    );
    // Insert new/updated cards
    if (cards && cards.length > 0) {
      const values = [];
      const placeholders = cards.map((card, i) => {
        const idx = i * 3;
        values.push(card.question, card.answer, deckId);
        return `($${idx + 1}, $${idx + 2}, $${idx + 3})`;
      }).join(', ');
      await pool.query(
        `INSERT INTO flashcards (question, answer, deck_id) VALUES ${placeholders}`,
        values
      );
    }
    res.json({ message: 'Set updated' });
  } catch (err) {
    console.error('Error updating set:', err);
    res.status(500).json({ error: 'Failed to update set' });
  }
});
app.delete('/api/flashcard-sets/:id', async (req, res) => {
  console.log('Received delete request for deck ID:', req.params.id);
  const deckId = req.params.id;
  try {
    await pool.query('DELETE FROM flashcards WHERE deck_id = $1', [deckId]);
    await pool.query('DELETE FROM decks WHERE id = $1', [deckId]);
    res.json({ message: 'Set deleted' });
  } catch (err) {
    console.error('Error deleting set:', err);
    res.status(500).json({ error: 'Failed to delete set' });
  }
});
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
})