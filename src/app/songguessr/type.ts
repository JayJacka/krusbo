import useAxios from "axios-hooks";
// Define your desired data format
export interface PlaylistTracks {
  name: string;
  description: string;
  tracks: SpotifyTrack;
}

interface SpotifyTrack {
  items: SpotifyTrackItem[];
}

interface SpotifyTrackItem {
  track: TrackDetail;
}

export interface TrackDetail {
  name: string;
  preview_url: string;
}

export interface Category {
  categories: CategoryItems;
}

interface CategoryItems {
  items: CategoryItem[];
}
export interface CategoryItem {
  id: string;
  name: string;
}

export interface CategoryPlaylists {
  playlists: Playlist;
}

interface Playlist {
  items: PlaylistItem[];
}

export interface PlaylistItem {
  name: string;
  id: string;
  images: Image[];
}

interface Image {
  url: string;
}

export interface CategoryWithPlaylists {
  id: string;
  name: string;
  playlists: PlaylistItem[];
}

export type ScoreCardProps = {
  avatar: string;
  name: string;
  score: number;
};

export type userScore = {
  userId: string;
  score: number;
};

export type userNameImage = {
  userId: string;
  name: string;
  image: string;
};

export type leaderProps = {
  name: string;
  avatar: string;
  score: number;
};

export type GroupMessage = {
  content: string;
  from: Sender;
  room: string;
  id: string;
};

type Sender = {
  username: string,
  avatar: string
}