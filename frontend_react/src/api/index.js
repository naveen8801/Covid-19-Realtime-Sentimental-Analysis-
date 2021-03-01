import axios from 'axios';

export const url = 'http://127.0.0.1:5000';

export const startStream = () => axios.get(`${url}/`);
export const tweetsStream = () => axios.get(`${url}/get_tweets`);
export const frequentwords = () => axios.get(`${url}/get_frequent_words`);
export const getuserTweets = (username) => axios.get(`${url}/get_user/${username}`);
