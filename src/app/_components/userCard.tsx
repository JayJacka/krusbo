"use client"

type UserCardProps = {
    name: string;
    index: number;
}
export function UserCard(prop: UserCardProps){
    // list color from tailwind config
    const colors = ["bg-blue","bg-pink","bg-orange","bg-green","bg-purple"]

    return <div className={"flex h-10 items-center justify-center text-white w-full rounded-xl "+colors[prop.index]}>
            <h3 className="text-2xl	">{prop.name}</h3>
        </div>
}