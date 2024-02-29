import { useEffect, useState } from 'react';
import { connection } from '../connection';
// Create the connection instance 
const GamePage = () => {
    // State to track whether we are connected or not
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
            console.log("Wyzow startConnection");
            startConnection();
        }

        connection.onclose(() => {
            console.log('SignalR Disconnected.');
            setIsConnected(false); // Set the state to false once disconnected
            startConnection();
        });

        return () => {
            if (connection.state === "Connected")
                connection.stop();
        };
    }, []); // Only re-run the effect if isConnected changes

    return (
        <div>
            <h1>Game Page</h1>
            {/* Display connection status based on isConnected */}
            {isConnected ? <p>Connected</p> : <p>Disconnected</p>}
        </div>
    );
};

export default GamePage;
