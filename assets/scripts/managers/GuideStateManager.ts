/**
 * 引导状态管理器
 * 管理引导是否应该显示的状态
 */
export class GuideStateManager {
    private static instance: GuideStateManager | null = null;
    private shouldShowGuide: boolean | null = null; // null 表示未设置，使用默认行为

    private constructor() {}

    /**
     * 获取单例实例
     */
    static getInstance(): GuideStateManager {
        if (!GuideStateManager.instance) {
            GuideStateManager.instance = new GuideStateManager();
        }
        return GuideStateManager.instance;
    }

    /**
     * 设置是否应该显示引导
     * @param shouldShow 是否应该显示引导
     */
    setShouldShowGuide(shouldShow: boolean) {
        this.shouldShowGuide = shouldShow;
    }

    /**
     * 获取是否应该显示引导
     * @returns true 表示应该显示，false 表示不应该显示，null 表示未设置（使用默认行为）
     */
    getShouldShowGuide(): boolean | null {
        return this.shouldShowGuide;
    }

    /**
     * 重置状态
     */
    reset() {
        this.shouldShowGuide = null;
    }
}

