# Text-Lexic

A web application designed to make text easier to read for people with dyslexic characteristics.

## Features

- **Personalized Reading Profiles**: Select from 4 classic descriptions of dyslexia or add your own custom description
- **Text Formatting**: Paste any text and receive a version formatted specifically for your reading needs
- **AI-Powered**: Uses OpenAI's prompt API to intelligently format text based on your preferences
- **Clean, Accessible UI**: Modern, user-friendly interface built with Next.js and Tailwind CSS

## Setup

### Prerequisites

- Node.js 18+ installed
- An OpenAI API key

### Installation

1. Clone this repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory and add your OpenAI API key:
   ```
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Usage

1. **Step 1**: Select any of the 4 classic dyslexia descriptions that match your reading experience, or add your own custom description
2. **Step 2**: Paste the text you want to make more readable
3. Click "Make Text Readable" to receive your formatted text
4. Copy the formatted text or format another piece of text

## API

The application sends a JSON payload to the OpenAI API in this format:

```json
{
  "descriptions": ["array of selected/custom descriptions"],
  "text": "the text to format"
}
```

The API returns formatted text that's optimized for the specified reading characteristics.

## Technologies

- **Next.js 16**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first styling
- **OpenAI API**: AI-powered text formatting

## License

MIT
