import { Component, Label, Node } from 'cc';
import { GuideStepBase } from './GuideStepBase';
import { BaseManager } from '../../../managers/Index';

/**
 * 基地引导步骤
 */
export class GuideStepBaseView extends GuideStepBase {
    private completed: boolean = false;
    
    constructor(guideComponent: Component, guideLabel: Label | null) {
        super(guideComponent, guideLabel);
    }
    
    getStepId(): string {
        return 'base_view';
    }
    
    getStepText(): string {
        return '这是你的基地，敌人会攻击它。保护基地不被摧毁！';
    }
    
    shouldHighlightTarget(): boolean {
        return true;
    }
    
    getTargetNodeName(): string | null {
        return null; // 通过 getTargetNode() 方法获取
    }
    
    /**
     * 获取目标节点（基地节点）
     */
    getTargetNode(): Node | null {
        const baseManager = BaseManager.getInstance();
        return baseManager.getBaseNode();
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

