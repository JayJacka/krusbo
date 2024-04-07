"use client"
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { socket } from "~/socket";
import { QuestionContainer } from "./_components/QuestionContainer";

export default function SongGuessr(){
    const [name,setName] = useState("");
    const [id,setId] = useState("");
    const [message,setMessage] = useState<string[]>([]);
    const [gameStarted,setGameStarted] = useState(false);
    const [targetTime, setTargetTime] = useState(0);
    const [timeLeft, setTimeLeft] = useState(10);
    const [numQuestions, setNumQuestions] = useState(1);
    const [waitingForNextQuestion, setWaitingForNextQuestion] = useState(false);
    const [isCorrect, setIsCorrect] = useState(false);
    const [isSelected, setIsSelected] = useState(false);
    const [score, setScore] = useState(0);

    const handlepost = () =>{
        socket.emit("send message",name);
    }
    const handleStart = () =>{
        socket.emit("start game");
        socket.emit("send song");
        socket.emit("send time target", new Date().getTime() + 10000);
    };

    const handleGameEnd = () => {
        setGameStarted(false);
        setIsSelected(false);
        setWaitingForNextQuestion(false);
        setNumQuestions(1);
        setTargetTime(0);
        setTimeLeft(10);
    }

    useEffect(() => {
        console.log("targetTime",targetTime)
        const intervalId = setInterval(() => {
            const currentTime = new Date().getTime();
            const timeLeft = targetTime - currentTime;
            if (timeLeft >= 0) {
                setTimeLeft(Math.round(timeLeft / 1000));
            }
            else if (targetTime !== 0){
                if (numQuestions === 5) {
                    handleGameEnd();
                    clearInterval(intervalId);
                    return;
                }
                setWaitingForNextQuestion(true);
                setTimeout(() => {
                    setIsSelected(false);
                    setWaitingForNextQuestion(false);
                    console.log("send time target")
                    socket.emit("send time target", new Date().getTime() + 10000);
                    socket.emit("send song");
                    setNumQuestions(numQuestions + 1)
                }, 3000);
            }
        }, 1000);

        return () => clearInterval(intervalId);
    }, [targetTime]);

    socket.on("your id",data => {
        console.log(data);
        setId(data);
    });
    socket.on("message",data => {
        setMessage([...message,data]);
    });

    socket.on("time target", data => {
        console.log("get time target",data);
        setTargetTime(data);
    });

    socket.on("game started",data => {
        console.log("Game started");
        setGameStarted(true);
    });

    return (
        <div className="h-screen flex flex-col items-center justify-center">
            {/* <div className="bg-blue p-2">
                <input type="text" onChange={(e)=> setName(e.target.value)} /> 
                <button onClick={handlepost}>Send message </button>
                <p>Recive message {id}</p>
                {message.map((p,index)=>(
                    <li key={index}>{p}</li>
                ))}
            </div> */}
            {/* <p className="text-grey">Recive message {id}</p> */}
            <h1 className="text-button-yellow text-4xl">Song Guessr</h1>
            <div className="p-4 flex flex-col">
            {!gameStarted && <Button className="text-white bg-button-pink" onClick={handleStart}>Start Game</Button>}
            {/* {gameStarted && <h2 className="text-white">Game Started</h2>} */}
            {/* {gameEnded && <h2 className="text-white">Game Ended</h2>} */}
            {gameStarted && <div className="flex flex-row justify-between gap-2">
                {!waitingForNextQuestion && <p className="text-grey">Time remaining: {timeLeft} seconds</p>}
                <h3 className="text-grey">Question: {numQuestions} from 5</h3>
                </div>}
            {waitingForNextQuestion && <h2 className="text-white font-2xl">Waiting for next question</h2>}
            {!waitingForNextQuestion && gameStarted && <QuestionContainer setIsCorrect={(isCorrect)=> setIsCorrect(isCorrect)} />}
            {waitingForNextQuestion &&   <p className="text-white">{isCorrect? "correct" : "Incorrect"}</p>}
            </div>
        </div>
    );
}