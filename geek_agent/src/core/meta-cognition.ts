import { MemorySystem } from './memory-system';

export type CognitiveMode = 'Analyst' | 'Architect' | 'Craftsman' | 'QA' | 'DevOps';

export class MetaCognition {
    private currentMode: CognitiveMode = 'Analyst';
    private stressLevel: number = 0; // 0-100
    private memory: MemorySystem;

    constructor(memory: MemorySystem) {
        this.memory = memory;
    }

    getCurrentMode(): CognitiveMode {
        return this.currentMode;
    }

    setMode(mode: CognitiveMode) {
        this.currentMode = mode;
        this.memory.encode(`Switched cognitive mode to ${mode}`, 'working', ['system', 'mode-switch']);
    }

    analyzeIntent(input: string) {
        // Mock intent recognition
        this.memory.encode(input, 'sensory', ['user-input']);

        if (input.toLowerCase().includes('build') || input.toLowerCase().includes('implement')) {
            return 'Craftsman';
        } else if (input.toLowerCase().includes('design') || input.toLowerCase().includes('how to')) {
            return 'Architect';
        }
        return 'Analyst';
    }

    monitorState() {
        // Check resource usage, session health, etc.
        return {
            mode: this.currentMode,
            stress: this.stressLevel,
            memoryUsage: {
                working: this.memory.getMemories('working').length,
                shortTerm: this.memory.getMemories('short-term').length
            }
        };
    }
}
