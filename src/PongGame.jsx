import React, { useState, useEffect, useRef, useCallback } from 'react';
import './PongGame.css';

const PongGame = ({ mode, onReturnToMenu }) => {
  const canvasRef = useRef(null);
  const [ball, setBall] = useState({ x: 300, y: 450, dx: 4, dy: 4 });
  const [paddle1, setPaddle1] = useState({ x: 250, y: 870, width: 100, height: 33 });
  const [paddle2, setPaddle2] = useState({ x: 250, y: 0, width: 100, height: 33 });
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [isPaused, setIsPaused] = useState(false);
  const [lineCracks, setLineCracks] = useState([]);
  const [touchStartX, setTouchStartX] = useState(null);

  const ballRadius = 15;

  const togglePause = () => {
    setIsPaused((prev) => !prev);
  };   

  const drawBall = (ctx, ball) => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();
    ctx.closePath();
  };

  const drawPaddle = useCallback((ctx, paddle, playerScore) => {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = '#0095DD';

    ctx.strokeStyle = playerScore >= 100 ? 'purple' : playerScore >= 50 ? 'red' : playerScore >= 25 ? 'blue' : playerScore >= 10 ? 'white' : 'transparent';
    ctx.lineWidth = playerScore >= 100 ? '30' : playerScore >= 50 ? 24 : playerScore >= 25 ? 16 : playerScore >= 10 ? 8 : 0;

    ctx.fill();
    ctx.stroke();
    ctx.closePath();
  }, []);

  const drawBoundaryLines = useCallback((ctx) => {
    const lineWidth = 600;
    ctx.strokeStyle = 'yellow';
    ctx.lineWidth = 12;

    ctx.beginPath();
    for (let x = 0; x < lineWidth; x += 3) {
      if (!lineCracks.some(crack => crack.y === 'bottom' && x >= crack.x && x < crack.x + crack.width)) {
        ctx.moveTo(x, paddle1.y + 12);
        ctx.lineTo(x + 3, paddle1.y + 12);
      }
    }

    if (mode !== 'solo') {
      for (let x = 0; x < lineWidth; x += 3) {
        if (!lineCracks.some(crack => crack.y === 'top' && x >= crack.x && x < crack.x + crack.width)) {
          ctx.moveTo(x, paddle2.y + paddle2.height - 8);
          ctx.lineTo(x + 3, paddle2.y + paddle2.height - 8);
        }
      }
    }
    ctx.stroke();
    ctx.closePath();
  }, [lineCracks, mode, paddle1.y, paddle2.y, paddle2.height]);

  const drawScore = useCallback((ctx) => {
    ctx.font = '30px Arial';
    ctx.fillStyle = '#0095DD';
    const scoreText = mode === 'solo' ? `${score.player1}` : `${score.player2} : ${score.player1}`;
    ctx.fillText(scoreText, 280, 450);
  }, [mode, score]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft') setPaddle1((paddle) => ({ ...paddle, x: Math.max(paddle.x - 50, 0) }));
    else if (e.key === 'ArrowRight') setPaddle1((paddle) => ({ ...paddle, x: Math.min(paddle.x + 50, 600 - paddle.width) }));
    else if (e.key === 'a' && mode !== 'solo') setPaddle2((paddle) => ({ ...paddle, x: Math.max(paddle.x - 50, 0) }));
    else if (e.key === 'd' && mode !== 'solo') setPaddle2((paddle) => ({ ...paddle, x: Math.min(paddle.x + 50, 600 - paddle.width) }));
    else if (e.key === ' ') togglePause();
  }, [mode]);

  const handleTouchStart = (event) => {
  const touchY = event.touches[0].clientY;
  const touchX = event.touches[0].clientX;

  // Determine which paddle to control based on the Y position of the touch
  if (touchY < window.innerHeight / 2 && mode !== 'solo') {
    setTouchStartX({ paddle: 'paddle2', x: touchX });
  } else {
    setTouchStartX({ paddle: 'paddle1', x: touchX });
  }
};

