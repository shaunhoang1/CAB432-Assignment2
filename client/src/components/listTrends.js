import {useEffect, useState} from "react";
import PieChart from "./chart";
import getSentiment from "../store/getSentiment";

export default function ListTrends({trends, trendChosen, setTrendChosen}) {
    const [cardState, setCardState] = useState(Array(trends.length).fill(false));

    const [sentiment, setSentiment] = useState(null);
    useEffect(() => {
        setSentiment(null);
        if (trendChosen !== -1){
            getSentiment(trends[trendChosen].name)
                .then((r) => {
                    setSentiment(r);
                })
                .catch((err) => console.log(err));
        } else {
            setCardState(Array(trends.length).fill(false));
        }
    }, [trendChosen, trends]);

    const handleOnClick = (index) => {
        if (index === trendChosen) {
            setTrendChosen(-1);
            setSentiment(-1);
            setCardState(Array(trends.length).fill(false));
        } else {
            setTrendChosen(index);
            let newArray = Array(trends.length).fill(false);
            newArray[index] = true;
            setCardState(newArray);
        }
    };

    return (
        <ul>
            {trends.map((trend, index) => {

                if (!cardState[index]) {
                    return (
                        <li key={index} onClick={() => handleOnClick(index)}>
                            {trend.name}
                            {trend.tweet_volume && (
                                <span className="tweet_volume">{trend.tweet_volume}</span>
                            )}
                        </li>
                    );
                } else {
                    return (
                        <>
                            <li key={index} onClick={() => handleOnClick(index)}>
                                {trend.name}
                                {trend.tweet_volume && (
                                    <span className="tweet_volume">{trend.tweet_volume}</span>
                                )}
                            </li>
                            {!sentiment && (
                                <h3>
                                    Loading...
                                </h3>
                            )}
                            {sentiment && (
                                <PieChart sentiment={sentiment} trend={trend.name}/>
                            )}

                        </>
                    );
                }
            })}
        </ul>
    );
}
