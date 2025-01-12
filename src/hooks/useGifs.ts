import { Gif } from "@/types";
import { useCallback, useEffect, useState } from "react";
import { NativeSyntheticEvent, TextInputSubmitEditingEventData } from "react-native";

export default function useGifs() {
    const apiKey = process.env.EXPO_PUBLIC_GIPHY_API_KEY;
    const [gifs, setGifs] = useState<Gif[]>([]);
    const [loading, setLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [query, setQuery] = useState('');

    const fetchGifs = useCallback(async () => {
        if (loading || !hasMore) return;
        setLoading(true);
        try {
            const url = `https://api.giphy.com/v1/gifs/${query ? 'search' : 'trending'}?api_key=${apiKey}&limit=15&offset=${offset}${query ? `&q=${query}` : ''}`;
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
    }, [loading, hasMore, query, offset, apiKey]);

    useEffect(() => {
        fetchGifs();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const pullToRefresh = useCallback(() => {
        setGifs([]);
        setOffset(0);
        setHasMore(true);
    }, []);

    const search = useCallback((e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
        setGifs([]);
        setOffset(0);
        setHasMore(true);
        setQuery(e.nativeEvent.text);
    }, []);

    const loadMore = useCallback(() => {
        if (!loading && hasMore) {
            fetchGifs();
        }
    }, [loading, hasMore, fetchGifs]);

    return { loading, gifs, pullToRefresh, query, search, loadMore };
}