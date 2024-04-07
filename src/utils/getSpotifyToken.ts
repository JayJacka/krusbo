import axios from "axios";

interface TokenData {
    access_token: string;
    token_type: string;
    expires_in: number;
}

let token: TokenData;
const fetchNewToken = async () => {
    const response = await axios.post('https://accounts.spotify.com/api/token', {
        grant_type: "client_credentials",
        client_id: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_SPOTIFY_CLIENT_SECRET,
    }, {
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
    });

    console.log(response);
    if (response.status === 200 && response.data.access_token){
        const tokenData: TokenData = {
            access_token: response.data.access_token,
            token_type: response.data.token_type,
            expires_in: Date.now() + response.data.expires_in * 1000,
        };

        token = tokenData;
    }
return token;
}

export default async function getSpotifyToken(){
    if (token && Date.now() < token.expires_in){
        return token;
    }
    
    return await fetchNewToken();
}