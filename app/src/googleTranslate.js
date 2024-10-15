'use strict';

require('dotenv').config();
const projectId = process.env.project_id;
const location = 'global';
const {Translate} = require('@google-cloud/translate').v2;
const translate = new Translate();

async function translateText(text, target) {
    if (!text || !target) {
        console.error('Text or target language is not set.');
        return '';
    }

    try {
        let retval = '';
        let [translations] = await translate.translate(text, target);
        translations = Array.isArray(translations) ? translations : [translations];
        translations.forEach((translation, i) => {
          console.log(`${text[i]} => (${target}) ${translation}`);
          retval += translation;
        });
        return retval;
    } catch (error) {
        console.error('Error during translation:', error);
        return '';
    }
}

module.exports = {translateText};