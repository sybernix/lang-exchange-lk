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
        const options = {
            hostname: 'whatever.com',
            port: 443,
            path: '/todos',
            method: 'GET'
          }
          
          const req = https.request(options, res => {
            console.log(`statusCode: ${res.statusCode}`)
          
            res.on('data', d => {
              process.stdout.write(d)
            })
          })
          
          req.on('error', error => {
            console.error(error)
          })
          
          req.end()
        return {posts: allPosts, count: postsCount};
    }
};

export default {Query};
