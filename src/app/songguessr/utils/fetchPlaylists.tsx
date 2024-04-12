import axios, { AxiosResponse } from "axios";
import { Category, CategoryItem, CategoryPlaylists, CategoryWithPlaylists } from "../type";
import getSpotifyToken from "~/utils/getSpotifyToken";

export async function fetchPlaylists(){
    let categoriesPlaylists:CategoryWithPlaylists[]= [];
    const token = (await getSpotifyToken()).access_token;
    
    const categories: AxiosResponse<Category> = await axios.get("https://api.spotify.com/v1/browse/categories",
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
    
    const categoriesData: CategoryItem[] = categories.data.categories.items.slice(2, 7);
    for (const category of categoriesData){
        const playlists = await fetchPlaylistsFromCategories(token, category.id)
        categoriesPlaylists.push({
            id: category.id,
            name: category.name,
            playlists: playlists
        })
    }

    return categoriesPlaylists;
}

async function fetchPlaylistsFromCategories(token: string, category_id: string){
    const limit = 30
    const playlists: AxiosResponse<CategoryPlaylists> = await axios.get(`https://api.spotify.com/v1/browse/categories/${category_id}/playlists?limit=${limit}`,
    {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    return playlists.data.playlists.items;
}