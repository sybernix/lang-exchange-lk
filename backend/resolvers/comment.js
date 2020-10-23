import User from '../models/User';
import Post from '../models/Post';
import Comment from '../models/Comment';

const Mutation = {
    /**
     * Creates a post comment
     *
     * @param {string} comment
     * @param {string} author author id
     * @param {string} postId
     */
    createComment: async (_, {input: {comment, author, postId}}) => {
        const commentedPost = await Post.find({_id: postId}).select('author');
        const newComment = await new Comment({
            comment,
            author,
            post: postId,
            postAuthor: commentedPost[0].author
        }).save();

        // Push comment to post collection
        await Post.findOneAndUpdate(
            {_id: postId},
            {$push: {comments: newComment.id}}
        );
        // Push comment to user collection
        await User.findOneAndUpdate(
            {_id: author},
            {$push: {comments: newComment.id}}
        );

        return newComment;
    },
    /**
     * Deletes a post comment
     *
     * @param {string} id
     */
    deleteComment: async (_, {input: {id}}) => {
        const comment = await Comment.findByIdAndRemove(id);

        // Delete comment from users collection
        await User.findOneAndUpdate(
            {_id: comment.author},
            {$pull: {comments: comment.id}}
        );
        // Delete comment from posts collection
        await Post.findOneAndUpdate(
            {_id: comment.post},
            {$pull: {comments: comment.id}}
        );

        return comment;
    },
};

export default {Mutation};
