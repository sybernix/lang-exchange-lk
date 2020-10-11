
const Query = {
    /**
     * Translate text from one language to another
     *
     * @param {string} text text to translate
     * @param {string} fromLang the original language of the text
     * @param {string} toLang the language to which the text should be translated
     */
    getTranslation: async (root, {text, fromLang, toLang}, {Post}) => {
        return {posts: allPosts, count: postsCount};
    }
};

export default {Query};
