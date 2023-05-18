import express from 'express';
import cors from 'cors';
import fs from 'fs';
import { json } from 'body-parser';

import units from '../data.json'  

const app = express();

app.use(cors({
  origin: 'https://chat.openai.com'
}));
app.use(json());

interface UserState {
  currentUnit: {
    unit: number;
    content: unknown;
  };
}

const state: UserState = {
  currentUnit: {
    unit: 1,
    content: units['Unit 1']
  }
};

app.post('/setUnit/:unitNumber', async (req, res) => {
  const unitNumber = req.params.unitNumber;
  const unitName = `Unit ${unitNumber}` as keyof typeof units;


  if(units.hasOwnProperty(unitName)) {
    const content = units[unitName];
    state.currentUnit.unit = parseInt(unitNumber);
    state.currentUnit.content = content;
    res.status(200).json("The level was set to"+ unitName);
  } 
  res.status(400).json();
});

app.get('/teachUnit', async (req, res) => {

    const response = {
      gptPrompt: "You will roleplay as a german native speaker teacher, you will " + 
                  "tell the user the content of the unit and generate a small and brief lesson for the user to learn," + 
                  "you will not translate anything until asked and you will explain the logic behind every lesson",
      unitContent: state.currentUnit.content,
      unitNumber: state.currentUnit.unit
    }

    res.status(200).json(response);

});

app.get('/conversation', async (req, res) => {

  const response = {
    gptPrompt: "You will act as a german native speaker teacher, you will " + 
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

const main = () => {
  app.listen(5003, '0.0.0.0', () => {
    console.log('Server running on http://0.0.0.0:5003');
  });
};

main();
