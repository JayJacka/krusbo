"use client";
import { useEffect, useState } from "react";
import {
  CategoryWithPlaylists,
  TrackDetail,
  userScore,
  leaderProps,
  userNameImage,
} from "../type";
import { fetchPlaylists } from "../utils/fetchPlaylists";
import { socket } from "~/socket";
import { PlaylistSelection } from "../_components/PlaylistSelection";
import { Button } from "~/components/ui/button";
import { QuestionContainer } from "../_components/QuestionContainer";
import { ChatBox } from "../_components/ChatBox";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import LeaderBoard from "../_components/LeaderBoard";
import { api } from "~/trpc/react";

export default function SongGuessr({
  params,
}: {
  params: { roomName: string };
}) {
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
  const [userScore, setUserScore] = useState<userScore[]>([]);
  const [userNameImage, setUserNameImage] = useState<userNameImage[]>([]);
  const [userData, setUserData] = useState<leaderProps[]>([]);
  const userDataQuery = api.auth.me.useQuery();
  const [scoreChange, setScoreChange] = useState(0);

  useEffect(() => {
    if (!userDataQuery.isLoading) {
      const userData = userDataQuery.data;
      if (userData?.nickname && userData?.avatar && userData?.id) {
        socket.emit(
          "set user data",
          params.roomName,
          userData.id,
          userData.nickname,
          userData.avatar,
        );
        socket.emit("get user data", params.roomName);
      }
    }
  }, [userDataQuery.isLoading]);

  useEffect(() => {
    if (!userDataQuery.isLoading) {
      const userData = userDataQuery.data;
      if (userData?.nickname && userData?.avatar && userData?.id) {
        socket.emit("change score", params.roomName, userData.id, score);
      }
    }
  }, [score]);

  useEffect(() => {
    async function fetchData() {
      const data = await fetchPlaylists();
      setCategoryPlayLists(data);
    }
    fetchData();
  }, []);

  const handleStart = () => {
    socket.emit("start game", selectedPlaylist, params.roomName);
    socket.emit(
      "send time target",
      new Date().getTime() + 18000,
      params.roomName,
    );
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
  const router = useRouter();

  const handleLeave = () => {
    socket.emit("leave room", params.roomName);
    router.push("/search");
  };

  const handleIsCorrect = (isCorrect: boolean) => {
    setIsCorrect(isCorrect);
    if (isCorrect) {
      setScore(score + 100 * Math.round(((timeLeft - 2) / 15) * 10));
      setScoreChange(100 * Math.round(((timeLeft - 2) / 15) * 10));
    } else {
      setScore(score);
      setScoreChange(0);
    }
  };

  useEffect(() => {
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
        setIsCorrect(false);
        setWaitingForNextQuestion(false);
        socket.emit(
          "send time target",
          new Date().getTime() + 18000,
          params.roomName,
        );
        socket.emit("send song", params.roomName);
        setNumQuestions(numQuestions + 1);
      }
    }, 1000);

    return () => clearInterval(intervalId);
  }, [targetTime]);

  socket.on("time target", (data) => {
    setTargetTime(data);
  });

  useEffect(() => {
    socket.on(
      `users scores`,
      (
        users: {
          userId: string;
          score: number;
        }[],
      ) => {
        const usersScore = users.map((value) => {
          return {
            userId: value.userId,
            score: value.score,
          };
        });
        setUserScore(usersScore);
      },
    );
    socket.on(
      "users datas",
      (
        users: {
          userId: string;
          name: string;
          image: string;
        }[],
      ) => {
        const usersImage = users.map((value) => {
          return {
            userId: value.userId,
            name: value.name,
            image: value.image,
          };
        });
        setUserNameImage(usersImage);
      },
    );
    return () => {
      socket.off(`users images`);
      socket.off("users scores");
    };
  }, [socket]);

  useEffect(() => {
    const mergedList: leaderProps[] = [];
    const scoresMap = new Map(
      userScore.map((scoreObj) => [scoreObj.userId, scoreObj]),
    );
    userNameImage.forEach((imageObj) => {
      const { userId, image, name } = imageObj;
      const scoreObj = scoresMap.get(userId);
      const mergedObj = {
        name: name,
        avatar: image,
        score: scoreObj ? scoreObj.score : 0,
      };

      mergedList.push(mergedObj);
      scoresMap.delete(userId);
    });
    scoresMap.forEach((scoreObj) => {
      const { userId, score } = scoreObj;
      mergedList.push({
        name: userId,
        avatar:
          "data:image/svg+xml;utf8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20120%20120%22%20fill%3D%22none%22%20shape-rendering%3D%22auto%22%20width%3D%22128%22%20height%3D%22128%22%3E%3Cmetadata%20xmlns%3Ardf%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2F02%2F22-rdf-syntax-ns%23%22%20xmlns%3Axsi%3D%22http%3A%2F%2Fwww.w3.org%2F2001%2FXMLSchema-instance%22%20xmlns%3Adc%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Felements%2F1.1%2F%22%20xmlns%3Adcterms%3D%22http%3A%2F%2Fpurl.org%2Fdc%2Fterms%2F%22%3E%3Crdf%3ARDF%3E%3Crdf%3ADescription%3E%3Cdc%3Atitle%3EBottts%3C%2Fdc%3Atitle%3E%3Cdc%3Acreator%3EPablo%20Stanley%3C%2Fdc%3Acreator%3E%3Cdc%3Asource%20xsi%3Atype%3D%22dcterms%3AURI%22%3Ehttps%3A%2F%2Fbottts.com%2F%3C%2Fdc%3Asource%3E%3Cdcterms%3Alicense%20xsi%3Atype%3D%22dcterms%3AURI%22%3Ehttps%3A%2F%2Fbottts.com%2F%3C%2Fdcterms%3Alicense%3E%3Cdc%3Arights%3ERemix%20of%20%E2%80%9EBottts%E2%80%9D%20(https%3A%2F%2Fbottts.com%2F)%20by%20%E2%80%9EPablo%20Stanley%E2%80%9D%2C%20licensed%20under%20%E2%80%9EFree%20for%20personal%20and%20commercial%20use%E2%80%9D%20(https%3A%2F%2Fbottts.com%2F)%3C%2Fdc%3Arights%3E%3C%2Frdf%3ADescription%3E%3C%2Frdf%3ARDF%3E%3C%2Fmetadata%3E%3Cmask%20id%3D%22viewboxMask%22%3E%3Crect%20width%3D%22120%22%20height%3D%22120%22%20rx%3D%220%22%20ry%3D%220%22%20x%3D%220%22%20y%3D%220%22%20fill%3D%22%23fff%22%20%2F%3E%3C%2Fmask%3E%3Cg%20mask%3D%22url(%23viewboxMask)%22%3E%3Crect%20fill%3D%22%235e35b1%22%20width%3D%22120%22%20height%3D%22120%22%20x%3D%220%22%20y%3D%220%22%20%2F%3E%3Cg%20transform%3D%22translate(22%2068)%22%3E%3Cg%20fill%3D%22%23000%22%20fill-opacity%3D%22.6%22%3E%3Crect%20x%3D%2212%22%20y%3D%2212%22%20width%3D%224%22%20height%3D%228%22%20rx%3D%222%22%2F%3E%3Crect%20x%3D%2236%22%20y%3D%2212%22%20width%3D%224%22%20height%3D%228%22%20rx%3D%222%22%2F%3E%3Crect%20x%3D%2224%22%20y%3D%2212%22%20width%3D%224%22%20height%3D%228%22%20rx%3D%222%22%2F%3E%3Crect%20x%3D%2248%22%20y%3D%2212%22%20width%3D%224%22%20height%3D%228%22%20rx%3D%222%22%2F%3E%3Crect%20x%3D%2260%22%20y%3D%2212%22%20width%3D%224%22%20height%3D%228%22%20rx%3D%222%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3Cg%20transform%3D%22translate(8%2020)%22%3E%3Cpath%20d%3D%22M28%2044a20%2020%200%200%200%2019.9-18h41.52a5%205%200%201%200%200-4H47.9A20%2020%200%201%200%2028%2044Z%22%20fill%3D%22%23000%22%20fill-opacity%3D%22.2%22%2F%3E%3Ccircle%20cx%3D%2294%22%20cy%3D%2224%22%20r%3D%222%22%20fill%3D%22%23fff%22%2F%3E%3Ccircle%20cx%3D%2228%22%20cy%3D%2224%22%20r%3D%2216%22%20fill%3D%22%23000%22%20fill-opacity%3D%22.6%22%2F%3E%3Ccircle%20cx%3D%2234%22%20cy%3D%2216%22%20r%3D%223%22%20fill%3D%22%23fff%22%2F%3E%3C%2Fg%3E%3C%2Fg%3E%3C%2Fsvg%3E",
        score: score,
      });
    });
    setUserData(mergedList);
  }, [userScore, userNameImage]);

  useEffect(() => {
    socket.emit("get score", params.roomName);
    socket.emit("get user data", params.roomName);
  }, [socket]);

  socket.on("game started", () => {
    setGameStarted(true);
  });

  return (
    <div className="flex flex-row justify-between bg-primary">
      <div className="flex w-1/4 flex-col gap-8 text-white">
        <Button
          className="h4 ml-10 mt-10 flex h-10 w-3/5 flex-row gap-1"
          onClick={handleLeave}
        >
          <div className="h4 flex justify-center p-[10px]">BallRoom</div>
          <FontAwesomeIcon
            icon={faRightFromBracket}
            className="flex items-center text-red"
            width={32}
            height={32}
          />
        </Button>
        {<LeaderBoard props={userData} />}
        <div className="w-full p-8">
          <div className="flex max-w-96 justify-start">
            <ChatBox room={params.roomName} />
          </div>
        </div>
      </div>
      <div className="flex h-screen w-1/2 flex-col items-center justify-center ">
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
          {gameStarted && waitingForNextQuestion && (
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
            gameStarted &&
            (isCorrect ? (
              <div className="flex flex-col rounded-lg bg-blue-100 p-4 opacity-100">
                <p className="text-grey"> Correct answer: {song?.name}</p>
                <p className="text-4xl text-green"> Correct</p>
                <p className="text-yellow"> + {scoreChange} points</p>
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
