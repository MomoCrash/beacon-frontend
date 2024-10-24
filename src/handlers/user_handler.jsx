import bcrypt from 'bcryptjs'
import {GetUserByNameTag} from "./riot_handler.jsx";

const requestOptions = {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
}

export class User {

    constructor(mail, riotUsername, riotTag, puuid) {
        this.mail = mail;
        this.riotUsername = riotUsername
        this.riotTag = riotTag
        this.puuid = puuid;
    }

    async register(saltRounds, password) {
        if (!this.puuid) return
        await bcrypt.genSalt(saltRounds, (err, salt) => {
            bcrypt.hash(password, salt, (err, hash) => {
                let options = requestOptions
                options.body = '{"mail":"' + this.mail + '", "hash":"' + hash + '", "riotUsername":"' + this.riotUsername + '", "riotTag":"' + this.riotTag + '", "riotPuuid":"' + this.puuid + '"}';
                fetch( import.meta.env.VITE_BACKEND + 'user/register', options)
                    .then(response => {
                        localStorage.setItem("email", this.mail)
                        localStorage.setItem("riotTag", this.riotTag)
                        localStorage.setItem("riotName", this.riotUsername)
                        localStorage.setItem("riotPuuid", this.puuid)
                    })
                    .catch(err => console.log(err))
            });
        });
    }

    async login(password) {
        let options = requestOptions
        options.body = '{"mail":"' + this.mail + '"}'
        await fetch( import.meta.env.VITE_BACKEND + 'user/login', options)
            .then(response => response.json())
            .then(data => {
                bcrypt.compare(password, data[0].hash, function(err, result) {
                    if (result) {
                        localStorage.setItem("email", data[0].mail)
                        localStorage.setItem("riotTag", data[0].riotTag)
                        localStorage.setItem("riotName", data[0].riotName)
                        localStorage.setItem("riotPuuid", data[0].riotPuuid)
                    }
                });
            }).catch(err => console.log(err))
    }

    async GetPlayerData() {
        let options = requestOptions
        options.body = '{"mail":"' + this.mail + '"}'
        return await fetch(import.meta.env.VITE_BACKEND + 'user/data', options)
            .then(response => response.json())
            .catch(err => console.log(err))
    }

    async UpdatePlayerData(json_data) {
        let options = requestOptions
        options.body = '{"mail":"' + this.mail + '", "data": "' + json_data + '"}'
        await fetch(import.meta.env.VITE_BACKEND + 'user/data', options)
            .catch(err => console.log(err))
    }

    SetPuuid(puuid) {
        this.puuid = puuid;
    }

    getMail() {
        return this.mail
    }

}

export async function IsUserExist(user) {

    requestOptions.body = JSON.stringify({mail: user.getMail()});

    let playerExists = false

    await fetch(import.meta.env.VITE_BACKEND + 'user/exist', requestOptions)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                playerExists = true;
            }
        })
        .catch(err => console.log(err))

    console.log(playerExists)

    return playerExists

}

export async function Disconnect() {

    localStorage.removeItem('email')
    localStorage.removeItem('riotPuuid')
    localStorage.removeItem('riotTag')
    localStorage.removeItem('riotName')

}

export function GetUserSession() {
    return new User(localStorage.getItem('email'), localStorage.getItem("riotName"), localStorage.getItem('riotTag'), localStorage.getItem('riotPuuid'))
}

export async function TryToRegister(user, password) {

    let isUser = await IsUserExist(user);

    if (isUser) return false

    let userData = await GetUserByNameTag(user.riotUsername, user.riotTag, import.meta.env.VITE_API_KEY_RIOT)
    if (userData.puuid !== undefined) {
        user.SetPuuid(userData.puuid)
        await user.register(10, password)
        return true
    } else {
        return false
    }

}

export async function TryToLogin(user, password) {

    let isUser = await IsUserExist(user);

    if (!isUser) return false

    await user.login(password)
    return true;

}