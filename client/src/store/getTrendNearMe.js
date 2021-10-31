import axios from "axios";

export default async function getTrendsNearMe(lat, long) {

    // NOTE: axios only allows post send data through body of response
    const res = await axios.get("/api/near-me", {
        params: {
            lat: lat,
            long: long,
        },
    })

    return res.data;
}
