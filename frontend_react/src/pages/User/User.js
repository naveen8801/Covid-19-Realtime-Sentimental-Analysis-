import React, { useState, useEffect } from 'react';
import Form_user from '../../components/Form_user/Form_user';
import styles from './user.module.css';
import CircularProgress from '@material-ui/core/CircularProgress';
import { getuserTweets } from '../../api';
import { Bar } from 'react-chartjs-2';
import { Pie } from 'react-chartjs-2';
import Tweets from '../../components/tweets/Tweets';

function User() {
  const [sumbitState, setSumbitState] = useState(false);
  const [chartData, setchartdata] = useState({});
  const [frequentwordsData, setfrequentData] = useState([]);
  const [tweetlist,settweetlist] = useState([])
  const [nameSeacrhing,setname] = useState("")

  const sumbitted = async (input) => {
    setSumbitState(true);
    const data = await getuserTweets(input);
    const main_data = data.data;
    const frequent_words = main_data[main_data.length - 1];
    let positive_tweets = 0;
    let negative_tweets = 0;
    let neutral_tweets = 0;
    const only_tweet_list = []
    let i = 0;
    for (i = 0; i < main_data.length - 1; i++) {
      only_tweet_list.push(main_data[i])
      if (main_data[i].sentiment === 'Positive') {
        positive_tweets += 1;
      } else if (main_data[i].sentiment === 'Negative') {
        negative_tweets += 1;
      } else if (main_data[i].sentiment === 'Neutral') {
        neutral_tweets += 1;
      }
    }
    const data_for_chart = {
      labels: ['Positive', 'Negative', 'Neutral'],
      datasets: [
        {
          label: ' No. Of Different Tweets',
          data: [positive_tweets, negative_tweets, neutral_tweets],
          backgroundColor: ['#845ec2', '#ffc75f', '#ff5e78'],
          borderColor: [
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
          ],
        },
      ],
    };

    let list_labels = [];
    let data_ = [];
    for (var j = 0; j < frequent_words.length; j++) {
      list_labels.push(frequent_words[j].text);
    }
    for (var j = 0; j < frequent_words.length; j++) {
      data_.push(frequent_words[j].value);
    }
    const temp = {
      labels: list_labels,
      datasets: [
        {
          label: 'Most Frequent Words',
          data: data_,
          backgroundColor: [
            '#214151',
            '#55b3b1',
            '#f6c065',
            '#f58634',
            '#19456b',
            '#6930c3',
            '#2c061f',
            '#312c51',
            '#222831',
            '#75cfb8',
            '#00af91',
            '#2c061f',
            '#f05454',
            '#654062',
            '#ffd66b',
            '#83a95c',
            '#ff4646',
            '#65d6ce',
            '#0e49b5',
            '#54e346',
          ],
        },
      ],
    };

    setchartdata(data_for_chart);
    setfrequentData(temp);
    settweetlist(only_tweet_list)
    setname(input)
    setSumbitState(false);
  };

  return (
    <div className={styles.user_conatiner}>
      <div className={styles.home_text_content}>
        <p className={styles.sub_text}>
          Welcome ,
          <strong>
            'COVID-19 Sentimental Analysis Of Twitter Social Handle '
          </strong>
          through this page you can easily perform analysis of particular
          twitter handle by inputing username of user
        </p>
        <Form_user sumbitted={sumbitted} />
      </div>
      <hr className={styles.hr_liner}></hr>
      <div className={styles.main_content}>
        {!sumbitState ? (
          <div>
            <div className={styles.chart}>
              <Pie
                data={chartData}
                height={300}
                width={400}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: true,
                        },
                      },
                    ],
                  },
                }}
              />
            </div>
            <div className={styles.chart}>
              <Bar
                data={chartData}
                height={300}
                width={400}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: true,
                        },
                      },
                    ],
                  },
                }}
              />
            </div>
            <div className={styles.chart_}>
              <Bar
                data={frequentwordsData}
                height={300}
                width={400}
                options={{
                  maintainAspectRatio: false,
                  scales: {
                    yAxes: [
                      {
                        ticks: {
                          beginAtZero: true,
                        },
                      },
                    ],
                  },
                }}
              />
            </div>
            <div><h2 className={styles.heading}>Latest Tweets</h2>{tweetlist.map((tweet)=>{
              return <Tweets name={nameSeacrhing} text={tweet.text} polarity={tweet.polarity}/>
            })}</div>
          </div>
        ) : (
          <CircularProgress />
        )}
      </div>
    </div>
  );
}

export default User;
