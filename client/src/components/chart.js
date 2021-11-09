import React from 'react';
import {Pie} from 'react-chartjs-2';
const SENTIMENT_TYPE = {
    0: 'Neutral',
    1: 'Positive',
    2: 'Negative'
}
const PieChart = ({sentiment, trend}) => {
    console.log(sentiment);
    const data = {
        labels: ['Neutral', 'Positive', 'Negative'],
        datasets: [
            {
                label: `Sentiment Proportion of Trend ${trend}`,
                data: Object.values(sentiment.result),
                backgroundColor: [
                    'rgba(255, 99, 132, 0.2)',
                    'rgba(54, 162, 235, 0.2)',
                    'rgba(255, 206, 86, 0.2)'
                ],
                borderColor: [
                    'rgba(255, 99, 132, 1)',
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 206, 86, 1)'
                ],
                borderWidth: 1,
            },
        ],
    };
    return (
        <>
            <div className='chart' >
                <h3 className='bar-chart-header' style={{textAlign: 'center'}}>{`Sentiment Proportion of Trend ${trend}`}</h3>
                <div className='container'>
                    <Pie data={data} type={"pie"} style={{margin: 'auto', height: '15%', width: '15%'}}
                    />
                    <div style={{width:'20em', paddingLeft: '1vw', paddingTop: '10vw', textAlign: 'left'}} >
                    {`Number of tweets: ${sentiment.tweetCount}`}
                    <br/>
                    {`Average sentiment score of tweets: ${sentiment.averageScore}`}
                    <br/>
                    {`Average sentiment type of tweets: ${SENTIMENT_TYPE[sentiment.averageSentiment]}`}
                </div>
                </div>


            </div>
        </>
    )
};

export default PieChart;