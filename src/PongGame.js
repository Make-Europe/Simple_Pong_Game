import React, { useState, useEffect, useRef } from 'react';
import './PongGame.css';

const PongGame = ({ mode, onReturnToMenu }) => {
  const canvasRef = useRef(null);
  const [ball, setBall] = useState({ x: 300, y: 450, dx: 4, dy: 4 });
  const [paddle1, setPaddle1] = useState({ x: 250, y: 880, width: 100, height: 10 });
  const [paddle2, setPaddle2] = useState({ x: 250, y: 10, width: 100, height: 10 });
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [isPaused, setIsPaused] = useState(false);

  const drawBall = (ctx, ball) => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 15, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.closePath();
  };

  const drawPaddle = (ctx, paddle, playerScore) => {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = '#0095DD';

    // Adjust paddle outline color and thickness based on score
    ctx.strokeStyle = playerScore >= 50 ? 'white' : playerScore >= 25 ? 'yellow' : playerScore >= 10 ? 'white' : 'transparent';
    ctx.lineWidth = playerScore >= 50 ? 9 : playerScore >= 25 ? 6 : playerScore >= 10 ? 4 : 0;

    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  };

  const drawScore = (ctx, score) => {
    ctx.font = '24px Arial';
    ctx.fillStyle = '#0095DD';
    const scoreText = mode === 'solo' ? `Score: ${score.player1}` : `${score.player2} : ${score.player1}`;
    ctx.fillText(scoreText, 280, 450); // Centered position
  };

  const moveBall = (ball, paddle1, paddle2) => {
    let newBall = { ...ball };
    newBall.x += newBall.dx;
    newBall.y += newBall.dy;

    // Ball collision with walls
    if (newBall.y + newBall.dy > 900 || newBall.y + newBall.dy < 0) {
      newBall.dy = -newBall.dy;
    }
    if (newBall.x + newBall.dx > 600 || newBall.x + newBall.dx < 0) {
      newBall.dx = -newBall.dx;
    }

    // Ball collision with paddle1
    if (newBall.y + newBall.dy > paddle1.y && newBall.x > paddle1.x && newBall.x < paddle1.x + paddle1.width) {
      newBall.dy = -newBall.dy;
      newBall.y = paddle1.y - 10;
      setScore((prevScore) => ({ ...prevScore, player1: prevScore.player1 + 5 }));
    }

    // Ball collision with paddle2
    if (mode !== 'solo' && newBall.y + newBall.dy < paddle2.y + paddle2.height && newBall.x > paddle2.x && newBall.x < paddle2.x + paddle2.width) {
      newBall.dy = -newBall.dy;
      newBall.y = paddle2.y + paddle2.height + 10;
      setScore((prevScore) => ({ ...prevScore, player2: prevScore.player2 + 5 }));
    }

    return newBall;
  };

  const movePaddle = (paddleSetter, direction) => {
    const moveStep = 25;
    paddleSetter((prevPaddle) => ({
      ...prevPaddle,
      x: Math.max(0, Math.min(prevPaddle.x + direction * moveStep, 600 - prevPaddle.width)),
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'ArrowLeft') movePaddle(setPaddle1, -1);
    else if (e.key === 'ArrowRight') movePaddle(setPaddle1, 1);
    else if (e.key === 'a' && mode !== 'solo') movePaddle(setPaddle2, -1);
    else if (e.key === 'd' && mode !== 'solo') movePaddle(setPaddle2, 1);
    else if (e.key === ' ') setIsPaused((prev) => !prev);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    window.addEventListener('keydown', handleKeyDown);

    const interval = setInterval(() => {
      if (!isPaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setBall((prevBall) => moveBall(prevBall, paddle1, paddle2));
        drawBall(ctx, ball);
        drawPaddle(ctx, paddle1, score.player1);
        if (mode !== 'solo') drawPaddle(ctx, paddle2, score.player2);
        drawScore(ctx, score);
      }
    }, 10);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [ball, paddle1, paddle2, score, isPaused, mode]);

  return (
    <div className="pong-container">
      {/* Player 2 Controls (Top Paddle) - only visible in "Shared" or "Online" modes */}
      {mode !== 'solo' && (
        <div className="control-icons-container">
          <span className="control-icon" onClick={() => movePaddle(setPaddle2, -1)}>⬅️</span>
          <span className="control-icon" onClick={() => movePaddle(setPaddle2, 1)}>➡️</span>
        </div>
      )}

      <canvas ref={canvasRef} width="600" height="900" />

      {/* Player 1 Controls (Bottom Paddle) */}
      <div className="control-icons-container">
        <span className="control-icon" onClick={() => movePaddle(setPaddle1, -1)}>⬅️</span>
        <span className="control-icon" onClick={() => movePaddle(setPaddle1, 1)}>➡️</span>
      </div>

      {/* Pause Overlay */}
      {isPaused && (
        <div className="pause-overlay">
          <h2>Paused</h2>
          <button onClick={() => setIsPaused(false)}>Continue</button>
          <button onClick={onReturnToMenu}>Menu</button>
        </div>
      )}

      {/* Pause Button */}
      <button onClick={() => setIsPaused(!isPaused)} className="pause-button">
        {isPaused ? 'Resume' : 'Pause'}
      </button>
    </div>
  );
};

export default PongGame;
