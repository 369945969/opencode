package main

import (
	"bytes"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"time"
)

func main() {
	// Target LM Studio URL (default port 1234)
	target, err := url.Parse("http://localhost:1234")
	if err != nil {
		log.Fatal(err)
	}

	proxy := httputil.NewSingleHostReverseProxy(target)

	// ModifyResponse allows us to intercept the backend's response
	proxy.ModifyResponse = func(res *http.Response) error {
		// Read response body
		body, err := io.ReadAll(res.Body)
		if err != nil {
			return err
		}
		// Put it back for the client
		res.Body = io.NopCloser(bytes.NewBuffer(body))

		path := ""
		if res.Request != nil {
			path = res.Request.URL.Path
		}

		// Log response to app.log
		go logToAppLog("RESPONSE", body, path)
		return nil
	}

	pathAliases := map[string]string{
		"/chat/completions": "/v1/chat/completions",
		"/completions":      "/v1/completions",
		"/models":           "/v1/models",
		"/embeddings":       "/v1/embeddings",
		"/responses":        "/v1/responses",
		"/messages":         "/v1/messages",
	}

	// Custom handler to intercept and log messages
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		// Apply path aliasing
		originalPath := r.URL.Path
		if aliasedPath, ok := pathAliases[originalPath]; ok {
			r.URL.Path = aliasedPath
			log.Printf("Path Alias applied: %s -> %s\n", originalPath, aliasedPath)
		}

		// Log request info and forwarding target to console
		targetPath := r.URL.Path
		if r.URL.RawQuery != "" {
			targetPath += "?" + r.URL.RawQuery
		}
		logMsg := fmt.Sprintf("Incoming: %s %s %s -> Forwarding to: %s://%s%s", r.RemoteAddr, r.Method, r.URL.RequestURI(), target.Scheme, target.Host, targetPath)
		fmt.Println(logMsg)

		// Intercept request body
		if r.Method == http.MethodPost {
			body, err := io.ReadAll(r.Body)
			if err == nil {
				r.Body = io.NopCloser(bytes.NewBuffer(body))
				// Log request to app.log
				go logToAppLog("REQUEST", body, r.URL.Path)
			}
		} else {
			// Still log the visit for non-POST requests
			go logToAppLog("VISIT", nil, r.URL.Path)
		}

		proxy.ServeHTTP(w, r)
	})

	port := "7070"
	fmt.Printf("LM Studio Proxy is running on :%s\n", port)
	fmt.Printf("Forwarding requests to %s\n", target)
	fmt.Println("Logging requests and responses to app.log")

	log.Fatal(http.ListenAndServe(":"+port, nil))
}

func logToAppLog(label string, body []byte, path string) {
	// Open or create the log file
	f, err := os.OpenFile("app.log", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
	if err != nil {
		return
	}
	defer f.Close()

	timestamp := time.Now().Format("2006-01-02 15:04:05")

	if body == nil {
		fmt.Fprintf(f, "[%s] %s: %s\n", timestamp, label, path)
		return
	}

	// Try to format as JSON if possible
	var jsonObj interface{}
	if err := json.Unmarshal(body, &jsonObj); err == nil {
		logData, _ := json.Marshal(struct {
			Timestamp string      `json:"timestamp"`
			Label     string      `json:"label"`
			Path      string      `json:"path"`
			Data      interface{} `json:"data"`
		}{
			Timestamp: timestamp,
			Label:     label,
			Path:      path,
			Data:      jsonObj,
		})
		fmt.Fprintf(f, "%s\n", logData)
	} else {
		// Fallback to raw string
		fmt.Fprintf(f, "[%s] %s: %s | Body: %s\n", timestamp, label, path, string(body))
	}
}
