import logo from "./twitter.svg";
import "./App.css";
import {FaCrosshairs} from "react-icons/fa";
import {useEffect, useState} from "react";
import getTrends from "./store/getTrends";
import getTrendsNearMe from "./store/getTrendNearMe";
import ListTrends from "./components/listTrends";

function App() {
    const [trends, setTrends] = useState([]);
    const [woeid, setWoeid] = useState("1");

    useEffect(() => {
        getTrends(woeid).then(r => setTrends(r[0].trends)).catch(err => console.log(err));

    }, [woeid]);


    function handleLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    getTrendsNearMe(position.coords.latitude, position.coords.longitude)
                        .then(r => setWoeid(r[0].woeid))
                },
                (error) => {
                    console.log(error.message);
                }
            );
        } else {
            alert(`Geolocation not supported`);
        }
    }


    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="logo" alt="twitter"/>
                <h3>Twitter Trends</h3>
            </header>
            <div className="menu">
                <select
                    name="trending-place"
                    onChange={(e) => setWoeid(e.target.value)}
                >
                    <option value="1">Worldwide</option>
                    <option value="23424977">US</option>
                    <option value="23424829">DE</option>
                    <option value="23424856">JP</option>
                    <option value="23424984">VN</option>
                    <option value="2459115">New York,US</option>
                    <option value="2442047">Los Angeles, US</option>
                    <option value="1105779">Sydney, AU</option>
                    <option value="1100661">Brisbane,AU</option>
                    <option value="1236594">Hanoi,VN</option>
                </select>
                <div className="location" onClick={handleLocation}>
                    <FaCrosshairs/>
                </div>
            </div>
            <ListTrends trends={trends}/>
        </div>
    );
}

export default App;
