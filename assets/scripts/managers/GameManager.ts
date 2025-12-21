/**
 * 游戏管理器
 * 管理游戏状态
 */
export class GameManager {
    private static instance: GameManager | null = null;
    private isGameStarted: boolean = false;
    private isGamePaused: boolean = false;

    private constructor() {}

    /**
     * 获取单例实例
     */
    static getInstance(): GameManager {
        if (!GameManager.instance) {
            GameManager.instance = new GameManager();
        }
        return GameManager.instance;
    }

    /**
     * 开始游戏
     */
    startGame() {
        this.isGameStarted = true;
        this.isGamePaused = false;
    }

    /**
     * 暂停游戏
     */
    pauseGame() {
        this.isGamePaused = true;
    }

    /**
     * 恢复游戏
     */
    resumeGame() {
        this.isGamePaused = false;
    }

    /**
     * 停止游戏
     */
    stopGame() {
        this.isGameStarted = false;
        this.isGamePaused = false;
    }

    /**
     * 检查游戏是否已开始
     */
    isStarted(): boolean {
        return this.isGameStarted;
    }

    /**
     * 检查游戏是否暂停
     */
    isPaused(): boolean {
        return this.isGamePaused;
    }

    /**
     * 检查游戏是否可以更新（已开始且未暂停）
     */
    canUpdate(): boolean {
        return this.isGameStarted && !this.isGamePaused;
    }
}

