export const DEFAULT_LIMITS = {
    maxTokens: 16000,
    maxForks: 5,
    maxSubsessions: 10,
    maxMemoryMB: 512,
};
export const COMPLEXITY_FORK_MAP = {
    trivial: 1,
    simple: 1,
    medium: 2,
    complex: 3,
    "very-complex": 5,
};
export const COMPLEXITY_TOKEN_ESTIMATE = {
    trivial: 1000,
    simple: 2000,
    medium: 4000,
    complex: 8000,
    "very-complex": 14000,
};
