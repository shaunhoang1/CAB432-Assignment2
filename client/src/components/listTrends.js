import {Card} from "react-bootstrap";
import {useState} from "react";
import PieChart from "./chart";


export default function ListTrends({trends}) {
    const [cardState, setCardState] = useState(Array(trends.length).fill(false))
    const handleOnClick = (index) => {
        let newArray = Array(trends.length).fill(false);
        newArray[index] = true;
        setCardState(newArray);
    }


    return (
        <ul>
            {trends.map((trend, index) => {
                if (!cardState[index]){
                    return (
                        <li key={index} onClick={() => handleOnClick(index)}>
                            {trend.name}
                            {trend.tweet_volume && (
                                <span className="tweet_volume">{trend.tweet_volume}</span>
                            )}
                        </li>
                    );
                }
                else {
                    return (
                        <>
                            <li key={index} onClick={() => handleOnClick(index)}>
                                {trend.name}
                                {trend.tweet_volume && (
                                    <span className="tweet_volume">{trend.tweet_volume}</span>
                                )}

                            </li>
                            <Card aria-disabled={cardState}>
                                <PieChart/>
                            </Card>
                        </>

                    );
                }
            })}
        </ul>
    );
};