import { GroupDetail } from "~/app/search/type";

export function ParsingRooms(allUsers:Map<string, string[]>){
    let rooms: GroupDetail[] = [];
    for (let [key, value] of allUsers) {
    rooms.push({
        name: key,
        participant: value.length,
    });
    }
    return rooms;
}