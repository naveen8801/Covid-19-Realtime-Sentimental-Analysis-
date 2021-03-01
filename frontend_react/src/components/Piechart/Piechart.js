import React, { useState, useEffect } from 'react';
import { tweetsStream } from '../../api/index';
import { Pie } from 'react-chartjs-2';
import styles from './piechart.module.css'

function Piechart() {

    const [chartdata, setchartdata] = useState({});

    useEffect(() => {
      getTweetsStream();
    }, [chartdata]);

    const getTweetsStream = async () => {
      const stream = await tweetsStream();
      const data = stream.data;
      let positive_tweets = 0;
      let negative_tweets = 0;
      let neutral_tweets = 0;
      data.map((item) => {
        if (item.sentiment === 'Positive') {
          positive_tweets += 1;
        } else if (item.sentiment === 'Negative') {
          negative_tweets += 1;
        } else {
          neutral_tweets += 1;
        }
      });

      const temp = {
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
      setchartdata(temp);
      console.log(temp);
    };



    return (
      <div className={styles.chart}>
        <Pie
          data={chartdata}
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
    );
}

export default Piechart
