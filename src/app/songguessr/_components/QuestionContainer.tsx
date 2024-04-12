"use client"
import { use, useEffect, useState } from "react";
import { PlaylistTracks, TrackDetail } from "../type";
import { Button } from "~/components/ui/button";
import ReactAudioPlayer from 'react-audio-player';
import { socket } from "~/socket";

type SpotifyTrackProps = {
    setIsCorrect: (isCorrect: boolean) => void; 
}

export function QuestionContainer(prop: SpotifyTrackProps){
    const {setIsCorrect} = prop;
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
        console.log("song", song)
        setSong(song);
    });

    socket.on("choices", (choices: TrackDetail[]) => {
        setChoices(choices);
    });

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