# ChatGPT Language Learning Plugin

This is a plugin for ChatGPT that helps users learn German. The plugin allows users to set their desired CEFR level and chat with the AI at that level. It also provides lessons on vocabulary and grammar specific to the user's selected CEFR level.

<!-- ![image info](./Demo.png) -->

## Features

- Select a unit to start (1-20) Only A1,A2 levels are supported currently
- Let chatgpt generate exercises based on the unit picked
- Talk to ChatGpt based on the unit material and let it rolelpay to practice your desired language

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/get-npm) (comes with Node.js)

### Installation

1. Clone the repository:
2. Install the required dependencies:

```sh
npm install
```

### Running the project

For development:

```sh
npm start
```

Once the local server is running:

1. Navigate to https://chat.openai.com. 
2. In the Model drop down, select "Plugins" (note, if you don't see it there, you don't have access yet).
3. Select "Plugin store"
4. Select "Develop your own plugin"
5. Enter in `localhost:5003` since this is the URL the server is running on locally, then select "Find manifest file".

The plugin should now be installed and enabled! You can start with a question like "What is on my todo list" and then try adding something to it as well! 

## API Endpoints

### Set Unit Number

- URL: `/setUnit/{unitNumber}`
- Method: `POST`
- URL Params: `unitNumber` (string|number)
- Success Response: `200 OK`

### Teach Unit

- URL: `/teachUnit`
- Method: `GET`
- Success Response: `200 OK` with JSON array of prompt and content

### Conversation 

- URL: `/conversation`
- Method: `GET`
- Success Response: `200 OK` with JSON array of prompt and content

## Contributing

Contributions are welcome! Please create a fork of this repository, make your changes in a new branch, and submit a pull request.
