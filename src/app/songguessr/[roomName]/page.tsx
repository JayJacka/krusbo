"use client"
import { useEffect, useState } from "react";
import { CategoryWithPlaylists, TrackDetail } from "../type";
import { fetchPlaylists } from "../utils/fetchPlaylists";
import { socket } from "~/socket";
import { PlaylistSelection } from "../_components/PlaylistSelection";
import { Button } from "~/components/ui/button";
import { QuestionContainer } from "../_components/QuestionContainer";

export default function SongGuessr({ params }: { params: { roomName: string } }){
    const [gameStarted,setGameStarted] = useState(false);
    const [targetTime, setTargetTime] = useState(0);
    const [timeLeft, setTimeLeft] = useState(18);
    const [numQuestions, setNumQuestions] = useState(1);
    const [waitingForNextQuestion, setWaitingForNextQuestion] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [selectedPlaylist, setSelectedPlaylist] = useState("");
    const [categoryPlayLists, setCategoryPlayLists] = useState<CategoryWithPlaylists[]>([]);
    const [song, setSong] = useState<TrackDetail>();

    useEffect(() => {
        async function fetchData(){
            const data = await fetchPlaylists();
            setCategoryPlayLists(data);
        }
        fetchData();
    }, []);

    const handleStart = () =>{
        socket.emit("start game", selectedPlaylist);
        socket.emit("send time target", new Date().getTime() + 18000);
    };

    const handleGameEnd = () => {
        setGameStarted(false);
        setWaitingForNextQuestion(false);
        setNumQuestions(1);
        setTargetTime(0);
        setTimeLeft(18);
    }

    const handleSelectPlaylist = (id: string) => {
        setSelectedPlaylist(id);
    }

    const handleSetSong = (song: TrackDetail) => {
        setSong(song)
    }

    const handleIsCorrect = (isCorrect: boolean) => {
        setIsCorrect(isCorrect)
        isCorrect ? setScore(score + 100) : setScore(score);
    }

    useEffect(() => {
        const intervalId = setInterval(() => {
            const currentTime = new Date().getTime();
            const roundTimeLeft = targetTime - currentTime;
            const timeLeft = Math.round(roundTimeLeft / 1000);
            if (timeLeft >= 3) {
                setTimeLeft(timeLeft);
            }
            else if(timeLeft < 3 && timeLeft >= 0) {
                if (numQuestions === 10) {
                    handleGameEnd();
                    clearInterval(intervalId);
                    return;
                }

                setTimeLeft(18);
                setWaitingForNextQuestion(true);
            }
            else if (targetTime != 0){
                setWaitingForNextQuestion(false);
                socket.emit("send time target", new Date().getTime() + 18000);
                socket.emit("send song");
                setNumQuestions(numQuestions + 1);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [targetTime]);
    
    socket.on("time target", data => {
        setTargetTime(data);
    });

    socket.on("game started", () => {
        setGameStarted(true);
    });

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            <div className="text-white">
                score: {score}
            </div>
            <h1 className="text-yellow text-4xl">Song Guessr</h1>
            <div className="p-4 flex flex-col w-1/2 items-center gap-4">
                {!gameStarted && <PlaylistSelection categoryPlaylists={categoryPlayLists} selectedPlaylist={selectedPlaylist} setSelectedPlaylist={handleSelectPlaylist}/>}
                {!gameStarted && <Button disabled={selectedPlaylist == ""} className="text-white bg-pink w-fit" onClick={handleStart}>Start Game</Button>}
                {gameStarted && <div className="flex flex-row justify-between gap-2">
                    {!waitingForNextQuestion && <p className="text-grey">Time remaining: {timeLeft-3} seconds</p>}
                    <h3 className="text-grey">Question: {numQuestions} from 5</h3>
                    </div>}
                {waitingForNextQuestion && <h2 className="text-white font-2xl">Waiting for next question</h2>}
                {!waitingForNextQuestion && gameStarted && <QuestionContainer song={song} setSong={handleSetSong} setIsCorrect={handleIsCorrect} />}
                {waitingForNextQuestion && (isCorrect ?
                    <div className="flex flex-col opacity-100 bg-blue-100 p-4 rounded-lg">
                        <p className="text-grey"> Correct answer: {song?.name}</p>
                        <p className="text-green text-4xl"> Correct</p>
                        <p className="text-yellow"> + {100} points</p>
                    </div> :
                    <div className="flex flex-col opacity-100 bg-blue-100 p-4 rounded-lg">
                        <p className="text-grey"> Correct answer: {song?.name}</p>
                        <p className="text-red text-4xl"> Incorrect</p>
                    </div>
                )}
            </div>
        </div>
    );
}