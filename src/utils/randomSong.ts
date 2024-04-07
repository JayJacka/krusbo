import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { MyDataFormat, TrackDetail } from "~/app/songguessr/type";
import getSpotifyToken from "./getSpotifyToken";

const playlistLists = [
    "6H6DccZQ0NFw7rDaYu5h10",
    "37i9dQZF1DXc51TI5dx7RC",

]

export default async function RandomSong(){
    let songList: TrackDetail[] = [];
    const token = (await getSpotifyToken()).access_token;

    const url = "https://api.spotify.com/v1/playlists/" + playlistLists[0];
    const fetchSongPlaylist = async () => {
        const response:AxiosResponse<MyDataFormat> = await axios.get(url, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            }
            );
            return response.data;
        }
        
    const data: MyDataFormat = await fetchSongPlaylist();
    console.log(data);

    if (data && data.tracks && data.tracks.items) {
        const tracks = data.tracks.items
        .map(track => ({
            name: track.track.name,
            preview_url: track.track.preview_url
        }))
        .filter(track => track.preview_url !== null);
        songList = tracks;
    }

    const randomIndices: number[] = [];
    while (randomIndices.length < 4 && randomIndices.length < songList.length){
        const randomIndex = Math.floor(Math.random() * songList.length);
        if (!randomIndices.includes(randomIndex)){
            randomIndices.push(randomIndex);
        }
    }

    const selectedSong: TrackDetail[] = randomIndices.map(index => songList[index]!);
    const randomSelectedSong = Math.floor(Math.random() * selectedSong.length);
    return {
        song: selectedSong[randomSelectedSong],
        choices: selectedSong,
    };
}