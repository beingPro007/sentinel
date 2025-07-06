import axios from "axios";

async function fetchOptionContract() {
    let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://api.upstox.com/v2/option/contract',
        headers: {
            'Accept': 'application/json'
        }
    };

    const res = await axios(config);
    return res.data;
};

export default fetchOptionContract;
