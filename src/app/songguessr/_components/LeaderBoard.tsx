import { faRankingStar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ScrollArea } from "~/components/ui/scroll-area";
import { ScoreCardProps, leaderProps } from "../type";

export default function LeaderBoard({ props }: { props: leaderProps[] }) {
  props = props.sort((a, b) => {
    return b.score - a.score;
  });

  return (
    <div className="flex h-2/5 w-4/5 flex-col gap-3 self-center rounded-lg bg-secondary p-4">
      <div className="flex w-full flex-row items-center justify-center gap-[10px]">
        <FontAwesomeIcon
          icon={faRankingStar}
          className="flex justify-start text-grey"
          width={20}
          height={20}
        />
        <div className="h4 flex items-start text-grey">Leader Board</div>
      </div>
      <ScrollArea>
        <div className="flex h-full w-full flex-col gap-3">
          {props
            .sort((a, b) => b.score ?? 0 - (a.score ?? 0))
            .map((data, index) => {
              return (
                <ScoreCard
                  key={index}
                  name={data.name}
                  avatar={data.avatar}
                  score={data.score ?? 0}
                />
              );
            })}
        </div>
      </ScrollArea>
    </div>
  );
}

function ScoreCard(props: ScoreCardProps) {
  return (
    <div className="flex gap-5 self-start">
      <img src={props.avatar} alt="avatar" height={32} width={32} />
      <div className="flex flex-col">
        <div className="text-white">{props.name}</div>
        <div className="text-blue">{props.score} points</div>
      </div>
    </div>
  );
}
