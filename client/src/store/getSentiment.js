import axios from "axios";

export default async function getSentiment(trend) {
  // NOTE: axios only allows post send data through body of response
  const res = await axios.get("/api/search", {
    params: {
      q: trend,
    },
  });

  return res.data;
}
