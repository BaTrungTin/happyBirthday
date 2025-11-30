import { useState, useEffect, useRef } from "react";
import "./birthdayCard.css";

import cake1 from "../assets/cake/cake1.png";
import cake2 from "../assets/cake/cake2.png";
import cake3 from "../assets/cake/cake3.png";
import step20 from "../assets/cake/20.png";
import step40 from "../assets/cake/40.png";
import step60 from "../assets/cake/60.png";
import step80 from "../assets/cake/80.png";
import step100 from "../assets/cake/100.png";

function BirthdayCard() {
  const [candleLit, setCandleLit] = useState(true);
  const [cakeClicked, setCakeClicked] = useState(false);
  const [candleBlown, setCandleBlown] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const mainCakeImages = [cake1, cake2, cake3];
  const blowAnimationImages = [step20, step40, step60, step80, step100];

  // Refs cho audio elements
  const backgroundMusicRef = useRef(null);
  const clickSoundRef = useRef(null);
  const blowSoundRef = useRef(null);
  const birthdaySoundRef = useRef(null);

  useEffect(() => {
    if (candleLit && !cakeClicked && !candleBlown) {
      // Chuyen doi giua cake1 va cake2 lien tuc de tao hieu ung nen chay
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev === 0 ? 1 : 0));
      }, 500); // 500ms moi lan chuyen doi

      return () => clearInterval(interval);
    }
  }, [candleLit, cakeClicked, candleBlown]);

  // Animation tiep tuc sau khi nen tat
  useEffect(() => {
    if (!candleLit && candleBlown && !isAnimating) {
      // Sau khi nen tat, tiep tuc animation giua cake1 va cake2
      const interval = setInterval(() => {
        setCurrentImageIndex((prev) => (prev === 0 ? 1 : 0));
      }, 500); // 500ms moi lan chuyen doi

      return () => clearInterval(interval);
    }
  }, [candleLit, candleBlown, isAnimating]);

  // Ham xu ly khi click vao banh
  const handleCakeClick = () => {
    if (!cakeClicked && !candleBlown) {
      setCakeClicked(true);

      // Phat am thanh click (chi 0.5 giay)
      if (clickSoundRef.current) {
        clickSoundRef.current.volume = 0.5;
        clickSoundRef.current.play().catch((e) => {
          console.log("Khong the phat am thanh click:", e);
        });

        // Tu dong dung sau 0.5 giay
        setTimeout(() => {
          if (clickSoundRef.current) {
            clickSoundRef.current.pause();
            clickSoundRef.current.currentTime = 0; // Reset ve dau
          }
        }, 500); // 500ms = 0.5 giay
      }

      // Doi 2 giay roi tu dong thoi nen
      setTimeout(() => {
        setIsAnimating(true);
        setCandleBlown(true);

        // Phat am thanh thoi nen
        if (blowSoundRef.current) {
          blowSoundRef.current.volume = 0.6;
          blowSoundRef.current.play().catch((e) => {
            console.log("Khong the phat am thanh thoi:", e);
          });
        }

        // Animation: chay qua cac anh 20, 40, 60, 80, 100
        let step = 0;
        const interval = setInterval(() => {
          if (step < blowAnimationImages.length) {
            setCurrentImageIndex(step);
            step++;
          } else {
            // Sau khi animation xong, tiep tuc animation
            setIsAnimating(false);
            setCandleLit(false);
            setCurrentImageIndex(0); // Reset ve 0 de animation bat dau tu cake1
            clearInterval(interval);

            // Dung am thanh click neu dang phat
            if (clickSoundRef.current) {
              clickSoundRef.current.pause();
              clickSoundRef.current.currentTime = 0; // Reset ve dau
            }

            // Phat am thanh sinh nhat khi nen tat
            if (birthdaySoundRef.current) {
              birthdaySoundRef.current.volume = 0.7;
              birthdaySoundRef.current.play().catch((e) => {
                console.log("Khong the phat am thanh sinh nhat:", e);
              });
            }

            // Khong reset nua, de banh tiep tuc animation
          }
        }, 250); // 250ms moi anh
      }, 2000); // Doi 2 giay
    }
  };

  // Ham chon anh hien thi
  const getCurrentImage = () => {
    // Neu dang trong qua trinh animation thoi nen
    if (isAnimating && candleBlown) {
      return blowAnimationImages[currentImageIndex] || blowAnimationImages[0];
    }
    // Neu da thoi xong va nen da tat - tiep tuc animation
    else if (candleBlown && !isAnimating && !candleLit) {
      return mainCakeImages[currentImageIndex] || mainCakeImages[0]; // Animation giua cake1 va cake2
    }
    // Neu da click vao banh
    else if (cakeClicked) {
      return mainCakeImages[1]; // cake2
    }
    // Ban dau - animation tu dong chay lien tuc
    else {
      return mainCakeImages[currentImageIndex] || mainCakeImages[0];
    }
  };

  return (
    <div className="birthday-card">
      <div className="card-content">
        {/* Text ben trai */}
        <div className="text-section">
          <h1 className="handwriting">Chúc mừng sinh nhật Cutie(BQUA)</h1>
          {!cakeClicked ? (
            <p className="handwriting instruction">
              Bấm vào bánh sau đó thổi nến
            </p>
          ) : !candleBlown ? (
            <p className="handwriting instruction">
              Bấm vào bánh sau đó thổi nến
            </p>
          ) : !candleLit ? (
            <>
              <p className="handwriting instruction">Chúc mừng sinh nhật! 🎉</p>
              <div className="special-message">
                <p className="handwriting special-text">
                  Chúc em sinh nhật vui vẻ! 🎂
                </p>
                <p className="handwriting special-text">Love you ❤️</p>
              </div>
            </>
          ) : (
            <p className="handwriting instruction">hẹ hẹ</p>
          )}
          <p className="handwriting small-text">(26/03 )</p>
        </div>

        {/* Banh ben phai */}
        <div className="cake-section">
          <div
            className={`cake-container ${
              candleLit && !candleBlown ? "candle-burning" : ""
            }`}
            onClick={handleCakeClick}
            style={{ cursor: cakeClicked ? "default" : "pointer" }}
          >
            <img
              src={getCurrentImage()}
              alt="Birthday Cake"
              className="cake-image"
            />
          </div>
        </div>
      </div>

      {/* Audio elements - An nhung van hoat dong */}
      <audio
        ref={backgroundMusicRef}
        preload="auto"
        style={{ display: "none" }}
      >
        {/* Nhac nen - co the them sau neu can */}
      </audio>
      <audio ref={clickSoundRef} preload="auto" style={{ display: "none" }}>
        <source src="./sounds/clicksound.mp3" type="audio/mpeg" />
      </audio>
      <audio ref={blowSoundRef} preload="auto" style={{ display: "none" }}>
        {/* Am thanh thoi - co the them sau neu can */}
      </audio>
      <audio ref={birthdaySoundRef} preload="auto" style={{ display: "none" }}>
        <source src="./sounds/happybirthday.mp3" type="audio/mpeg" />
      </audio>
    </div>
  );
}

export default BirthdayCard;
