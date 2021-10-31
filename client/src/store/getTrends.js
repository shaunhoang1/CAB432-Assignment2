import axios from "axios";

export default async function getTrends(param) {

    // NOTE: axios only allows post send data through body of response
    const res = await axios.get("/api/trends", {
        params: {
            woeid : param,
        },
    })

    return res.data;
}