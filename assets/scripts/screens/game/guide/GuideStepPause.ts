import { Component, Label } from 'cc';
import { GuideStepBase } from './GuideStepBase';

/**
 * 暂停引导步骤
 */
export class GuideStepPause extends GuideStepBase {
    private completed: boolean = false;
    
    constructor(guideComponent: Component, guideLabel: Label | null) {
        super(guideComponent, guideLabel);
    }
    
    getStepId(): string {
        return 'pause';
    }
    
    getStepText(): string {
        return '点击暂停按钮可以暂停/恢复游戏';
    }
    
    shouldHighlightTarget(): boolean {
        return true;
    }
    
    getTargetNodeName(): string | null {
        return 'PauseBtn';
    }
    
    start(): void {
        this.completed = false;
        this.showText(this.getStepText());
    }
    
    update(deltaTime: number): void {
        // 不再自动完成，需要用户点击下一步按钮
    }
    
    complete(): void {
        this.completed = true;
        this.hideText();
    }
    
    cleanup(): void {
        this.hideText();
    }
    
    isCompleted(): boolean {
        return this.completed;
    }
}

