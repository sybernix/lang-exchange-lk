import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';
import {withFilter} from 'apollo-server';

import {uploadToCloudinary} from '../utils/cloudinary';
import {generateToken} from '../utils/generate-token';
import {sendEmail} from '../utils/email';
import {pubSub} from '../utils/apollo-server';

import {IS_USER_ONLINE} from '../constants/Subscriptions';
import User from '../models/User';
import Post from '../models/Post';
import Like from '../models/Like';
import Follow from '../models/Follow';
import Comment from '../models/Comment';
import Message from '../models/Message';

const AUTH_TOKEN_EXPIRY = '1y';
const RESET_PASSWORD_TOKEN_EXPIRY = 3600000;

const Query = {
    /**
     * Gets the currently logged in user
     */
    getAuthUser: async (_, __, {req}) => {
        // If user is authenticated, update it's isOnline field to true
        const user = await User.findOneAndUpdate(
            {_id: mongoose.Types.ObjectId(req.authUserId)},
            {isOnline: true}
        )
            .populate({path: 'posts', options: {sort: {createdAt: 'desc'}}})
            .populate('likes')
            .populate('followers')
            .populate('following')
            .populate({
                path: 'notifications',
                populate: [
                    {path: 'author'},
                    {path: 'follow'},
                    {path: 'like', populate: {path: 'post'}},
                    {path: 'comment', populate: {path: 'post'}},
                    // {path: 'nativeLanguage', populate: {path: 'nativeLanguage'}},
                    // {path: 'targetLanguage', populate: {path: 'targetLanguage'}},
                ],
                match: {seen: false},
            });
        if (user == null) {
            return null;
        }
        user.newNotifications = user.notifications;

        // Find unseen messages
        const lastUnseenMessages = await Message.aggregate([
            {
                $match: {
                    receiver: mongoose.Types.ObjectId(req.authUserId),
                    seen: false,
                },
            },
            {
                $sort: {createdAt: -1},
            },
            {
                $group: {
                    _id: '$sender',
                    doc: {
                        $first: '$$ROOT',
                    },
                },
            },
            {$replaceRoot: {newRoot: '$doc'}},
            {
                $lookup: {
                    from: 'users',
                    localField: 'sender',
                    foreignField: '_id',
                    as: 'sender',
                },
            },
        ]);

        // Transform data
        const newConversations = [];
        lastUnseenMessages.map(u => {
            const user = {
                id: u.sender[0]._id,
                username: u.sender[0].username,
                fullName: u.sender[0].fullName,
                image: u.sender[0].image,
                lastMessage: u.message,
                lastMessageCreatedAt: u.createdAt,
            };

            newConversations.push(user);
        });

        // Sort users by last created messages date
        const sortedConversations = newConversations.sort((a, b) =>
            b.lastMessageCreatedAt.toString().localeCompare(a.lastMessageCreatedAt)
        );

        // Attach new conversations to auth User
        user.newConversations = sortedConversations;
        return user;
    },
    /**
     * Gets user by username
     *
     * @param {string} username
     */
    getUser: async (_, {username, id}) => {
        if (!username && !id) {
            throw new Error('username or id is required params.');
        }

        if (username && id) {
            throw new Error('please pass only username or only id as a param');
        }

        const query = username ? {username: username} : {_id: id};
        const user = await User.findOne(query)
            .populate({
                path: 'posts',
                populate: [
                    {
                        path: 'author',
                        populate: [
                            {path: 'followers'},
                            {path: 'following'},
                            {
                                path: 'notifications',
                                populate: [
                                    {path: 'author'},
                                    {path: 'follow'},
                                    {path: 'like'},
                                    {path: 'comment'},
                                ],
                            },
                        ],
                    },
                    {path: 'comments', populate: {path: 'author'}},
                    {path: 'likes'},
                ],
                options: {sort: {createdAt: 'desc'}},
            })
            .populate('likes')
            .populate('followers')
            .populate('following')
            .populate({
                path: 'notifications',
                populate: [
                    {path: 'author'},
                    {path: 'follow'},
                    {path: 'like'},
                    {path: 'comment'},
                ],
            });

        if (!user) {
            throw new Error("User with given params doesn't exists.");
        }

        return user;
    },
    /**
     * Gets user posts by username
     *
     * @param {string} username
     * @param {int} skip how many posts to skip
     * @param {int} limit how many posts to limit
     */
    getUserPosts: async (_, {username, skip, limit}) => {
        const user = await User.findOne({username}).select('_id');

        const query = {author: user._id};
        const count = await Post.find(query).countDocuments();
        const posts = await Post.find(query)
            .populate({
                path: 'author',
                populate: [
                    {path: 'following'},
                    {path: 'followers'},
                    {
                        path: 'notifications',
                        populate: [
                            {path: 'author'},
                            {path: 'follow'},
                            {path: 'like'},
                            {path: 'comment'},
                        ],
                    },
                ],
            })
            .populate('likes')
            .populate({
                path: 'comments',
                options: {sort: {createdAt: 'desc'}},
                populate: {path: 'author'},
            })
            .skip(skip)
            .limit(limit)
            .sort({createdAt: 'desc'});

        return {posts, count};
    },
    /**
     * Gets all users
     *
     * @param {string} userId
     * @param {int} skip how many users to skip
     * @param {int} limit how many users to limit
     */
    getUsers: async (_, {userId, skip, limit}) => {
        // Find user ids, that current user follows
        const userFollowing = [];
        const follow = await Follow.find({follower: userId}, {_id: 0}).select(
            'user'
        );
        follow.map(f => userFollowing.push(f.user));

        // Find users that user is not following
        const query = {
            $and: [{_id: {$ne: userId}}, {_id: {$nin: userFollowing}}],
        };
        const count = await User.where(query).countDocuments();
        const users = await User.find(query)
            .populate('followers')
            .populate('following')
            .populate({
                path: 'notifications',
                populate: [
                    {path: 'author'},
                    {path: 'follow'},
                    {path: 'like'},
                    {path: 'comment'},
                ],
            })
            .skip(skip)
            .limit(limit)
            .sort({createdAt: 'desc'});

        return {users, count};
    },
    /**
     * Gets potential language exchange partners who speak the user's target language and
     * learning user's native language
     *
     * @param {string} userId
     * @param {int} skip how many users to skip
     * @param {int} limit how many users to limit
     */
    getPotentialPartners: async (_, {userId, city, sex, age, skip, limit}) => {
        // Find user ids, that current user follows
        const userFollowing = [];
        const follow = await Follow.find({follower: userId}, {_id: 0}).select(
            'user'
        );
        follow.map(f => userFollowing.push(f.user));

        //Find the native and target language of the current user with userId
        const queryToFindLangInfo = {
            $and: [{_id: userId}],
        };
        const currentUser = await User.find(queryToFindLangInfo);

        // Find users that user is not following
        let query = {
            $and: [{_id: {$ne: userId}}, {_id: {$nin: userFollowing}}, {targetLanguage: currentUser["0"].nativeLanguage}, 
            {nativeLanguage: currentUser["0"].targetLanguage}]
        };
        if (city != "") {
            query["$and"].push({city: city});
        }
        if (sex != "") {
            query["$and"].push({sex: sex});
        }
        if (age != "") {
            const ageRange = age.split('-');
            var startDate = new Date();
            startDate.setFullYear( startDate.getFullYear() - parseInt(ageRange[1]) );
            console.log(startDate);
            var endDate = new Date();
            endDate.setFullYear( endDate.getFullYear() - parseInt(ageRange[0]) );
            console.log(endDate);
            query["$and"].push({dateOfBirth: {$gte : startDate, $lt : endDate}});
        }
        
        const count = await User.where(query).countDocuments();
        const users = await User.find(query)
            .populate('followers')
            .populate('following')
            .populate({
                path: 'notifications',
                populate: [
                    {path: 'author'},
                    {path: 'follow'},
                    {path: 'like'},
                    {path: 'comment'},
                ],
            })
            .skip(skip)
            .limit(limit)
            .sort({createdAt: 'desc'});

        return {users, count};
    },
    /**
     * Searches users by username or fullName
     *
     * @param {string} searchQuery
     */
    searchUsers: async (_, {searchQuery}, {req}) => {
        // Return an empty array if searchQuery isn't presented
        if (!searchQuery) {
            return [];
        }

        const users = User.find({
            $or: [
                {username: new RegExp(searchQuery, 'i')},
                {fullName: new RegExp(searchQuery, 'i')},
            ],
            _id: {
                $ne: req.authUserId,
            },
        }).limit(50);

        return users;
    },
    /**
     * Gets Randomly Suggested learners for user
     *
     * @param {string} userId
     */
    suggestLearners: async (_, {userId}) => {
        const LIMIT = 6;

        // Find who user follows
        const userFollowing = [];
        const following = await Follow.find(
            {follower: userId},
            {_id: 0}
        ).select('user');
        following.map(f => userFollowing.push(f.user));
        // userFollowing.push(userId);

        //Find the native and target language of the current user with userId
        const queryToFindLangInfo = {
            $and: [{_id: userId}],
        };
        const currentUser = await User.find(queryToFindLangInfo);

        // Find random users
        const query = {$and: [{_id: {$nin: userFollowing}}, {targetLanguage: currentUser["0"].nativeLanguage}, {nativeLanguage: currentUser["0"].targetLanguage}]};
        const usersCount = await User.where(query).countDocuments();
        let random = Math.floor(Math.random() * usersCount);

        const usersLeft = usersCount - random;
        if (usersLeft < LIMIT) {
            random = random - (LIMIT - usersLeft);
            if (random < 0) {
                random = 0;
            }
        }

        const randomUsers = await User.find(query)
            .skip(random)
            .limit(LIMIT);

        return randomUsers;
    },
    /**
     * Gets the list of users who are learning the same language as the auth user
     *
     * @param {string} userId
     */
    getForumUsers: async (_, {userId}) => {
        const LIMIT = 6;

        // Find who user follows
        const userFollowing = [];
        const following = await Follow.find(
            {follower: userId},
            {_id: 0}
        ).select('user');
        following.map(f => userFollowing.push(f.user));
        // userFollowing.push(userId);

        //Find the native and target language of the current user with userId
        const queryToFindLangInfo = {
            $and: [{_id: userId}],
        };
        const currentUser = await User.find(queryToFindLangInfo);

        // Find random users
        const query = {$and: [{_id: {$nin: userFollowing}}, {targetLanguage: currentUser["0"].targetLanguage}]};
        const usersCount = await User.where(query).countDocuments();
        let random = Math.floor(Math.random() * usersCount);

        const usersLeft = usersCount - random;
        if (usersLeft < LIMIT) {
            random = random - (LIMIT - usersLeft);
            if (random < 0) {
                random = 0;
            }
        }

        const randomUsers = await User.find(query)
            .skip(random)
            .limit(LIMIT);

        return randomUsers;
    },
    /**
     * Gets Algorithmically Suggested learners for user
     *
     * @param {string} userId
     */
    suggestLearnersWithScore: async (_, {userId}) => {
        const LIMIT = 6;

        // Find the list of users the auth user follows
        const userFollows = [];
        const userFollowsTemp = await Follow.find(
            {follower: userId},
            {_id: 0}
        ).select('user');
        userFollowsTemp.map(f => userFollows.push(String(f.user)));

        // Retrieve list of posts liked by auth user
        const userLikes = [];
        const userLikesTemp = await Like.find({user: userId}, {_id: 0, createdAt: 0, updatedAt: 0, user: 0});
        userLikesTemp.map(f => userLikes.push(String(f.post)));

        // Retrieve list of posts liked by auth user
        const userComments = [];
        const userCommentsTemp = await Comment.find({author: userId}, {_id: 0, createdAt: 0, updatedAt: 0, author: 0, comment: 0});
        userCommentsTemp.map(f => userComments.push(String(f.post)));

        // Find the list of users who follow the auth user
        const userFollowedBy = [];
        const userFollowedByTemp = await Follow.find(
            {user: userId},
            {_id: 0}
        ).select('user');
        userFollowedByTemp.map(f => userFollowedBy.push(String(f.user)));

        //Find the native and target language of the current user with userId
        const authUser = await User.find({_id: userId});

        // build score
        let scores = {};
        const query = {$and: [{_id: {$nin: userFollows}}, {targetLanguage: authUser[0].nativeLanguage}, {nativeLanguage: authUser[0].targetLanguage}]};
        const potentialPartners = await User.find(query).select('_id');
        potentialPartners.map(f => scores[f._id] = 0);

        for (const ppId in scores) {
            // Find the list of users the pp follows
            const ppFollows = [];
            const ppFollowsTemp = await Follow.find(
                {follower: ppId},
                {_id: 0}
            ).select('user');
            ppFollowsTemp.map(f => ppFollows.push(String(f.user)));

            // Find the list of users who follow the pp
            const ppFollowedBy = [];
            const ppFollowedByTemp = await Follow.find(
                {user: ppId},
                {_id: 0}
            ).select('user');
            ppFollowedByTemp.map(f => ppFollowedBy.push(String(f.user)));

            // Increase score by 100 if pp follows auth user
            if (ppFollows.some(f => f === userId)) {
                scores[ppId] = scores[ppId] + 100;
            };
            // Increase score by 2 for each common user followed by auth user and pp
            scores[ppId] = scores[ppId] + 2 * ppFollows.filter(value => userFollows.includes(value)).length

            // Increase score by 2 for each X, auth user follows X and X follows pp
            scores[ppId] = scores[ppId] + 2 * ppFollowedBy.filter(value => userFollows.includes(value)).length

            // Increase score by 2 for each X, X follows auth user and pp
            scores[ppId] = scores[ppId] + 2 * ppFollowedBy.filter(value => userFollowedBy.includes(value)).length

            // Increase score by 2 for each X, PP follows X follows auth user
            scores[ppId] = scores[ppId] + 2 * ppFollows.filter(value => userFollowedBy.includes(value)).length

            const potentialPartner = await User.find({_id: ppId});

            // Increase score by 10 if the PP and auth user are from the same city
            if (potentialPartner[0].city == authUser[0].city) {
                scores[ppId] = scores[ppId] + 10;
            }

            // Increase score by 10 if the age of the PP and auth user are within 5 years of each other
            // and by 5 if they are within 10 years of each other
            if (Math.abs(potentialPartner[0].age - authUser[0].age) <= 5) {
                scores[ppId] = scores[ppId] + 10;
            } else if (Math.abs(potentialPartner[0].age - authUser[0].age) <= 10) {
                scores[ppId] = scores[ppId] + 5;
            }

            // Retrieve list of posts liked by PP
            const ppLikes = [];
            const ppLikesTemp = await Like.find({user: ppId}, {_id: 0, createdAt: 0, updatedAt: 0, user: 0});
            ppLikesTemp.map(f => ppLikes.push(String(f.post)));

            // Increase score by 1 for each common post liked by by auth user and pp
            scores[ppId] = scores[ppId] + 1 * ppLikes.filter(value => userLikes.includes(value)).length;

            // Increase score by 3 for each post by PP liked by auth user
            scores[ppId] = scores[ppId] + 3 * userLikesTemp.filter((obj) => obj.postAuthor == ppId).length;

            // Increase score by 3 for each post by auth user liked by PP
            scores[ppId] = scores[ppId] + 3 * ppLikesTemp.filter((obj) => obj.postAuthor == userId).length;

            // Retrieve list of posts liked by auth user
            const ppComments = [];
            const ppCommentsTemp = await Comment.find({author: ppId}, {_id: 0, createdAt: 0, updatedAt: 0, author: 0, comment: 0});
            ppCommentsTemp.map(f => ppComments.push(String(f.post)));
            
            // Increase score by 1 for each common post commented by by auth user and pp
            scores[ppId] = scores[ppId] + 1 * ppComments.filter(value => userComments.includes(value)).length;

            // Increase score by 5 for each post by PP commented by auth user
            scores[ppId] = scores[ppId] + 5 * userCommentsTemp.filter((obj) => obj.postAuthor == ppId).length;

            // Increase score by 5 for each post by auth user commented by PP
            scores[ppId] = scores[ppId] + 5 * ppCommentsTemp.filter((obj) => obj.postAuthor == userId).length;
        }

        // sort the pp in descending order of score
        var sortableScores = [];
        for (var ppId in scores) {
            sortableScores.push([ppId, scores[ppId]]);
        }

        sortableScores.sort(function(a, b) {
            return b[1] - a[1];
        });

        let topMatchIds = [];
        sortableScores.map(f => topMatchIds.push(String(f[0])));

        const numMatches = Math.min(LIMIT, topMatchIds.length);
        const queryTopMatches = {_id: {$in: topMatchIds}};
        const topMatches = await User.find(queryTopMatches).limit(numMatches);
        let topMatchesOrdered = [];
        for (let i = 0; i < numMatches; i++) {
            topMatches.forEach(element => {
                if (element._id == topMatchIds[i]) {
                    topMatchesOrdered.push(element);
                }
            });
        }
        return topMatchesOrdered;
    },
    /**
     * Verifies reset password token
     *
     * @param {string} email
     * @param {string} token
     */
    verifyResetPasswordToken: async (_, {email, token}) => {
        // Check if user exists and token is valid
        const user = await User.findOne({
            email,
            passwordResetToken: token,
            passwordResetTokenExpiry: {
                $gte: Date.now() - RESET_PASSWORD_TOKEN_EXPIRY,
            },
        });
        if (!user) {
            throw new Error('This token is either invalid or expired!');
        }

        return {message: 'Success'};
    },
};

