package main

import (
	"encoding/json"
	"log"
	"net/http"
	"sync"

	"github.com/gorilla/websocket"
)

const (
	BoardSize = 15
)

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

type Point struct {
	X int `json:"x"`
	Y int `json:"y"`
}

type Move struct {
	X      int `json:"x"`
	Y      int `json:"y"`
	Player int `json:"player"`
}

type Game struct {
	ID      string
	Board   [BoardSize][BoardSize]int
	Turn    int
	Moves   []Move
	Players map[*websocket.Conn]int
	Mutex   sync.RWMutex
}

type Server struct {
	Games map[string]*Game
	Mutex sync.RWMutex
}

var server = &Server{
	Games: make(map[string]*Game),
}

func (g *Game) CheckWin(x, y, player int) bool {
	directions := [][2]int{{1, 0}, {0, 1}, {1, 1}, {1, -1}}

	for _, dir := range directions {
		count := 1
		for i := 1; i < 5; i++ {
			nx, ny := x+dir[0]*i, y+dir[1]*i
			if nx < 0 || nx >= BoardSize || ny < 0 || ny >= BoardSize {
				break
			}
			if g.Board[ny][nx] != player {
				break
			}
			count++
		}
		for i := 1; i < 5; i++ {
			nx, ny := x-dir[0]*i, y-dir[1]*i
			if nx < 0 || nx >= BoardSize || ny < 0 || ny >= BoardSize {
				break
			}
			if g.Board[ny][nx] != player {
				break
			}
			count++
		}
		if count >= 5 {
			return true
		}
	}
	return false
}

func (g *Game) MakeMove(x, y int) (bool, int) {
	g.Mutex.Lock()
	defer g.Mutex.Unlock()

	if x < 0 || x >= BoardSize || y < 0 || y >= BoardSize {
		return false, 0
	}

	if g.Board[y][x] != 0 {
		return false, 0
	}

	player := g.Turn
	g.Board[y][x] = player
	g.Moves = append(g.Moves, Move{X: x, Y: y, Player: player})

	winner := 0
	if g.CheckWin(x, y, player) {
		winner = player
	}

	g.Turn = 3 - g.Turn
	return winner != 0, winner
}

func wsHandler(w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println("WebSocket upgrade error:", err)
		return
	}
	defer conn.Close()

	gameID := r.URL.Query().Get("game")
	if gameID == "" {
		gameID = "default"
	}

	server.Mutex.Lock()
	game, exists := server.Games[gameID]
	if !exists {
		game = &Game{
			ID:      gameID,
			Board:   [BoardSize][BoardSize]int{},
			Turn:    1,
			Players: make(map[*websocket.Conn]int),
		}
		server.Games[gameID] = game
	}

	playerNum := len(game.Players) + 1
	if playerNum > 2 {
		conn.WriteJSON(map[string]interface{}{
			"type": "error",
			"msg":  "Game is full",
		})
		server.Mutex.Unlock()
		return
	}

	game.Players[conn] = playerNum
	server.Mutex.Unlock()

	conn.WriteJSON(map[string]interface{}{
		"type":   "connected",
		"player": playerNum,
		"board":  game.Board,
		"turn":   game.Turn,
		"moves":  game.Moves,
	})

	defer func() {
		game.Mutex.Lock()
		delete(game.Players, conn)
		game.Mutex.Unlock()
	}()

	for {
		_, message, err := conn.ReadMessage()
		if err != nil {
			break
		}

		var move struct {
			X int `json:"x"`
			Y int `json:"y"`
		}

		if err := json.Unmarshal(message, &move); err != nil {
			continue
		}

		if game.Turn != playerNum {
			continue
		}

		won, winner := game.MakeMove(move.X, move.Y)

		msg := map[string]interface{}{
			"type":   "move",
			"move":   Move{X: move.X, Y: move.Y, Player: playerNum},
			"turn":   game.Turn,
			"won":    won,
			"winner": winner,
			"board":  game.Board,
			"moves":  game.Moves,
		}

		game.Mutex.RLock()
		for c := range game.Players {
			c.WriteJSON(msg)
		}
		game.Mutex.RUnlock()
	}
}

func main() {
	http.HandleFunc("/ws", wsHandler)
	http.HandleFunc("/health", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("OK"))
	})

	log.Println("Server starting on :8080")
	log.Fatal(http.ListenAndServe(":8080", nil))
}
