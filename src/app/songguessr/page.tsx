"use client"
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { socket } from "~/socket";
import { QuestionContainer } from "./_components/QuestionContainer";
import { PlaylistSelection } from "./_components/PlaylistSelection";
import { fetchPlaylists } from "./utils/fetchPlaylists";
import { CategoryPlaylists, CategoryWithPlaylists } from "./type";

export default function SongGuessr(){
    const [gameStarted,setGameStarted] = useState(false);
    const [targetTime, setTargetTime] = useState(0);
    const [timeLeft, setTimeLeft] = useState(18);
    const [numQuestions, setNumQuestions] = useState(1);
    const [waitingForNextQuestion, setWaitingForNextQuestion] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [score, setScore] = useState(0);
    const [selectedPlaylist, setSelectedPlaylist] = useState("");
    const [categoryPlayLists, setCategoryPlayLists] = useState<CategoryWithPlaylists[]>([]);

    useEffect(() => {
        async function fetchData(){
            const data = await fetchPlaylists();
            setCategoryPlayLists(data);
        }
        fetchData();
    }, []);

    const handlepost = () => {
        socket.emit("send message",name);
    }

    const handleStart = () =>{
        console.log("enter start game")
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

    useEffect(() => {
        // console.log(targetTime)
        const intervalId = setInterval(() => {
            const currentTime = new Date().getTime();
            const roundTimeLeft = targetTime - currentTime;
            const timeLeft = Math.round(roundTimeLeft / 1000);
            if (timeLeft >= 3) {
                setTimeLeft(timeLeft);
            }
            else if(timeLeft < 3 && timeLeft > 0) {
                if (numQuestions === 10) {
                    handleGameEnd();
                    clearInterval(intervalId);
                    return;
                }

                setTimeLeft(18);
                setWaitingForNextQuestion(true);
                // isCorrect ? setScore(score + 100) : setScore(score);
            }
            else if (targetTime != 0 && gameStarted){
                console.log("in here")
                setWaitingForNextQuestion(false);
                socket.emit("send time target", new Date().getTime() + 18000);
                socket.emit("send song");
                setNumQuestions(numQuestions + 1);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [targetTime]);
    
    socket.on("time target", data => {
        console.log("time target", data)
        setTargetTime(data);
    });

    socket.on("game started",data => {
        console.log("Game started");
        setGameStarted(true);
    });

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            {waitingForNextQuestion &&<div className="text-white">
                score: {score}
            </div>}
            <h1 className="text-button-yellow text-4xl">Song Guessr</h1>
            <div className="p-4 flex flex-col w-1/2 items-center gap-4">
                {!gameStarted && <PlaylistSelection categoryPlaylists={categoryPlayLists} selectedPlaylist={selectedPlaylist} setSelectedPlaylist={handleSelectPlaylist}/>}
                {!gameStarted && <Button className="text-white bg-button-pink w-fit" onClick={handleStart}>Start Game</Button>}
                {gameStarted && <div className="flex flex-row justify-between gap-2">
                    {!waitingForNextQuestion && <p className="text-grey">Time remaining: {timeLeft-3} seconds</p>}
                    <h3 className="text-grey">Question: {numQuestions} from 5</h3>
                    </div>}
                {waitingForNextQuestion && <h2 className="text-white font-2xl">Waiting for next question</h2>}
                {!waitingForNextQuestion && gameStarted && <QuestionContainer setIsCorrect={(isCorrect)=> setIsCorrect(isCorrect)} />}
                {waitingForNextQuestion && 
                    <p className="text-white">{isCorrect? "correct" : "Incorrect"}</p>
                    // <div className="flex flex-col opacity-10 bg-white">
                    //     <p className="text-white"> Correct answer: {isCorrect ? "correct" : "Incorrect"}</p>
                    //     <p className="text-white">{isCorrect? "correct" : "Incorrect"}</p>
                    //     isCorrect && <p className="text-white">+{100}</p>
                    // </div>
                }
            </div>
        </div>
    );
}