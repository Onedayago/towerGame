import { Component, Label } from 'cc';
import { GuideStepBase } from './GuideStepBase';

/**
 * 波次引导步骤
 */
export class GuideStepWave extends GuideStepBase {
    private stepDuration: number = 2.0;
    private elapsed: number = 0;
    private completed: boolean = false;
    
    constructor(guideComponent: Component, guideLabel: Label | null, stepDuration: number = 2.0) {
        super(guideComponent, guideLabel);
        this.stepDuration = stepDuration;
    }
    
    getStepId(): string {
        return 'wave';
    }
    
    getStepText(): string {
        return '这里显示当前波次信息';
    }
    
    shouldHighlightTarget(): boolean {
        return true;
    }
    
    getTargetNodeName(): string | null {
        return 'WaveView';
    }
    
    start(): void {
        this.completed = false;
        this.elapsed = 0;
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

