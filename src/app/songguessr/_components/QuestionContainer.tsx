"use "
import { use, useEffect, useState } from "react";
import { MyDataFormat, TrackDetail } from "../type";
import { Button } from "~/components/ui/button";
import ReactAudioPlayer from 'react-audio-player';
import { socket } from "~/socket";

type SpotifyTrackProps = {
    setIsCorrect: (isCorrect: boolean) => void; 
}

const playlistLists = [
    "6H6DccZQ0NFw7rDaYu5h10",
    "37i9dQZF1DXc51TI5dx7RC",

]
export function QuestionContainer(prop: SpotifyTrackProps){
    const {setIsCorrect} = prop;
    // const token = useSpotifyToken();

    // const [{ data, loading, error }] = useAxios<MyDataFormat>({
    //     baseURL: "https://api.spotify.com/v1/playlists",
    //     url: playlistLists[0],
    //     method: "GET",
    //     headers: {
    //         Authorization: `Bearer ${token}`,
    //     },
    // });
    
    // const [songList, setSongList] = useState<TrackDetail[]>([]);
    const [song, setSong] = useState<TrackDetail>();
    const [choices, setChoices] = useState<TrackDetail[]>([]);
    const [answer, setAnswer] = useState("");
    const [isSelected, setIsSelected] = useState(false);

    const handleSelectAnswer = (choice: string) => {
        setAnswer(choice);
        setIsSelected(true);
        choice === song?.name ? setIsCorrect(true) : setIsCorrect(false);
    }

    socket.on("song", (song: TrackDetail) => {
        setSong(song);
    });

    socket.on("choices", (choices: TrackDetail[]) => {
        setChoices(choices);
    });
    // useEffect(() => {
    //     if (data && data.tracks && data.tracks.items) {
    //         const tracks = data.tracks.items
    //         .map(track => ({
    //             name: track.track.name,
    //             preview_url: track.track.preview_url
    //         }))
    //         .filter(track => track.preview_url !== null);
    //         setSongList(tracks);
    //     }
    //     console.log(data);
    // }, [data]);
    
    // useEffect(() => {
    //     const randomIndices: number[] = [];
    //     while (randomIndices.length < 4 && randomIndices.length < songList.length){
    //         const randomIndex = Math.floor(Math.random() * songList.length);
    //         if (!randomIndices.includes(randomIndex)){
    //             randomIndices.push(randomIndex);
    //         }
    //     }

    //     const selectedSong: TrackDetail[] = randomIndices.map(index => songList[index]!);
    //     setChoices(selectedSong);

    //     const randomSelectedSong = Math.floor(Math.random() * selectedSong.length);
    //     setSong(selectedSong[randomSelectedSong]);
    // }, [songList]);
    
    return (
        <div className="bg-yellow flex flex-col gap-3 items-center justify-center h-full">
            <h3 className="text-white">Guess the song name</h3>
            <ReactAudioPlayer
                className="hidden"
                src={song?.preview_url}
                autoPlay
                controls
                volume={0.1}
            />
            {/* <iframe
                title="Spotify Embed: Recommendation Playlist"
                width={100}
                height={100}
                src={song?.preview_url}
                setVolume={0.5}
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                style={{color: "white"}}
                loading="lazy"
            /> */}
            <div className="flex flex-col gap-2">
                {choices.map((choice, index) => (
                    <Button disabled={isSelected} onClick = {() => handleSelectAnswer(choice.name)} 
                    className={"text-white "+ (answer == choice.name ? "bg-yellow" : "")} key={index}>{choice.name}</Button>
                ))}
            </div>
            {isSelected && <p>Selected answer: {answer}</p>}
        </div>
    );
    
    
}