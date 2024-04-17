"use client"
import { useState } from 'react';
import Image from 'next/image';
import { Button } from '~/components/ui/button';
import { CategoryWithPlaylists } from '../type';

interface PlaylistSelectionProp{
    categoryPlaylists: CategoryWithPlaylists[];
    selectedPlaylist: string;
    setSelectedPlaylist: (id: string) => void;
}

export function PlaylistSelection(prop: PlaylistSelectionProp) {
    const {categoryPlaylists, selectedPlaylist, setSelectedPlaylist} = prop;
    const [selectedCategory, setSelectedCategory] = useState(0);

    return <div className='flex flex-col items-center gap-3'>
        <h1 className='text-white'>Select A Playlist</h1>
        <div className='flex flex-row gap-2'>
        {categoryPlaylists.map((category, index) => (
                <Button key={index} onClick={() => setSelectedCategory(index)} 
                className={"bg-slate-300 hover:bg-slate-400 text-primary "+
                    (selectedCategory==index ? "bg-yellow" : "")}>
                {category.name} </Button>
        ))}
        </div>
        <div className='flex flex-wrap items-center gap-3 overflow-auto max-h-80 w-full'>
            {categoryPlaylists[selectedCategory]?.playlists.map((p, index)=>(
                <Button key={index}
                    onClick={() => setSelectedPlaylist(p.id)}
                    className={(selectedPlaylist==p.id ? "bg-slate-100 " : "")+
                        'w-fit h-fit p-2 hover:bg-slate-400'}>
                    <Image key={p.id} src={p.images[0]?.url!} alt='cover_img' width={100} height={100}/>
                </Button>
            ))}
        </div>
    </div>
}