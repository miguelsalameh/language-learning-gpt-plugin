import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { json } from 'body-parser';

import germanUnits from '../deutsch.json'  
import frenchUnits from '../french.json'  

const app = express();

app.use(cors({
  origin: 'https://chat.openai.com'
}));
app.use(json());

interface UserState {
  language: string,
  currentUnit: {
    unit: number;
    content: unknown;
  };
}

const state: UserState = {
  language: "German",
  currentUnit: {
    unit: 1,
    content: germanUnits['Unit 1']
  }
};

const supportedLanguages = ["German", "French"]

function getUnits() {
  if(state.language === "German")  {
    return germanUnits;
  }
  return frenchUnits;
}

app.post('/setLanguage/:language', async (req, res) => {
  const targetLanguage = req.params.language
  if(supportedLanguages.includes(targetLanguage)) {
    state.language = targetLanguage
    res.status(200).json("The language was set to"+ targetLanguage);
    return;
  }
  res.status(400).json("The language requested is not supported yet: Supported language ->" +supportedLanguages.join(","));
});


app.post('/setUnit/:unitNumber', async (req, res) => {
  const unitNumber = req.params.unitNumber;
  const unitName = `Unit ${unitNumber}` as keyof typeof getUnits;
  const units = getUnits()

  if(units.hasOwnProperty(unitName)) {
    const content = units[unitName];
    state.currentUnit.unit = parseInt(unitNumber);
    state.currentUnit.content = content;
    res.status(200).json("The level was set to"+ unitName);
    return
  } 
  res.status(400).json();
});

app.get('/teachUnit', async (req, res) => {

    const response = {
      gptPrompt: `You will roleplay as a ${state.language} native speaker teacher, you will ` + 
                  "tell the user the content of the unit and generate a small and brief lesson for the user to learn," + 
                  "you will not translate anything until asked and you will explain the logic behind every lesson",
      unitContent: state.currentUnit.content,
      unitNumber: state.currentUnit.unit
    }

    res.status(200).json(response);

});

app.get('/conversation', async (req, res) => {

  const response = {
    gptPrompt: `You will act as a ${state.language} native speaker teacher, you will ` + 
                "talk to the user about a chosen subject, based on the unit and use the unit content as a basis" + 
                "to help the user get accustomed to the material, You will inform the user about your character and present the subject briefly" +
                 "you will use understandable german and briefly explain any word that might be hard",
    unitContent: state.currentUnit.content,
    unitNumber: state.currentUnit.unit
  }
  res.status(200).json(response);
});


app.get('/.well-known/ai-plugin.json', async (_, res) => {
  fs.readFile('./.well-known/ai-plugin.json', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error');
      return;
    }
    res.setHeader('Content-Type', 'application/json');
    res.status(200).send(data);
  });
});

app.get('/openapi.yaml', async (_, res) => {
  fs.readFile('openapi.yaml', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error');
      return;
    }
    res.setHeader('Content-Type', 'text/yaml');
    res.status(200).send(data);
  });
});

app.get('/logo.png', async (_, res) => {
  const filename = 'logo.png';
  res.sendFile(filename, { root: '.' });
});

const main = () => {
  app.listen(5003, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:5003');
  });
};

main();