const handleTouchMove = (event) => {
  if (touchStartX !== null) {
    const touchX = event.touches[0].clientX;
    const deltaX = touchX - touchStartX.x;

    // Move the appropriate paddle based on the initial touch position
    if (touchStartX.paddle === 'paddle1') {
      setPaddle1((prev) => ({
        ...prev,
        x: Math.min(Math.max(prev.x + deltaX, 0), 600 - prev.width),
      }));
    } else if (touchStartX.paddle === 'paddle2') {
      setPaddle2((prev) => ({
        ...prev,
        x: Math.min(Math.max(prev.x + deltaX, 0), 600 - prev.width),
      }));
    }

    // Update the starting position for continuous tracking
    setTouchStartX((prev) => ({ ...prev, x: touchX }));
  }
};
    
  const moveBall = useCallback((ball, paddle1, paddle2) => {
    let newBall = { ...ball };
    newBall.x += newBall.dx;
    newBall.y += newBall.dy;

    if (newBall.x + newBall.dx > 600 || newBall.x + newBall.dx < 0) {
      newBall.dx = -newBall.dx;
    }

    if (mode === 'solo' && newBall.y + newBall.dy < 0) {
      newBall.dy = -newBall.dy;
    }

    if (newBall.y + newBall.dy > paddle1.y + 12 && newBall.y < paddle1.y + 15) {
      const crack = lineCracks.find(crack => crack.y === 'bottom' && newBall.x >= crack.x && newBall.x < crack.x + crack.width);
      if (crack && crack.width >= 20) {
        alert("GAME OVER! Player 1 loses. Try again!");
        onReturnToMenu();
      } else {
        newBall.dy = -newBall.dy;
        setLineCracks((prevCracks) => [...prevCracks, { x: newBall.x, y: 'bottom', width: 22 }]);
      }
    }

    if (mode !== 'solo' && newBall.y + newBall.dy < paddle2.y + paddle2.height - 8 && newBall.y > paddle2.y + paddle2.height - 12) {
      const crack = lineCracks.find(crack => crack.y === 'top' && newBall.x >= crack.x && newBall.x < crack.x + crack.width);
      if (crack && crack.width >= 25) {
        alert("GAME OVER! Player 2 loses. Try again!");
        onReturnToMenu();
      } else {
        newBall.dy = -newBall.dy;
        setLineCracks((prevCracks) => [...prevCracks, { x: newBall.x, y: 'top', width: 22 }]);
      }
    }

    if (newBall.y + newBall.dy > paddle1.y && newBall.x > paddle1.x && newBall.x < paddle1.x + paddle1.width) {
      newBall.dy = -newBall.dy;
      newBall.y = paddle1.y - 10;
      setScore((prevScore) => ({ ...prevScore, player1: prevScore.player1 + 5 }));
    }
    if (mode !== 'solo' && newBall.y + newBall.dy < paddle2.y + paddle2.height && newBall.x > paddle2.x && newBall.x < paddle2.x + paddle2.width) {
      newBall.dy = -newBall.dy;
      newBall.y = paddle2.y + paddle2.height + 10;
      setScore((prevScore) => ({ ...prevScore, player2: prevScore.player2 + 5 }));
    }

    return newBall;
  }, [mode, lineCracks, onReturnToMenu]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
  
    // Attach keyboard event listener
    window.addEventListener('keydown', handleKeyDown);
  
    // Attach touch event listeners to the canvas
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
  
    // Game update interval
    const interval = setInterval(() => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setBall((prevBall) => moveBall(prevBall, paddle1, paddle2));
      drawBall(ctx, ball);
      drawPaddle(ctx, paddle1, score.player1);
      if (mode !== 'solo') drawPaddle(ctx, paddle2, score.player2);
      drawScore(ctx);
      drawBoundaryLines(ctx);
    }, 10);
  
    // Cleanup function
    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [ball, paddle1, paddle2, score, mode, handleKeyDown, handleTouchStart, handleTouchMove, moveBall, drawScore, drawBoundaryLines, drawPaddle]);  

  return (
    <div className="pong-container">
      {mode !== 'solo' && (
        <div className="control-icons-container control-icons-top">
          <span className="control-icon" onClick={() => setPaddle2((prev) => ({ ...prev, x: Math.max(prev.x - 35, 0) }))}>⬅️</span>
          <span className="control-icon" onClick={() => setPaddle2((prev) => ({ ...prev, x: Math.min(prev.x + 35, 600 - paddle2.width) }))}>➡️</span>
        </div>
      )}

      <canvas ref={canvasRef} width="600" height="900" />

      <div className="control-icons-container control-icons-bottom">
        <span className="control-icon" onClick={() => setPaddle1((prev) => ({ ...prev, x: Math.max(prev.x - 35, 0) }))}>⬅️</span>
        <span className="control-icon" onClick={() => setPaddle1((prev) => ({ ...prev, x: Math.min(prev.x + 35, 600 - paddle1.width) }))}>➡️</span>
      </div>

      {isPaused && (
        <div className="pause-overlay">
          <h2>Paused</h2>
          <button onClick={togglePause}>Continue</button>
          <button onClick={onReturnToMenu}>Menu</button>
        </div>
      )}

      {/*
    <button onClick={togglePause} className="pause-button">
      {isPaused ? 'Resume' : 'Pause'}
    </button>
    */}
    </div>
  );
};

export default PongGame;
