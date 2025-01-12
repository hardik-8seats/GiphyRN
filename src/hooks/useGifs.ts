import { Gif } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { NativeSyntheticEvent, TextInputSubmitEditingEventData } from "react-native";

export default function useGifs() {
    const apiURL = process.env.EXPO_PUBLIC_API_URL;
    const apiKey = process.env.EXPO_PUBLIC_GIPHY_API_KEY;
    const [gifs, setGifs] = useState<Gif[]>([]);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [query, setQuery] = useState('');

    // Fetch GIFs from the GIPHY API
    const fetchGifs = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const url = `${apiURL}/${query ? 'search' : 'trending'}?api_key=${apiKey}&limit=15&offset=${offset}${query ? `&q=${query}` : ''}`;
            const response = await fetch(url);
            const data = await response.json();
            if (offset === 0) setGifs(data.data);
            else setGifs((prevGifs) => [...prevGifs, ...data.data]);
            setOffset(offset + data.data?.length);
            setHasMore(data.pagination?.total_count > offset + data.data?.length);
        } catch (error) {
            console.error("Error fetching gifs:", error);
        } finally {
            setLoading(false);
        }
    }, [loading, hasMore, query, offset, apiKey, apiURL]);

    // Fetch GIFs when the component mounts
    useEffect(() => {
        fetchGifs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Reset the GIFs when the user pulls to refresh
    const pullToRefresh = useCallback(() => {
        setGifs([]);
        setOffset(0);
        setHasMore(true);
    }, []);

    // Search for GIFs when the user submits the search input
    const search = useCallback((e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
        setGifs([]);
        setOffset(0);
        setHasMore(true);
        setQuery(e.nativeEvent.text);
    }, []);

    // Load more GIFs when the user scrolls to the end of the list
    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            fetchGifs();
        }
    }, [loading, hasMore, fetchGifs]);

    return { loading, gifs, pullToRefresh, query, search, loadMore };
}