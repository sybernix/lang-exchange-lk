const https = require('https')

const Query = {
    /**
     * Translate text from one language to another
     *
     * @param {string} text text to translate
     * @param {string} fromLang the original language of the text
     * @param {string} toLang the language to which the text should be translated
     */
    getTranslation: async (root, {text, fromLang, toLang}, {Post}) => {
        const options = new URL('https://translation.googleapis.com/language/translate/v2?target=fr&q=hello&key=' + process.env.GOOGLE_API_KEY);
          
          const req = https.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)
            console.log(`res: ${res}`)
          
            res.on('data', d => {
                process.stdout.write(d)
                console.log(d);
                return {translatedText: d, language: 'dummy'};
            })
          })
          
          req.on('error', error => {
            console.error(error)
          })
          
          req.end()
        // return {translatedText: 'fail', language: 'fail'};
    }
};

export default {Query};
