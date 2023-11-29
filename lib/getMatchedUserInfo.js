// Function to get only the matched user from the matches collection
const getMatchedUserInfo = ( users, userLoggedIn ) => {
    const newUsers = {...users };
    delete newUsers[userLoggedIn];

    const [id, user] = Object.entries(newUsers).flat();

    return { id, ...user };
}

export default getMatchedUserInfo;