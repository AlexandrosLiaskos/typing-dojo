# Typing Training Data

This directory contains all your typing training data in transparent JSON format.

## Files

### `stats.json`
Your personal typing statistics:
```json
{
  "sessionsCompleted": 0,
  "averageWpm": 0,
  "lastWpm": 0,
  "lastAccuracy": 0,
  "bestWpm": 0,
  "bestAccuracy": 0,
  "totalPoints": 0
}
```

### `profile.json`
Your user profile:
```json
{
  "name": "Guest User",
  "email": "",
  "githubConnected": false
}
```

### `leaderboard.json`
Leaderboard entries (can be shared via git):
```json
[
  {
    "name": "User Name",
    "wpm": 85.5,
    "accuracy": 98.5,
    "points": 2500,
    "sessions": 10,
    "timestamp": 1234567890
  }
]
```

## Features

- **Full Transparency**: All data is stored as readable JSON
- **Direct Editing**: You can manually edit any file
- **Version Control**: Commit these files to track progress over time
- **Shareable Leaderboard**: Commit `leaderboard.json` to compete with teammates

## Usage

Click on any "View X File" item in the sidebar to open and inspect the data.
All changes are automatically saved when you complete typing sessions.
