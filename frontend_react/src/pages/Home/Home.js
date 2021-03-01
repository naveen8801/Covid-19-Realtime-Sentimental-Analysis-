import React, { useState, useEffect } from 'react';
  import { tweetsStream ,startStream} from '../../api';
import Navbar from '../../components/Navbar/Navbar';
import Tweets from '../../components/tweets/Tweets';
import styles from './home.module.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import Barchart from '../../components/Barchart/Barchart';
import Piechart from '../../components/Piechart/Piechart';
import Wordcloud from '../../components/wordcloud/Wordcloud';

function Home() {
  const [tweets, settweets] = useState([]);
  const [counter, setCounter] = useState();
  const [loader, setLoader] = useState(true);
  const [printtweetlist , setprintTweetList] = useState([])

  useEffect(async () => {
      const start = await startStream()
      
  }, [])


  const getTweetsStream = async () => {
    const stream = await tweetsStream();
    settweets(stream.data);
    const temp = tweets.reverse()
    setprintTweetList(temp)
    setLoader(false)    
  };

  useEffect(() => {
    getTweetsStream();
    setCounter(tweets.length);
  }, [tweets, counter]);

  console.log(tweets);
  return (
    <div className={styles.home_container}>
      <div className={styles.home_text_content}>
        <p className={styles.sub_text}>
          Welcome , This is
          <strong>
            'COVID-19 Sentimental Analysis Of Twitter Social Handle '
          </strong>
          through this dashboard you can easily analysis twitter tweets with
          their sentiments. Below here is live streaming of latest trending
          tweets .
        </p>
      </div>
      <hr className={styles.hr_liner}></hr>
      <div className={styles.home_main_content}>
        <div className={styles.visulaisation_div}>
          {loader ? <CircularProgress color="secondary" /> : (<div><Piechart/><Barchart/><Wordcloud/></div>)}
          
        </div>
        {loader ? (
          <CircularProgress color="secondary" />
        ) : (
          <div className={styles.tweets_show_div}>
            <div className={styles.counter_div} id="tweet_div">
              <h3>
                Tweets : <strong>{counter}</strong>
              </h3>
            </div>
            {printtweetlist.map((tweet) => {
              return (
                <Tweets
                  name={tweet.name}
                  polarity={tweet.polarity}
                  text={tweet.text}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
