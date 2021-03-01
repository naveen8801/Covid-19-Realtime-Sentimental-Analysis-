import React , {useState,useEffect} from 'react';
import styles from './wordcloud.module.css';
import { Bar } from 'react-chartjs-2';
import {frequentwords} from '../../api'

function Wordcloud() {
    const [data, setdata] = useState([])

    useEffect(() => {
        getdata()
    }, [data])

    const getdata = async() =>{
        const status = await frequentwords();
        const list  = status.data
        let list_labels = []
        let data_ = []
        for(var i =0 ;i<list.length;i++){
            list_labels.push(list[i].text)
        }
        for (var i = 0; i < list.length; i++) {
          data_.push(list[i].value);
        }
        const temp = {
          labels: list_labels,
          datasets: [
            {
              label: 'Most Frequent Words',
              data: data_,
              backgroundColor: ['#214151', '#55b3b1', '#f6c065', '#f58634','#19456b','#6930c3','#2c061f','#312c51','#222831','#75cfb8','#00af91','#2c061f','#f05454','#654062','#ffd66b','#83a95c','#ff4646','#65d6ce','#0e49b5','#54e346'],
            },
          ],
        };
        setdata(temp)
    }
    
    return (
      <div className={styles.chart}>
        <Bar
          data={data}
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

export default Wordcloud
