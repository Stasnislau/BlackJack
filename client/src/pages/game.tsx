import React, { useEffect } from 'react';
import { connection } from '../connection';

const GamePage = () => {
    useEffect(() => {
        async function start() {
            try {
                await connection.start();
                console.log('SignalR Connected.');
            } catch (err) {
                console.log(err);
                setTimeout(start, 5000);
            }
        }

        connection.onclose(start);
        start();

        return () => {
            connection.stop();
        };
    }, []);
    return (
        <div>
            <h1>Game Page</h1>

        </div>
    );
}
export default GamePage;