import { useState, useEffect } from "react";
import confetti from "canvas-confetti";
import "./style.css";
import Scoreboard from "./Scoreboard.jsx";
import logo from "./logo.png";

export default function App() {
    const [teams, setTeams] = useState([
        { id: 1, name: "The Novelists", score: 10 },
        { id: 2, name: "The Poets", score: 5 },
        { id: 3, name: "The Essayists", score: 8 },
        { id: 4, name: "The Playwrights", score: 12 },
    ]);
    const [newTeam, setNewTeam] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [winners, setWinners] = useState([]);

    const playSound = (type) => {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;

        const ctx = new AudioContext();
        const osc = ctx.createOscillator();
        const gainNode = ctx.createGain();

        osc.connect(gainNode);
        gainNode.connect(ctx.destination);

        if (type === 'up') {
            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
            osc.start();
            osc.stop(ctx.currentTime + 0.1);
        } else if (type === 'down') {
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(200, ctx.currentTime);
            gainNode.gain.setValueAtTime(0.1, ctx.currentTime);
            osc.start();
            osc.stop(ctx.currentTime + 0.15);
        }
    };

    // --- BIG CONFETTI EXPLOSION ---
    const fireBigConfetti = () => {
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 5,
                angle: 60,
                spread: 55,
                origin: { x: 0 },
                colors: ['#2C402E', '#F4F1EA', '#8A9A8B', '#D4AF37']
            });
            confetti({
                particleCount: 5,
                angle: 120,
                spread: 55,
                origin: { x: 1 },
                colors: ['#2C402E', '#F4F1EA', '#8A9A8B', '#D4AF37']
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    };

    const handleEndGame = () => {
        if (teams.length === 0) return;
        const maxScore = Math.max(...teams.map(t => t.score));

        // Prevent ending if no one has points
        if (maxScore === 0) return;

        // Find all teams with the highest score (in case of a tie)
        const winningTeams = teams.filter(t => t.score === maxScore);

        setWinners(winningTeams);
        setShowModal(true);
        fireBigConfetti();
    };

    const closeAndReset = () => {
        setShowModal(false);
        // Optional: Reset all scores to 0 when closing the modal
        // setTeams(teams.map(t => ({ ...t, score: 0 })));
    };

    const addTeam = (e) => {
        e.preventDefault();
        if (!newTeam.trim()) return;
        setTeams([...teams, { id: Date.now(), name: newTeam, score: 0 }]);
        setNewTeam("");
    };

    const updateScore = (id, change) => {
        if (change > 0) playSound('up');
        if (change < 0) playSound('down');

        setTeams(teams.map(team =>
            team.id === id
                ? { ...team, score: Math.max(0, team.score + change) }
                : team
        ));
    };

    const removeTeam = (id) => {
        setTeams(teams.filter(team => team.id !== id));
    };

    // --- AUTO-END IF A TEAM HITS 20 POINTS ---
    useEffect(() => {
        const maxScore = Math.max(...teams.map(t => t.score), 0);
        if (maxScore >= 20 && !showModal) {
            handleEndGame();
        }
    }, [teams]);

    return (
        <div className="app-container">
            <div className="header">
                <img src={logo} alt="HTU Writing Club Logo" className="logo" />
                <p>HTU Creative Writing and Poetry Club</p>
                <h1>2nd Session Scoreboard</h1>
            </div>

            {/* Changed from just a form to a flex container that holds the form AND the end button */}
            <div className="action-container">
                <form onSubmit={addTeam} className="form-container">
                    <input
                        value={newTeam}
                        onChange={(e) => setNewTeam(e.target.value)}
                        placeholder="Enter team name..."
                    />
                    <button type="submit">Add Team</button>
                </form>

                <button className="end-game-btn" onClick={handleEndGame}>
                    🏆 End Game
                </button>
            </div>

            <Scoreboard
                teams={teams}
                updateScore={updateScore}
                removeTeam={removeTeam}
            />

            {/* --- WINNER MODAL --- */}
            {showModal && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h2>🎉 Splendid! 🎉</h2>
                        <p className="modal-subtitle">The session has concluded. I present to you our winners:</p>

                        <div className="winners-list">
                            {winners.map(w => (
                                <div key={w.id} className="winner-item">
                                    <span className="winner-name">✒️ {w.name}</span>
                                    <span className="winner-score">{w.score} pts</span>
                                </div>
                            ))}
                        </div>

                        <button onClick={closeAndReset} className="close-modal-btn">Close Announcement</button>
                    </div>
                </div>
            )}
        </div>
    );
}