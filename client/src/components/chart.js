import React from 'react';
import {Pie} from 'react-chartjs-2';

const PieChart = ({sentiment, trend}) => {
    console.log(sentiment);
    const data = {
        labels: ['Neutral', 'Positive', 'Negative'],
        datasets: [
            {
                label: `Sentiment Proportion of Trend ${trend}`,
                data: Object.values(sentiment),
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
            <div className='chart'>
                <h3 className='bar-chart-header'>{`Sentiment Proportion of Trend ${trend}`}</h3>
                <Pie data={data} type={"pie"}
                />
            </div>
        </>
    )
};

export default PieChart;