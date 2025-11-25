# Quick Setup Guide

## Environment Variables

Create a `.env.local` file in the root directory with the following content:

```
OPENAI_API_KEY=your_openai_api_key_here
```

Replace `your_openai_api_key_here` with your actual OpenAI API key.

## Running the Application

1. Install dependencies (if not already done):
   ```bash
   npm install
   ```

2. Start the development server:
   ```bash
   npm run dev
   ```

3. Open your browser to [http://localhost:3000](http://localhost:3000)

## How It Works

1. Users select from 4 predefined dyslexia descriptions or add their own
2. Users paste text they want to make more readable
3. The app sends this data to OpenAI's API
4. AI formats the text based on the specific reading challenges
5. Formatted text is displayed with HTML formatting for enhanced readability

## API Endpoint

**POST** `/api/format-text`

Request body:
```json
{
  "descriptions": ["array", "of", "descriptions"],
  "text": "text to format"
}
```

Response:
```json
{
  "formattedText": "HTML formatted text"
}
```

