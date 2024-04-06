import useAxios from "axios-hooks";
// Define your desired data format
export interface MyDataFormat {
    name: string;
    description: string;
    tracks: SpotifyTrack;
    // Add other properties as needed
}

interface SpotifyTrack {
    items: SpotifyTrackItem[]
}

interface SpotifyTrackItem {
    track: TrackDetail
}

export interface TrackDetail {
    name: string;
    preview_url: string;
}
