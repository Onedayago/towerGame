import { Component, Node, Label } from 'cc';

/**
 * 引导步骤基类
 * 所有引导步骤都应该继承此类
 */
export abstract class GuideStepBase {
    protected guideComponent: Component;
    protected guideLabel: Label | null = null;
    
    constructor(guideComponent: Component, guideLabel: Label | null) {
        this.guideComponent = guideComponent;
        this.guideLabel = guideLabel;
    }
    
    /**
     * 步骤ID
     */
    abstract getStepId(): string;
    
    /**
     * 步骤提示文字
     */
    abstract getStepText(): string;
    
    /**
     * 是否需要高亮目标节点
     */
    abstract shouldHighlightTarget(): boolean;
    
    /**
     * 获取目标节点名称（如果需要高亮）
     */
    abstract getTargetNodeName(): string | null;
    
    /**
     * 获取目标节点（如果需要通过组件查找，可以重写此方法）
     */
    getTargetNode(): Node | null {
        return null;
    }
    
    /**
     * 获取多个目标节点（如果需要高亮多个节点，可以重写此方法）
     * 返回 null 表示使用单个节点高亮，返回数组表示高亮多个节点
     */
    getTargetNodes(): Node[] | null {
        return null;
    }
    
    /**
     * 开始步骤
     */
    abstract start(): void;
    
    /**
     * 更新步骤（每帧调用）
     */
    update(deltaTime: number): void {
        // 默认不执行任何操作
    }
    
    /**
     * 完成步骤
     */
    abstract complete(): void;
    
    /**
     * 清理步骤资源
     */
    abstract cleanup(): void;
    
    /**
     * 是否已完成
     */
    abstract isCompleted(): boolean;
    
    /**
     * 显示提示文字
     */
    protected showText(text: string) {
        if (this.guideLabel && this.guideLabel.node && this.guideLabel.node.isValid) {
            this.guideLabel.string = text;
            this.guideLabel.node.active = true;
        }
    }
    
    /**
     * 隐藏提示文字
     */
    protected hideText() {
        if (this.guideLabel && this.guideLabel.node && this.guideLabel.node.isValid) {
            this.guideLabel.node.active = false;
        }
    }
}

