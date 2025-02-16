export const GameSettings = {
    enemies: {
        spawnInterval: 2000, // Time in ms between spawn attempts
        spawnChance: 1,    // Probability of spawning on each attempt
        spawnMargin: 20,     // Distance outside the camera view to spawn
    },
} as const

// Type for the settings object
export type GameSettingsType = typeof GameSettings 