const postOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
}

/*
 * Get a user infos with user puuid
 */
export async function GetUserByPuuid(puuid) {

    let localRiotQuery = import.meta.env.VITE_BACKEND + "riot/user/puuid"
    postOptions.body = JSON.stringify({
        puuid: puuid,
    })

    return await fetch( localRiotQuery, postOptions)
        .then(response => response.json())
        .then(result => {
            return result
        })
        .catch(error => {
            console.log(error);
            window.stop();
        });
}

/*
 * Get a user infos with username and game tag
 */
export async function GetUserByNameTag(userName, gameTag) {

    let localRiotQuery = import.meta.env.VITE_BACKEND + "riot/user/gametag"
    postOptions.body = JSON.stringify({
        userName: userName,
        gameTag: gameTag
    })

    return await fetch( localRiotQuery, postOptions)
        .then(response => response.json())
        .then(result => {
            return result
        })
        .catch(error => {
            console.log(error);
            window.stop();
        });
}

export async function GetMatchData(matchId) {

    let localRiotQuery = import.meta.env.VITE_BACKEND + "riot/match/"
    postOptions.body = JSON.stringify({
        matchId: matchId
    })

    return await fetch(localRiotQuery, postOptions)
        .then(response => response.json())
        .then(matchData => {
            return matchData;
        })
        .catch(error => {
            console.log(error);
            window.stop();
        });

}

/*
 * Get player last matches data in a period (in days) with a maximum of count
 * @param puuid id of player
 * @param period in days
 * @param count number of matches
 * @param queue queueID https://static.developer.riotgames.com/docs/lol/queues.json
 * @param apikey the API key
 */
export async function GetPlayerLastMatches(puuid, period, count) {

    let end_point = Math.floor(Date.now() / 1000)
    let start_point = end_point - 60 * 60 * 24 * period
    {/*
    if (queue !== -1)
    {
        riotQuery = "https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuid + "/ids?startTime=" + start_point + "&endTime=" + end_point + "&queue="+ queue +"&start=0&count=" + count + "&api_key=" + apiKey;
    }
    else
    {
        riotQuery = "https://europe.api.riotgames.com/lol/match/v5/matches/by-puuid/" + puuid + "/ids?startTime=" + start_point + "&endTime=" + end_point + "&start=0&count=" + count + "&api_key=" + apiKey;
    }
    */}
    let localRiotQuery = import.meta.env.VITE_BACKEND + "riot/user/matches"
    let localBaseQuery = import.meta.env.VITE_BACKEND + "match/data/"

    let matchesData = [];

    postOptions.body = JSON.stringify({
        puuid: puuid,
        startTime: start_point,
        endTime: end_point,
        count: count
    });

    await fetch(localRiotQuery, postOptions)
        .then(response => response.json())
        .then(async matchIds => {

            console.log(matchIds)

            for (const matchId of matchIds) {
                let localQuery = localBaseQuery + matchId
                let loadedFromDatabase = false

                await fetch(localQuery, postOptions)
                    .then(response => response.json())
                    .then(async matches => {
                        if (matches.length > 0) {
                            matchesData.push(matches[0])
                            loadedFromDatabase = true
                        }
                    })

                if (!loadedFromDatabase) {

                    let matchData = await GetMatchData(matchId)

                    let options = postOptions
                    options.body = {
                        id: matchData.metadata.matchId,
                        data: matchData.info
                    }
                    matchesData.push(options.body)
                    options.body = JSON.stringify(options.body)

                    {/*console.log(options)*/}

                    await fetch(import.meta.env.VITE_BACKEND + "match/data/create/", options)
                        .then(result => result.json())

                }
            }

        }).catch(async error => {
            console.log("Le service riot est indisponible... Error : " + error.message)
        });

    return matchesData

}