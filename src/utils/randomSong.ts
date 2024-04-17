import axios, { AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import { PlaylistTracks, TrackDetail } from "~/app/songguessr/type";
import getSpotifyToken from "./getSpotifyToken";

export async function FetchSongPlaylist(id: string){
    let songList: TrackDetail[] = [];
    const token = (await getSpotifyToken()).access_token;

    const url = "https://api.spotify.com/v1/playlists/" + id;
    const fetchSongPlaylist = async () => {
        const response:AxiosResponse<PlaylistTracks> = await axios.get(url, 
            {
                headers: {
                    'Authorization': `Bearer ${token}`
                },
            }
            );
            return response.data;
        }
    
    const data: PlaylistTracks = await fetchSongPlaylist();
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
    return songList;        
}

export function RandomSong(songList: TrackDetail[]){
    const randomIndices: number[] = [];
    while (randomIndices.length < 4 && randomIndices.length < songList.length){
        const randomIndex = Math.floor(Math.random() * songList.length);
        if (!randomIndices.includes(randomIndex)){
            randomIndices.push(randomIndex);
        }
    }

    const selectedSong: TrackDetail[] = randomIndices.map(index => songList[index]!);
    const randomSelectedSong = Math.floor(Math.random() * selectedSong.length);
    console.log("from server",selectedSong[randomSelectedSong])
    return {
        song: selectedSong[randomSelectedSong],
        choices: selectedSong,
    };
}