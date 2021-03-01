import { StylesProvider } from '@material-ui/core';
import React from 'react';
import styles from './tweets.module.css';
import TwitterIcon from '@material-ui/icons/Twitter';

function Tweets(props) {
    let sentiment = <h1></h1>
  if (props.polarity === 0) {
    sentiment = (
      <div className={styles.setiment_neutral}>
        <h3>Neutral</h3>
      </div>
    );
  } else if (props.polarity > 0) {
    sentiment = (
      <div className={styles.setiment_positive}>
        <h3>Positive</h3>
      </div>
    );
  } else if (props.polarity < 0) {
    sentiment = (
      <div className={styles.setiment_negative}>
        <h3>Negative</h3>
      </div>
    );
  }
  return (
    <div className={styles.tweets_container}>
      <div className={styles.name_logo}>
        <TwitterIcon className={styles.twitter_icon} />
        <h4 className={styles.name}>
          <strong>{props.name}</strong>
        </h4>
      </div>

      <div className={styles.tweet_body}>
        <p>{props.text}</p>
      </div>
      {sentiment}
    </div>
  );
}

export default Tweets;
