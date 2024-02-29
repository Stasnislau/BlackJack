import { useEffect, useState } from 'react';
import { connection } from '../connection';
const GamePage = () => {
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {
        async function startConnection() {

            if (connection.state === "Disconnected") {
                try {
                    await connection.start();
                    console.log('SignalR Connected.');
                    setIsConnected(true);
                } catch (err) {
                    console.error('SignalR Connection Error: ', err);
                }
            }
        }

        if (!isConnected && connection.state === "Disconnected") {
            startConnection();
        }

        connection.onclose(() => {
            console.log('SignalR Disconnected.');
            setIsConnected(false);
            startConnection();
        });

        return () => {
            if (connection.state === "Connected")
                connection.stop();
        };
    }, []);

    return (
        <div>
            <h1>Game Page</h1>
            {isConnected ? <p>Connected</p> : <p>Disconnected</p>}
        </div>
    );
};

export default GamePage;
