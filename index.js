const express = require("express");
const app = express();
const dotenv = require("dotenv");
const axios = require("axios").default;
const cors = require("cors");

dotenv.config();
const PORT = 5000;

app.use(cors());

app.get('/word', (req, res) => {
    const options = {
        method: 'GET',
        url: 'https://random-words5.p.rapidapi.com/getRandom',
        params: {wordLength: '5'},
        headers: {
          'X-RapidAPI-Host': 'random-words5.p.rapidapi.com',
          'X-RapidAPI-Key': process.env.RAPID_API_KEY
        }
      };
      
      axios.request(options).then((response) => {
          console.log(response.data);
          res.json(response.data);
      }).catch((error) => {
          console.error(error);
      });
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