const Mutation = {
    /**
     * Signs in user
     *
     * @param {string} emailOrUsername
     * @param {string} password
     */
    signin: async (_, {input: {emailOrUsername, password}}) => {
        const user = await User.findOne().or([
            {email: emailOrUsername},
            {username: emailOrUsername},
        ]);

        if (!user) {
            throw new Error('User not found.');
        }

        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            throw new Error('Invalid password.');
        }

        return {
            token: generateToken(user, process.env.SECRET, AUTH_TOKEN_EXPIRY),
            authUserId: user._id,
            authUserEmail: user.email
        };
    },
    /**
     * Signs up user
     *
     * @param {string} fullName
     * @param {string} email
     * @param {string} username
     * @param {string} password
     */
    signup: async (_, {input: {fullName, email, username, password, nativeLanguage, targetLanguage}}) => {
        // Check if user with given email or username already exists
        const user = await User.findOne().or([{email}, {username}]);
        if (user) {
            const field = user.email === email ? 'email' : 'username';
            throw new Error(`User with given ${field} already exists.`);
        }

        // Empty field validation
        if (!fullName || !email || !username || !password || !nativeLanguage || !targetLanguage) {
            throw new Error('All fields are required.');
        }

        // FullName validation
        if (fullName.length > 40) {
            throw new Error('Full name no more than 40 characters.');
        }
        if (fullName.length < 4) {
            throw new Error('Full name min 4 characters.');
        }

        // Email validation
        const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (!emailRegex.test(String(email).toLowerCase())) {
            throw new Error('Enter a valid email address.');
        }

        // Username validation
        const usernameRegex = /^(?!.*\.\.)(?!.*\.$)[^\W][\w.]{0,29}$/;
        if (!usernameRegex.test(username)) {
            throw new Error(
                'Usernames can only use letters, numbers, underscores and periods.'
            );
        }
        if (username.length > 20) {
            throw new Error('Username no more than 50 characters.');
        }
        if (username.length < 3) {
            throw new Error('Username min 3 characters.');
        }
        const frontEndPages = [
            'forgot-password',
            'reset-password',
            'explore',
            'edit-info',
            'learners',
            'notifications',
            'post',
        ];
        if (frontEndPages.includes(username)) {
            throw new Error("This username isn't available. Please try another.");
        }

        // Password validation
        if (password.length < 6) {
            throw new Error('Password min 6 characters.');
        }

        const newUser = await new User({
            fullName,
            email,
            username,
            password,
            nativeLanguage,
            targetLanguage,
        }).save();

        return {
            token: generateToken(newUser, process.env.SECRET, AUTH_TOKEN_EXPIRY),
        };
    },
    /**
     * Creates introduction text to user
     *
     * @param {string} introductionText
     * @param {string} userId
     */
    addIntroduction: async (_, {input: {introductionText, userId}}) => {
        if (!introductionText ) {
            throw new Error('Introduction text is required is required.');
        }

        // Check if user exists
        const user = await User.findOne({_id: userId});
        if (!user) {
            throw new Error('No user found with the provided id');
        }
        user.introduction = introductionText;
        await user.save();

        // Return success message
        return {
            message: `Introduction successfully added`,
        };
    },
    updateAccountInfo: async (_, {input: {id, fullName, email, nativeLanguage, targetLanguage, introduction, dateOfBirth, sex, city}}) => {
        // Check if user exists
        const user = await User.findOne({_id: id});
        if (!user) {
            throw new Error('No user found with the provided id');
        }
        let updated = false;
        if (fullName) {
            user.fullName = fullName;
            updated = true;
        }
        if (email) {
            user.email = email;
            updated = true;
        }
        if (nativeLanguage) {
            user.nativeLanguage = nativeLanguage;
            updated = true;
        }
        if (targetLanguage) {
            user.targetLanguage = targetLanguage;
            updated = true;
        }
        if (introduction) {
            user.introduction = introduction;
            updated = true;
        }
        if (dateOfBirth) {
            user.dateOfBirth = dateOfBirth;
            updated = true;
        }
        if (sex) {
            user.sex = sex;
            updated = true;
        }
        if (city) {
            user.city = city;
            updated = true;
        }
        if (updated === false) {
            return {
                message: `No update was performed`,
            };
        }
        await user.save();
        // Return success message
        return {
            message: `Account information successfully updated`,
        };
    },
    /**
     * Requests reset password
     *
     * @param {string} email
     */
    requestPasswordReset: async (_, {input: {email}}) => {
        // Check if user exists
        const user = await User.findOne({email});
        if (!user) {
            throw new Error(`No such user found for email ${email}.`);
        }

        // Set password reset token and it's expiry
        const token = generateToken(
            user,
            process.env.SECRET,
            RESET_PASSWORD_TOKEN_EXPIRY
        );
        const tokenExpiry = Date.now() + RESET_PASSWORD_TOKEN_EXPIRY;
        await User.findOneAndUpdate(
            {_id: user.id},
            {passwordResetToken: token, passwordResetTokenExpiry: tokenExpiry},
            {new: true}
        );

        // Email user reset link
        const resetLink = `${process.env.FRONTEND_URL}/reset-password?email=${email}&token=${token}`;
        const mailOptions = {
            to: email,
            subject: 'Password Reset',
            html: resetLink,
        };

        await sendEmail(mailOptions);

        // Return success message
        return {
            message: `A link to reset your password has been sent to ${email}`,
        };
    },
    /**
     * Resets user password
     *
     * @param {string} email
     * @param {string} token
     * @param {string} password
     */
    resetPassword: async (_, {input: {email, token, password}}) => {
        if (!password) {
            throw new Error('Enter password and Confirm password.');
        }

        if (password.length < 6) {
            throw new Error('Password min 6 characters.');
        }

        // Check if user exists and token is valid
        const user = await User.findOne({
            email,
            passwordResetToken: token,
            passwordResetTokenExpiry: {
                $gte: Date.now() - RESET_PASSWORD_TOKEN_EXPIRY,
            },
        });
        if (!user) {
            throw new Error('This token is either invalid or expired!.');
        }

        // Update password, reset token and it's expiry
        user.passwordResetToken = '';
        user.passwordResetTokenExpiry = '';
        user.password = password;
        await user.save();

        // Return success message
        return {
            token: generateToken(user, process.env.SECRET, AUTH_TOKEN_EXPIRY),
        };
    },
    /**
     * Uploads user Profile or Cover photo
     *
     * @param {string} id
     * @param {obj} image
     * @param {string} imagePublicId
     * @param {bool} isCover is Cover or Profile photo
     */
    uploadUserPhoto: async (_, {input: {id, image, imagePublicId, isCover}}) => {
        const {createReadStream} = await image;
        const stream = createReadStream();
        const uploadImage = await uploadToCloudinary(stream, 'user', imagePublicId);

        if (uploadImage.secure_url) {
            const fieldsToUpdate = {};
            if (isCover) {
                fieldsToUpdate.coverImage = uploadImage.secure_url;
                fieldsToUpdate.coverImagePublicId = uploadImage.public_id;
            } else {
                fieldsToUpdate.image = uploadImage.secure_url;
                fieldsToUpdate.imagePublicId = uploadImage.public_id;
            }

            const updatedUser = await User.findOneAndUpdate(
                {_id: id},
                {...fieldsToUpdate},
                {new: true}
            )
                .populate('posts')
                .populate('likes');

            return updatedUser;
        }

        throw new Error(
            'Something went wrong while uploading image to Cloudinary.'
        );
    },
};

const Subscription = {
    /**
     * Subscribes to user's isOnline change event
     */
    isUserOnline: {
        subscribe: withFilter(
            () => pubSub.asyncIterator(IS_USER_ONLINE),
            (payload, variables, {authUser}) => variables.authUserId === authUser.id
        ),
    },
};

export default {Query, Mutation, Subscription};
