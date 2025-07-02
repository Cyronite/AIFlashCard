# AI FlashCard

AI FlashCard is a full-stack web application that lets users generate, manage, and study flashcards using OpenAI's GPT models. Users can create flashcard sets manually or generate them from text prompts or uploaded files using AI.

## Features

- **User Authentication:** Sign up and sign in with email and password.
- **AI Flashcard Generation:** Generate flashcards from a prompt or uploaded text file using OpenAI GPT.
- **CRUD Flashcard Sets:** Create, read, update, and delete flashcard sets.
- **Study Mode:** Review flashcards in a study-friendly modal.
- **Persistent Storage:** All data is stored in a PostgreSQL database.

## Tech Stack

- **Frontend:** React (Vite), TypeScript, Tailwind CSS
- **Backend:** Node.js, Express, OpenAI API, Multer, CORS
- **Database:** PostgreSQL

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm
- PostgreSQL database
- OpenAI API key

### Setup

#### 1. Clone the repository

```sh
git clone https://github.com/yourusername/aiflashcard.git
cd aiflashcard
```

#### 2. Install dependencies

```sh
cd Backend
npm install
cd ../
cd AIFlashCard
npm install
```

#### 3. Configure environment variables

Create a `.env` file in the `Backend` directory:

```
OPENAI_API_KEY=your-openai-api-key-here
DATABASE_URL=your-postgres-connection-string
```

#### 4. Set up the database

Create the required tables in your PostgreSQL database:

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE decks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  user_id INTEGER REFERENCES users(id)
);

CREATE TABLE flashcards (
  id SERIAL PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  deck_id INTEGER REFERENCES decks(id)
);
```

#### 5. Start the backend server

```sh
cd Backend
npm start
```

#### 6. Start the frontend

```sh
cd ../AIFlashCard
npm run dev
```

The frontend will run on [http://localhost:5173](http://localhost:5173) and the backend API on [http://localhost:3000](http://localhost:3000).

## Usage

- Sign up or sign in.
- Create a new flashcard set manually or use the AI generator.
- Edit, delete, or study your flashcard sets.

## Environment Variables

- `OPENAI_API_KEY` – Your OpenAI API key.
- `DATABASE_URL` – Your PostgreSQL connection string.


