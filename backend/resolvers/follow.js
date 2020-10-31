import User from '../models/User';
import Follow from '../models/Follow';

const Query = {
    /**
     * Gets followers of a specific user
     *
     * @param {string} username
     * @param {int} skip how many notifications to skip
     * @param {int} limit how many notifications to limit
     */
    getFollowers: async (_, {username, skip, limit}) => {
        const user = await User.find({username: username}).select('_id');
        const followersId = [];
        const result = await Follow.find({user: user[0]._id}, {_id: 0}).select('follower');
        result.map(f => followersId.push(f.follower));

        const query = {_id: {$in: followersId}};
        const followers = await User.find(query)
            .skip(skip)
            .limit(limit);

        return followers;
    },
    /**
     * Gets the list of users a user follows
     *
     * @param {string} username
     * @param {int} skip how many notifications to skip
     * @param {int} limit how many notifications to limit
     */
    getUsersFollowedByUser: async (_, {username, skip, limit}) => {
        const user = await User.find({username: username}).select('_id');
        const usersFollowedByUserIds = [];
        const result = await Follow.find({follower: user[0]._id}, {_id: 0}).select('user');
        result.map(f => usersFollowedByUserIds.push(f.user));

        const query = {_id: {$in: usersFollowedByUserIds}};
        const usersFollowedByUser = await User.find(query)
            .skip(skip)
            .limit(limit);

        return usersFollowedByUser;
    },
};

const Mutation = {
    /**
     * Creates a following/follower relationship between users
     *
     * @param {string} userId
     * @param {string} followerId
     */
    createFollow: async (_, {input: {userId, followerId}}) => {
        const follow = await new Follow({
            user: userId,
            follower: followerId,
        }).save();

        // Push follower/following to user collection
        await User.findOneAndUpdate(
            {_id: userId},
            {$push: {followers: follow.id}}
        );
        await User.findOneAndUpdate(
            {_id: followerId},
            {$push: {following: follow.id}}
        );

        return follow;
    },
    /**
     * Deletes a following/follower relationship between users
     *
     * @param {string} id follow id
     */
    deleteFollow: async (_, {input: {id}}) => {
        const follow = await Follow.findByIdAndRemove(id);

        // Delete follow from users collection
        await User.findOneAndUpdate(
            {_id: follow.user},
            {$pull: {followers: follow.id}}
        );
        await User.findOneAndUpdate(
            {_id: follow.follower},
            {$pull: {following: follow.id}}
        );

        return follow;
    },
};

export default { Query, Mutation };
