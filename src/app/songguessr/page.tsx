"use client";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { socket } from "~/socket";
import { QuestionContainer } from "./_components/QuestionContainer";
import { PlaylistSelection } from "./_components/PlaylistSelection";
import { fetchPlaylists } from "./utils/fetchPlaylists";
import { CategoryWithPlaylists, TrackDetail } from "./type";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import LeaderBoard from "./_components/LeaderBoard";

export default function SongGuessr() {
  const [gameStarted, setGameStarted] = useState(false);
  const [targetTime, setTargetTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(18);
  const [numQuestions, setNumQuestions] = useState(1);
  const [waitingForNextQuestion, setWaitingForNextQuestion] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [selectedPlaylist, setSelectedPlaylist] = useState("");
  const [categoryPlayLists, setCategoryPlayLists] = useState<
    CategoryWithPlaylists[]
  >([]);
  const [song, setSong] = useState<TrackDetail>();

  useEffect(() => {
    async function fetchData() {
      const data = await fetchPlaylists();
      setCategoryPlayLists(data);
    }
    fetchData();
  }, []);

  const handleStart = () => {
    socket.emit("start game", selectedPlaylist);
    socket.emit("send time target", new Date().getTime() + 18000);
  };

  const handleGameEnd = () => {
    setGameStarted(false);
    setWaitingForNextQuestion(false);
    setNumQuestions(1);
    setTargetTime(0);
    setTimeLeft(18);
  };

  const handleSelectPlaylist = (id: string) => {
    setSelectedPlaylist(id);
  };

  const handleSetSong = (song: TrackDetail) => {
    setSong(song);
  };

  const handleIsCorrect = (isCorrect: boolean) => {
    setIsCorrect(isCorrect);
    isCorrect ? setScore(score + 100) : setScore(score);
  };

  useEffect(() => {
    console.log(isCorrect);
    const intervalId = setInterval(() => {
      const currentTime = new Date().getTime();
      const roundTimeLeft = targetTime - currentTime;
      const timeLeft = Math.round(roundTimeLeft / 1000);
      if (timeLeft >= 3) {
        setTimeLeft(timeLeft);
      } else if (timeLeft < 3 && timeLeft >= 0) {
        if (numQuestions === 10) {
          handleGameEnd();
          clearInterval(intervalId);
          return;
        }
        setTimeLeft(18);
        setWaitingForNextQuestion(true);
      } else if (targetTime != 0) {
        setWaitingForNextQuestion(false);
        socket.emit("send time target", new Date().getTime() + 18000);
        socket.emit("send song");
        setNumQuestions(numQuestions + 1);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetTime]);

  socket.on("time target", (data) => {
    setTargetTime(data);
  });

  socket.on("game started", () => {
    setGameStarted(true);
  });

  return (
    <div className="flex flex-row justify-between">
      <div className="flex w-1/4 flex-col gap-8 text-white">
        <Button className="h4 ml-10 mt-10 flex h-10 w-3/5 flex-row gap-1">
          <div className="h4 flex justify-center p-[10px]">BallRoom</div>
          <FontAwesomeIcon
            icon={faRightFromBracket}
            className="flex items-center text-red"
            width={32}
            height={32}
          />
        </Button>
        <LeaderBoard score={score} />
        <div className="flex h-2/5">Chat</div>
      </div>
      <div className="flex h-screen w-1/2 flex-col items-center justify-center">
        <div className="text-white">score: {score}</div>
        <h1 className="text-4xl text-yellow">Song Guessr</h1>
        <div className="flex w-1/2 flex-col items-center gap-4 p-4">
          {!gameStarted && (
            <PlaylistSelection
              categoryPlaylists={categoryPlayLists}
              selectedPlaylist={selectedPlaylist}
              setSelectedPlaylist={handleSelectPlaylist}
            />
          )}
          {!gameStarted && (
            <Button
              disabled={selectedPlaylist == ""}
              className="w-fit bg-pink text-white"
              onClick={handleStart}
            >
              Start Game
            </Button>
          )}
          {gameStarted && (
            <div className="flex flex-row justify-between gap-2">
              {!waitingForNextQuestion && (
                <p className="text-grey">
                  Time remaining: {timeLeft - 3} seconds
                </p>
              )}
              <h3 className="text-grey">Question: {numQuestions} from 10</h3>
            </div>
          )}
          {waitingForNextQuestion && (
            <h2 className="font-2xl text-white">Waiting for next question</h2>
          )}
          {!waitingForNextQuestion && gameStarted && (
            <QuestionContainer
              song={song}
              setSong={handleSetSong}
              setIsCorrect={handleIsCorrect}
            />
          )}
          {waitingForNextQuestion &&
            (isCorrect ? (
              <div className="flex flex-col rounded-lg bg-blue-100 p-4 opacity-100">
                <p className="text-grey"> Correct answer: {song?.name}</p>
                <p className="text-4xl text-green"> Correct</p>
                <p className="text-yellow"> + {100} points</p>
              </div>
            ) : (
              <div className="flex flex-col rounded-lg bg-blue-100 p-4 opacity-100">
                <p className="text-grey"> Correct answer: {song?.name}</p>
                <p className="text-4xl text-red"> Incorrect</p>
              </div>
            ))}
        </div>
      </div>
      <div className="flex w-1/4 text-white">Member</div>
    </div>
  );
}
