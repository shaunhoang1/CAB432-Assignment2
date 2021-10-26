import axios from "axios";

export default async function getText(trend) {
  // NOTE: axios only allows post send data through body of response
  const res = await axios.get("/search", {
    params: {
      q: trend,
    },
  });

  return res.data;
}
