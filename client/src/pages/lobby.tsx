import React from 'react';
import { useNavigate } from 'react-router';

const Lobby = () => {
    const navigate = useNavigate();
    return (
        <div>
            <h1>Lobby</h1>
            <p>This is the lobby page</p>
            <button onClick={() => navigate('/game/123')}>Go to game</button>

        </div>
    );
}

export default Lobby;
