from textblob import TextBlob, Word, Blobber
from urllib3.exceptions import ProtocolError
import tweepy
import numpy as np
import itertools
import collections
import pandas as pd
import matplotlib.pyplot as plt
from wordcloud import WordCloud, STOPWORDS
import json
import seaborn as sns
from flask import Flask, request, jsonify
import nltk, re
import time
from bson import json_util
from flask_cors import CORS

nltk.download('stopwords')
from nltk.corpus import stopwords
from nltk.stem.porter import PorterStemmer
import pymongo
import os

API_KEY = "NrmHvUeDysnKRObAUkRkcDH6s"
API_SECRET_KEY = "s0YqX5h3cxlHQgByP6u8qsyOdDbJW4lL0YnayJJDnBdvMfhrBx"
ACCESS_TOKEN = "1246008382323998721-AWvGrsV2xIT6B7oEt3TqdFaySJW3Gi"
ACCESS_TOKEN_SECRET = "fVH2TldMJLlLXbuSRhFCSQqPwQRHVnioEtinBo6Q2qXAS"


app = Flask(__name__)
CORS(app)
# myclient = pymongo.MongoClient(MONGO_URI)
# mydb = myclient["tweets_db"]
# coll_db = mydb["tweets_collection"]

auth = tweepy.OAuthHandler(API_KEY, API_SECRET_KEY)
auth.set_access_token(ACCESS_TOKEN, ACCESS_TOKEN_SECRET)
api = tweepy.API(auth)

tweets_list = []
streams = []

def Clean_tweets(all_tweets):

    p=re.compile(r'\<http.+?\>', re.DOTALL)

    cleaned_tweets_list = []
    for i in range(0, len(all_tweets)):
        tweets_cleaned = re.sub('http[s]?://\S+', '', all_tweets[i])
        tweets_cleaned = re.sub('[^a-zA-Z]', ' ',tweets_cleaned)
        tweets_cleaned = re.sub(p, '', tweets_cleaned)
        tweets_cleaned = tweets_cleaned.lower()
        tweets_cleaned = tweets_cleaned.split()
        ps = PorterStemmer()
        all_stopwords = stopwords.words('english')
        all_stopwords.remove('not')
        tweets_cleaned = [ word for word in tweets_cleaned if not word in set(all_stopwords)]
        tweets_cleaned = ' '.join(tweets_cleaned)
        cleaned_tweets_list.append(tweets_cleaned)

    return cleaned_tweets_list

def getusertweet(username):
    track = ['covid', 'corona', 'covid19', 'coronavirus', 'facemask', 'sanitizer', 'social-distancing']
    user_tweets = []
    for status in tweepy.Cursor(api.user_timeline,screen_name=username, tweet_mode="extended",lang="en",include_rts=False).items():
        if len(user_tweets)<=10:
            print(len(user_tweets))
            lower = status.full_text.lower()
            for word in track:
                if word in lower :
                    tweet = {
                        'text' : status.full_text,
                    }
                    user_tweets.append(tweet)
        else:
            break
    return user_tweets

class TwitterStream(tweepy.StreamListener):

    def __init__(self, api=None):
        super(TwitterStream, self).__init__()
        for stream in streams:
            stream.disconnect()
        self.num_tweets = 0
    def on_connect(self):
        # Function called to connect to the Twitter Stream
        print("You are now connected to the Twitter streaming API.")

    def on_error(self, status_code):
        # Function displays the error or status code
        print('An Error has occured: ' + repr(status_code))
        return False

    def on_status(self, status,):
        # Function connects to the defined MongoDB and stores the filtered tweets
                if 'RT @' not in status.text and status.lang=='en':
                    if hasattr(status, 'extended_tweet'):
                        tweet_detail = {
                            'text': status.extended_tweet['full_text'],
                            'name': status.user.screen_name,
                            'location': status.user.location
                        }
                        tweets_list.append(tweet_detail)
                        self.num_tweets += 1
                        if self.num_tweets < 100    :
                            print(tweets_list)
                            return True
                        else:
                            return False


@app.route('/', )
def tweet_stream():
    listener = TwitterStream()
    streamer = tweepy.Stream(auth=auth, listener=listener, tweet_mode='extended')
    streams.append(streamer)
    streamer.filter(track=['covid', 'corona', 'covid19', 'coronavirus', 'facemask', 'sanitizer', 'social-distancing'],is_async=True)
    return jsonify(' STREAM started !!')

@app.route('/get_tweets',methods = ['GET'] )
def gettweets():

    tweet_dataframe = pd.DataFrame(tweets_list)
    all_tweets = tweet_dataframe['text']
    all_tweets = list(all_tweets)
    all_cleaned_tweets = Clean_tweets(all_tweets)
    all_tweets_polarity = []
    all_tweets_sentiments = []
    for tweet in all_cleaned_tweets:
        all_tweets_polarity.append(TextBlob(tweet).sentiment[0])
        if TextBlob(tweet).sentiment[0] > 0:
            all_tweets_sentiments.append('Positive')
        elif TextBlob(tweet).sentiment[0] < 0:
            all_tweets_sentiments.append('Negative')
        elif TextBlob(tweet).sentiment[0] == 0:
            all_tweets_sentiments.append('Neutral')

    tweet_dataframe['polarity'] = all_tweets_polarity
    tweet_dataframe['sentiment'] = all_tweets_sentiments

    main_output = tweet_dataframe.to_dict(orient="records")

    return json.dumps(main_output, default=json_util.default)



@app.route('/get_frequent_words',methods=['GET'])
def getfrequentwords():

    tweet_dataframe = pd.DataFrame(tweets_list)
    all_tweets = tweet_dataframe['text']
    all_tweets = list(all_tweets)
    all_cleaned_tweets = Clean_tweets(all_tweets)
    all_words = []
    for tweet in all_cleaned_tweets:
        res = tweet.split(" ")
        for x in res:
            all_words.append(x)
    counts_words = collections.Counter(all_words)
    words_dataframe = pd.DataFrame(counts_words.most_common(20), columns=['text', 'value'])
    main_output = words_dataframe.to_dict(orient="records")
    return json.dumps(main_output, default=json_util.default)


@app.route('/get_user/<user>',methods=['GET'])
def getuserdata(user):
    tweets = getusertweet(user)
    datafarame = pd.DataFrame(tweets)
    tweets_list = list(datafarame['text'])
    cleaned_tweet_list = Clean_tweets(tweets_list)
    all_tweets_polarity = []
    all_tweets_sentiments = []
    all_words = []
    for tweet in cleaned_tweet_list:
        res = tweet.split(" ")
        for x in res:
            all_words.append(x)
        all_tweets_polarity.append(TextBlob(tweet).sentiment[0])
        if TextBlob(tweet).sentiment[0] > 0:
            all_tweets_sentiments.append('Positive')
        elif TextBlob(tweet).sentiment[0] < 0:
            all_tweets_sentiments.append('Negative')
        elif TextBlob(tweet).sentiment[0] == 0:
            all_tweets_sentiments.append('Neutral')

    datafarame['polarity'] = all_tweets_polarity
    datafarame['sentiment'] = all_tweets_sentiments

    counts_words = collections.Counter(all_words)
    words_dataframe = pd.DataFrame(counts_words.most_common(20), columns=['text', 'value'])
    words_dataframe_dict = words_dataframe.to_dict(orient="records")
    main_output = datafarame.to_dict(orient="records")
    main_output.append(words_dataframe_dict)

    return json.dumps(main_output, default=json_util.default)


if __name__ == '__main__':

    app.run(debug=True)


