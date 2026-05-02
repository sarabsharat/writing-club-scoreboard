import { useMemo } from "react";

export default function Scoreboard({ teams, updateScore, removeTeam }) {
    // Calculate max score to scale the bars properly
    const maxScore = useMemo(() => {
        return teams.length > 0
            ? Math.max(...teams.map(t => t.score), 20)
            : 20;
    }, [teams]);

    return (
        <div className="scoreboard">
            {teams.length === 0 && (
                <p style={{ textAlign: 'center', fontStyle: 'italic', gridColumn: '1 / -1' }}>
                    No teams yet. Add some writers to begin!
                </p>
            )}

            {teams.map((team) => {
                const isLeader = team.score === Math.max(...teams.map(t => t.score)) && team.score > 0;
                const width = maxScore === 0 ? 0 : (team.score / maxScore) * 100;

                return (
                    <div key={team.id} className={`card ${isLeader ? "leader" : ""}`}>
                        <div className="card-header">
                            <h3>{isLeader ? "✒️ " : ""}{team.name}</h3>
                            <span className="score">{team.score}</span>
                        </div>

                        <div className="bar-container">
                            <div className="bar" style={{ width: `${width}%` }} />
                        </div>

                        <div className="controls">
                            <button className="icon-btn" onClick={() => updateScore(team.id, -1)} title="Deduct Point">-</button>
                            <button className="icon-btn" onClick={() => updateScore(team.id, 1)} title="Add Point">+</button>
                            <button className="icon-btn remove" onClick={() => removeTeam(team.id)} title="Remove Team">
                                ✕
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}