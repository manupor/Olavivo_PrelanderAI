import { BrandConfig } from '../../lib/types'
import { generateCSSVariables } from '@/lib/colors'

export function renderTemplate(brand: BrandConfig): { html: string; css: string } {
  const { brandName, logoUrl, colors, copy } = brand
  const { headline, subheadline, cta } = copy

  const css = `
    ${generateCSSVariables(colors)}
    
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    
    body {
      font-family: 'Inter', sans-serif;
      line-height: 1.6;
      color: #ffffff;
      background-image: url('/images/backgroundbonanza.png');
      background-size: cover;
      background-position: center;
      background-repeat: no-repeat;
      background-color: #000000;
      min-height: 100vh;
    }
    
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 1rem;
    }
    
    .slot-machine {
      background: linear-gradient(to bottom, #475569, #334155);
      border: 4px solid #facc15;
      border-radius: 1.5rem;
      padding: 1.5rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
    }
    
    .slot-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.5rem;
      background-color: #475569;
      padding: 1rem;
      border-radius: 0.75rem;
    }
    
    .slot-square {
      width: 5rem;
      height: 5rem;
      background: linear-gradient(to bottom, #fb923c, #eab308);
      border-radius: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.875rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    
    .game-controls {
      background: linear-gradient(to bottom, #475569, #334155);
      border: 4px solid #facc15;
      border-radius: 1.5rem;
      padding: 1.5rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      min-width: 280px;
    }
    
    .control-display {
      background-color: rgba(71, 85, 105, 0.8);
      border: 2px solid #64748b;
      border-radius: 0.75rem;
      padding: 1rem;
      margin-bottom: 1rem;
      box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
    }
    
    .spin-button {
      width: 100%;
      background: linear-gradient(to right, #f97316, #eab308);
      color: white;
      font-weight: 900;
      font-size: 1.25rem;
      padding: 1rem;
      border-radius: 9999px;
      border: none;
      cursor: pointer;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      transition: all 0.2s;
    }
    
    .spin-button:hover {
      transform: scale(1.05);
      background: linear-gradient(to right, #ea580c, #d97706);
    }
    
    .disclaimer {
      background: linear-gradient(to right, rgba(31, 41, 55, 0.9), rgba(17, 24, 39, 0.9));
      backdrop-filter: blur(4px);
      border: 1px solid rgba(75, 85, 99, 0.5);
      border-radius: 0.5rem;
      padding: 0.75rem 1.5rem;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
      display: inline-block;
      margin: 0 auto;
    }
  `

  const html = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${brandName} - ${headline || 'Premium Casino Experience'}</title>
      <style>${css}</style>
    </head>
    <body>
      <div style="min-height: 100vh; position: relative; overflow: hidden;">
        <!-- Animated Background -->
        <div style="position: absolute; inset: 0;">
          <div style="position: absolute; top: 5rem; left: 5rem; width: 8rem; height: 8rem; background-color: rgba(250, 204, 21, 0.2); border-radius: 50%; animation: pulse 2s infinite;"></div>
          <div style="position: absolute; top: 10rem; right: 8rem; width: 6rem; height: 6rem; background-color: rgba(236, 72, 153, 0.2); border-radius: 50%; animation: pulse 2s infinite;"></div>
          <div style="position: absolute; bottom: 8rem; left: 10rem; width: 7rem; height: 7rem; background-color: rgba(59, 130, 246, 0.2); border-radius: 50%; animation: pulse 2s infinite;"></div>
          <div style="position: absolute; bottom: 5rem; right: 5rem; width: 5rem; height: 5rem; background-color: rgba(34, 197, 94, 0.2); border-radius: 50%; animation: pulse 2s infinite;"></div>
        </div>

        <!-- Header -->
        <div style="position: relative; z-index: 10; text-align: center; padding: 2rem 0;">
          ${logoUrl ? `
          <!-- Brand Logo -->
          <div style="margin-bottom: 1.5rem;">
            <div style="background: rgba(255, 255, 255, 0.1); backdrop-filter: blur(4px); border-radius: 1rem; padding: 1rem; display: inline-block; border: 1px solid rgba(250, 204, 21, 0.3); box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);">
              <img 
                src="${logoUrl}" 
                alt="${brandName}"
                style="height: 4rem; width: auto; max-width: 200px; display: block; filter: drop-shadow(0 25px 25px rgba(0, 0, 0, 0.15));"
              />
            </div>
          </div>
          ` : ''}
          <h1 style="font-size: 3rem; font-weight: 900; color: #facc15; margin-bottom: 1.5rem; text-shadow: 0 0 1px #ffd700, 0 0 2px #ffd700, 0 1px 0 rgba(0,0,0,0.3);">
            💎 ${brandName.toUpperCase()} 💎
          </h1>
          <p style="font-size: 1.5rem; font-weight: bold; color: #a5f3fc; text-shadow: 0 0 1px #00bfff, 0 0 2px #00bfff, 0 1px 0 rgba(0,0,0,0.3);">
            ⭐ ${headline || 'WIN BIG WITH BONANZA BILLION SLOTS!'} ⭐
          </p>
        </div>

        <!-- Main Game Area -->
        <main style="position: relative; z-index: 10; padding: 0 1rem 2rem; display: flex; justify-content: center; gap: 2rem; max-width: 1200px; margin: 0 auto; flex-wrap: wrap;">
          
          <!-- Slot Machine Container -->
          <div class="slot-machine">
            <div style="text-align: center; margin-bottom: 1.5rem;">
              <h2 style="font-size: 1.5rem; font-weight: 900; color: #facc15; margin-bottom: 0.25rem;">${brandName.toUpperCase()}</h2>
              <h3 style="font-size: 1.25rem; font-weight: bold; color: #facc15;">SLOTS</h3>
            </div>

            <!-- 3x3 Slot Grid -->
            <div class="slot-grid" id="slotGrid">
              <div class="slot-square" id="slot0">🍑</div>
              <div class="slot-square" id="slot1">💎</div>
              <div class="slot-square" id="slot2">🔔</div>
              <div class="slot-square" id="slot3">⭐</div>
              <div class="slot-square" id="slot4">🍀</div>
              <div class="slot-square" id="slot5">🍇</div>
              <div class="slot-square" id="slot6">💰</div>
              <div class="slot-square" id="slot7">🍋</div>
              <div class="slot-square" id="slot8">🍑</div>
            </div>
          </div>

          <!-- Game Controls Panel -->
          <div class="game-controls">
            <div style="text-align: center; margin-bottom: 1.5rem;">
              <h2 style="font-size: 1.5rem; font-weight: 900; color: #facc15;">GAME CONTROLS</h2>
            </div>

            <!-- Bet Display -->
            <div class="control-display">
              <div style="color: #facc15; font-weight: bold; text-align: center; font-size: 1.125rem;">BET: $10</div>
            </div>

            <!-- Balance Display -->
            <div class="control-display">
              <div style="color: #facc15; font-weight: bold; text-align: center; font-size: 1.125rem;">BALANCE: $1,000</div>
            </div>

            <!-- Spin Button -->
            <button class="spin-button" onclick="spinSlots()">
              🎰 ${cta || 'SPIN TO WIN'}
            </button>
          </div>
        </main>

        <!-- Bottom Disclaimer Section -->
        <div style="position: relative; z-index: 10; text-align: center; padding: 2rem 0;">
          <div class="disclaimer">
            <p style="color: #facc15; font-size: 0.875rem; font-weight: 600; letter-spacing: 0.025em; display: flex; align-items: center; justify-content: center; gap: 0.5rem;">
              <span style="color: #f87171; font-weight: 900;">18+</span>
              <span style="color: #d1d5db;">•</span>
              <span>Gamble Responsibly</span>
              <span style="color: #d1d5db;">•</span>
              <span>Terms Apply</span>
            </p>
          </div>
        </div>
      </div>

      <style>
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        @keyframes spin {
          0% { transform: rotateY(0deg); }
          50% { transform: rotateY(180deg); }
          100% { transform: rotateY(360deg); }
        }
        
        .spinning {
          animation: spin 0.5s ease-in-out;
        }
      </style>
      
      <script>
        // Slot Game Class - Exact replica of reference template
        class SlotGame {
            constructor() {
                this.symbols = ['💎', '🍒', '🔔', '🍋', '⭐', '🍊', '🍇'];
                this.reels = [];
                this.balance = 1000;
                this.bet = 10;
                this.isSpinning = false;
                this.spinCount = 0;
                
                this.initializeReels();
                this.setupEventListeners();
                this.updateDisplay();
            }

            initializeReels() {
                // Convert 3x3 grid to 3 reels for compatibility
                for (let i = 0; i < 3; i++) {
                    const reel = {
                        slots: [
                            document.getElementById('slot' + (i * 3)),
                            document.getElementById('slot' + (i * 3 + 1)), 
                            document.getElementById('slot' + (i * 3 + 2))
                        ]
                    };
                    this.reels.push(reel);
                    this.randomizeReel(reel);
                }
            }
            
            randomizeReel(reel) {
                reel.slots.forEach(slot => {
                    const randomSymbol = this.symbols[Math.floor(Math.random() * this.symbols.length)];
                    slot.textContent = randomSymbol;
                });
            }

            setupEventListeners() {
                document.querySelector('.spin-button').addEventListener('click', () => this.spin());
            }

            spin() {
                if (this.isSpinning) return;
                
                if (this.balance < this.bet) {
                    alert('Insufficient balance!');
                    return;
                }
                
                this.isSpinning = true;
                this.balance -= this.bet;
                this.spinCount++;
                this.updateDisplay();
                
                const button = document.querySelector('.spin-button');
                button.style.opacity = '0.7';
                button.style.transform = 'scale(0.95)';
                
                // Start spinning animation
                this.reels.forEach(reel => {
                    reel.slots.forEach(slot => {
                        slot.classList.add('spinning');
                    });
                });

                // Spin for 2.5 seconds
                setTimeout(() => {
                    this.stopSpin();
                }, 2500);
            }

            stopSpin() {
                // Stop reels with staggered timing
                this.reels.forEach((reel, index) => {
                    setTimeout(() => {
                        reel.slots.forEach(slot => {
                            slot.classList.remove('spinning');
                        });
                        
                        // Set final symbols
                        this.randomizeReel(reel);
                        
                        // Check if all reels have stopped
                        if (index === this.reels.length - 1) {
                            setTimeout(() => {
                                this.isSpinning = false;
                                const button = document.querySelector('.spin-button');
                                button.style.opacity = '1';
                                button.style.transform = 'scale(1)';
                                
                                // Force win on 2nd attempt exactly like reference
                                if (this.spinCount === 2) {
                                    this.forceWinWithDelay();
                                } else {
                                    this.checkWin();
                                }
                            }, 300);
                        }
                    }, index * 500);
                });
            }

            checkWin() {
                const slots = [];
                for (let i = 0; i < 9; i++) {
                    slots.push(document.getElementById('slot' + i).textContent);
                }
                
                // Check for winning combinations
                const winPatterns = [
                    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
                    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
                    [0, 4, 8], [2, 4, 6] // diagonals
                ];
                
                let hasWin = false;
                winPatterns.forEach(pattern => {
                    if (slots[pattern[0]] === slots[pattern[1]] && slots[pattern[1]] === slots[pattern[2]]) {
                        hasWin = true;
                        // Highlight winning pattern
                        pattern.forEach(index => {
                            document.getElementById('slot' + index).style.background = 'linear-gradient(to bottom, #fbbf24, #f59e0b)';
                            document.getElementById('slot' + index).style.transform = 'scale(1.1)';
                        });
                    }
                });
                
                if (hasWin) {
                    const winAmount = this.getWinAmount(slots[0]);
                    this.balance += winAmount;
                    this.updateDisplay();
                    
                    setTimeout(() => {
                        this.showBonusModal();
                        // Reset highlighting after celebration
                        for (let i = 0; i < 9; i++) {
                            const slot = document.getElementById('slot' + i);
                            slot.style.background = 'linear-gradient(to bottom, #fb923c, #eab308)';
                            slot.style.transform = 'scale(1)';
                        }
                    }, 2500);
                }
            }

            forceWinWithDelay() {
                // Force a jackpot win with diamonds - exactly like reference
                for (let i = 0; i < 9; i++) {
                    document.getElementById('slot' + i).textContent = '💎';
                    document.getElementById('slot' + i).style.background = 'linear-gradient(to bottom, #fbbf24, #f59e0b)';
                    document.getElementById('slot' + i).style.transform = 'scale(1.1)';
                    document.getElementById('slot' + i).style.boxShadow = '0 0 30px rgba(255, 215, 0, 1)';
                }
                
                const winAmount = 10000;
                this.balance += winAmount;
                this.updateDisplay();
                
                // Wait 2.5 seconds then show bonus modal - exactly like reference
                setTimeout(() => {
                    this.showBonusModal();
                    // Reset highlighting
                    for (let i = 0; i < 9; i++) {
                        const slot = document.getElementById('slot' + i);
                        slot.style.background = 'linear-gradient(to bottom, #fb923c, #eab308)';
                        slot.style.transform = 'scale(1)';
                        slot.style.boxShadow = 'none';
                    }
                }, 2500);
            }

            getWinAmount(symbol) {
                const payouts = {
                    '💎': 10000,
                    '🔔': 5000,
                    '⭐': 3000,
                    '🍒': 2000,
                    '🍋': 1500,
                    '🍊': 1000,
                    '🍇': 500
                };
                return payouts[symbol] || 0;
            }

            updateDisplay() {
                // Update balance display if it exists
                const balanceEl = document.querySelector('.control-display:nth-child(2) div');
                if (balanceEl) {
                    balanceEl.textContent = \`BALANCE: $\${this.balance.toLocaleString()}\`;
                }
            }
            
            showBonusModal() {
                // Create and show modal exactly like reference
                const modal = document.createElement('div');
                modal.style.cssText = \`
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(0,0,0,0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                \`;
                
                const content = document.createElement('div');
                content.style.cssText = \`
                    background: linear-gradient(135deg, #1e3a5f, #2c5282, #3182ce);
                    padding: 50px;
                    border-radius: 25px;
                    text-align: center;
                    border: 4px solid #FFD700;
                    box-shadow: 0 0 80px rgba(255, 215, 0, 0.6);
                    max-width: 600px;
                    width: 90%;
                \`;
                
                content.innerHTML = \`
                    <h2 style="font-size: 2.5rem; margin-bottom: 20px; background: linear-gradient(45deg, #FFD700, #FFA500, #FF6B6B); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">🎉 JACKPOT!</h2>
                    <p style="font-size: 1.2rem; margin-bottom: 30px; color: white;">🎁 <strong>JACKPOT BONUS UNLOCKED!</strong><br><br>You've unlocked your $1000 Welcome Bonus + 100 Free Spins<br><br>Claim your bonus now and keep winning!</p>
                    <a href="https://your-casino-affiliate-link.com" target="_blank" style="background: linear-gradient(135deg, #00ff88 0%, #32cd32 50%, #228b22 100%); color: #000; font-size: 1.6rem; font-weight: 800; padding: 20px 50px; border: 3px solid #fff; border-radius: 60px; text-decoration: none; display: inline-block; text-transform: uppercase; letter-spacing: 2px; box-shadow: 0 15px 40px rgba(0, 255, 136, 0.4);">🎁 CLAIM $1000 BONUS NOW!</a>
                    <div style="position: absolute; top: 15px; right: 25px; color: #aaa; font-size: 28px; font-weight: bold; cursor: pointer;" onclick="this.parentElement.parentElement.remove();">&times;</div>
                \`;
                
                modal.appendChild(content);
                document.body.appendChild(modal);
                
                // Close on background click
                modal.addEventListener('click', (e) => {
                    if (e.target === modal) {
                        modal.remove();
                    }
                });
            }
        }

        // Initialize the game when page loads
        document.addEventListener('DOMContentLoaded', () => {
            new SlotGame();
        });
        
        // Add initial pulse animation
        window.addEventListener('load', () => {
          setTimeout(() => {
            for (let i = 0; i < 9; i++) {
              const slot = document.getElementById('slot' + i);
              slot.style.animation = 'pulse 2s infinite';
              slot.style.animationDelay = (i * 0.1) + 's';
            }
          }, 1000);
        });
      </script>
    </body>
    </html>
  `

  return {
    html,
    css
  }
}
