import { Component, Label, Node } from 'cc';
import { GuideStepBase } from './GuideStepBase';
import { ObstacleManager } from '../../../managers/Index';

/**
 * 障碍物引导步骤
 */
export class GuideStepObstacle extends GuideStepBase {
    private completed: boolean = false;
    
    constructor(guideComponent: Component, guideLabel: Label | null) {
        super(guideComponent, guideLabel);
    }
    
    getStepId(): string {
        return 'obstacle';
    }
    
    getStepText(): string {
        return '战场上有障碍物，它们会阻挡敌人和武器的视线，影响战斗策略';
    }
    
    shouldHighlightTarget(): boolean {
        return true;
    }
    
    getTargetNodeName(): string | null {
        return null; // 通过 getTargetNode() 方法获取第一个障碍物
    }
    
    /**
     * 获取目标节点（第一个障碍物节点，用于向后兼容）
     */
    getTargetNode(): Node | null {
        const obstacles = this.getAllObstacles();
        return obstacles.length > 0 ? obstacles[0] : null;
    }
    
    /**
     * 获取所有障碍物节点
     */
    getTargetNodes(): Node[] | null {
        return this.getAllObstacles();
    }
    
    /**
     * 获取所有障碍物节点（内部方法）
     */
    private getAllObstacles(): Node[] {
        const scene = this.guideComponent.node.scene;
        if (!scene) return [];
        
        // 尝试查找 WarView 节点
        const warViewNode = this.findNodeByName(scene, 'WarView');
        if (!warViewNode) return [];
        
        // 获取 WarView 组件
        const warViewComponent = warViewNode.getComponent('WarView');
        if (!warViewComponent) return [];
        
        // 通过 WarView 获取 ObstacleManager
        const obstacleManager = (warViewComponent as any).getObstacleManager();
        if (!obstacleManager) return [];
        
        // 获取所有障碍物
        return obstacleManager.getAllObstacles();
    }
    
    /**
     * 递归查找节点
     */
    private findNodeByName(node: Node, name: string): Node | null {
        if (node.name === name) {
            return node;
        }
        for (let child of node.children) {
            const result = this.findNodeByName(child, name);
            if (result) {
                return result;
            }
        }
        return null;
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

