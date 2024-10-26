import React, { useState, useEffect, useRef } from 'react';
import './PongGame.css';
// import WebApp from '@twa-dev/sdk'

const PongGame = () => {
  const canvasRef = useRef(null);
  const [ball, setBall] = useState({ x: 300, y: 450, dx: 4, dy: 4 });
  const [paddle1, setPaddle1] = useState({ x: 250, y: 880, width: 100, height: 10 });
  const [paddle2, setPaddle2] = useState({ x: 250, y: 10, width: 100, height: 10 });
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [isPaused, setIsPaused] = useState(false);

  const drawBall = (ctx, ball) => {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, 10, 0, Math.PI * 2);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.closePath();
  };

  const drawPaddle = (ctx, paddle, playerScore) => {
    ctx.beginPath();
    ctx.rect(paddle.x, paddle.y, paddle.width, paddle.height);
    ctx.fillStyle = '#0095DD';
    ctx.fill();
    ctx.strokeStyle = playerScore >= 1000 ? 'yellow' : playerScore >= 250 ? 'purple' : playerScore >= 100 ? 'white' : 'transparent';
    ctx.lineWidth = playerScore >= 1000 ? 6 : playerScore >= 250 ? 4 : playerScore >= 100 ? 2 : 0;
    ctx.stroke();
    ctx.closePath();
  };

  const drawScore = (ctx, score) => {
    ctx.font = '24px Arial';
    ctx.fillStyle = '#0095DD';
    ctx.fillText(`${score.player2} : ${score.player1}`, 280, 450);
  };

  const moveBall = (ball, paddle1, paddle2, score) => {
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
    if (
      newBall.y + newBall.dy > paddle1.y &&
      newBall.x > paddle1.x &&
      newBall.x < paddle1.x + paddle1.width
    ) {
      newBall.dy = -newBall.dy;
      newBall.y = paddle1.y - 10; // Move the ball out of the paddle
      setScore((prevScore) => ({ ...prevScore, player1: prevScore.player1 + 5 }));
    }

    // Ball collision with paddle2
    if (
      newBall.y + newBall.dy < paddle2.y + paddle2.height &&
      newBall.x > paddle2.x &&
      newBall.x < paddle2.x + paddle2.width
    ) {
      newBall.dy = -newBall.dy;
      newBall.y = paddle2.y + paddle2.height + 10; // Move the ball out of the paddle
      setScore((prevScore) => ({ ...prevScore, player2: prevScore.player2 + 5 }));
    }

    return newBall;
  };

  const handleKeyDown = (e) => {
    // Increase the move step from 20 to 25 for 25% more speed
    const moveStep = 25;  
    if (e.key === 'ArrowLeft') {
      setPaddle1((prevPaddle) => ({ ...prevPaddle, x: Math.max(prevPaddle.x - moveStep, 0) }));
    } else if (e.key === 'ArrowRight') {
      setPaddle1((prevPaddle) => ({ ...prevPaddle, x: Math.min(prevPaddle.x + moveStep, 600 - prevPaddle.width) }));
    } else if (e.key === 'a') {
      setPaddle2((prevPaddle) => ({ ...prevPaddle, x: Math.max(prevPaddle.x - moveStep, 0) }));
    } else if (e.key === 'd') {
      setPaddle2((prevPaddle) => ({ ...prevPaddle, x: Math.min(prevPaddle.x + moveStep, 600 - prevPaddle.width) }));
    }
  };
  
  const handleTouchMove = (e) => {
    const touchX = e.touches[0].clientX;
    setPaddle1((prevPaddle) => ({
      ...prevPaddle,
      x: Math.max(Math.min(touchX - canvasRef.current.offsetLeft - prevPaddle.width / 2, 600 - prevPaddle.width), 0),
    }));
  };
  

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    window.addEventListener('keydown', handleKeyDown);
    canvas.addEventListener('touchmove', handleTouchMove);

    const interval = setInterval(() => {
      if (!isPaused) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setBall((prevBall) => moveBall(prevBall, paddle1, paddle2, score));
        drawBall(ctx, ball);
        drawPaddle(ctx, paddle1, score.player1);
        drawPaddle(ctx, paddle2, score.player2);
        drawScore(ctx, score);
      }
    }, 10);

    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
      canvas.removeEventListener('touchmove', handleTouchMove);
    };
  }, [ball, paddle1, paddle2, score, isPaused]);

  // WebApp.showAlert("aaa")

  return (
    <div className="pong-container">
      <button onClick={() => setIsPaused(!isPaused)} className="pause-button">
        {isPaused ? 'Resume' : 'Pause'}
      </button>
      <canvas ref={canvasRef} width="600" height="900" />
      <div className="control-text top-left">(←A)</div>
      <div className="control-text top-right">(D→)</div>
      <div className="control-text bottom-left">(←)</div>
      <div className="control-text bottom-right">(→)</div>
    </div>
  );
};

export default PongGame;
