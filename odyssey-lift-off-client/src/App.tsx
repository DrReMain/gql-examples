import styles from './App.module.css'
import React, {useState} from 'react';
import {request} from 'graphql-request'
import {useMutation, useQuery} from '@tanstack/react-query'
import {gql} from './__generated__'

const TRACKS = gql(`
    query GetTracks {
        tracksForHome {
            id
            title
            thumbnail
            length
            modulesCount
            author {
                id
                name
                photo
            }
        }
    }
`)

const GET_TRACK = gql(`
    query GetTrack($trackId: ID!) {
        track(id: $trackId) {
            id
            title
            author {
                id
                name
                photo
            }
            thumbnail
            length
            modulesCount
            numberOfViews
            modules {
                id
                title
                length
            }
            description
        }
    }

`)

const INCREMENT_TRACK_VIEWS = gql(`
    mutation IncrementTrackViews($incrementTrackViewsId: ID!) {
        incrementTrackViews(id: $incrementTrackViewsId) {
            code
            success
            message
        }
    }
`)

function App() {
    const [trackId, setTrackId] = useState('')

    const {data} = useQuery({
        queryKey: ['tracks'],
        queryFn: () => request("http://localhost:4000", TRACKS)
    })

    const queryTrack = useQuery({
        queryKey: ['track', trackId],
        queryFn: () => request("http://localhost:4000", GET_TRACK, {trackId}),
        enabled: !!trackId
    })

    const {mutateAsync} = useMutation({
        mutationKey: ['incrementTrackViews'],
        mutationFn: (incrementTrackViewsId: string) => request("http://localhost:4000", INCREMENT_TRACK_VIEWS, {incrementTrackViewsId}),
        onSuccess: (data, variables) => {
            if (data.incrementTrackViews.success && variables === trackId)
                queryTrack.refetch();
        }
    })

    return (
        <div className={styles.App}>
            <div className={styles.left}>
                {data?.tracksForHome.map((_) =>
                    <div key={_.id}>
                        <ul>
                            <li>title: {_.title}</li>
                            <li>author.name: {_.author.name}</li>
                            <li>
                                <button onClick={() => setTrackId(_.id)}>GET TRACK</button>
                            </li>
                            <li>
                                <button onClick={() => mutateAsync(_.id)}>INCREMENT</button>
                            </li>
                        </ul>
                    </div>
                )}
            </div>

            <div className={styles.right}>
                {queryTrack.isFetching ? <div className={styles.loading}>
                    LOADING...
                </div> : !queryTrack.data ? <div>
                    无数据
                </div> : <pre>
                    {JSON.stringify(queryTrack.data, null, 2)}
                </pre>}
            </div>
        </div>
    );
}

export default App;
