import { Component, Label, Node, UITransform } from 'cc';
import { GuideStepBase } from './GuideStepBase';
import { UiConfig } from '../../../config/Index';

/**
 * 敌人生成列引导步骤
 * 引导玩家了解敌人生成位置
 */
export class GuideStepEnemySpawn extends GuideStepBase {
    private completed: boolean = false;
    private spawnAreaNode: Node | null = null;
    
    constructor(guideComponent: Component, guideLabel: Label | null) {
        super(guideComponent, guideLabel);
    }
    
    getStepId(): string {
        return 'enemy_spawn';
    }
    
    getStepText(): string {
        return '敌人会从左侧第一列随机位置生成，然后向基地移动';
    }
    
    shouldHighlightTarget(): boolean {
        return true;
    }
    
    getTargetNodeName(): string | null {
        return null; // 通过 getTargetNode() 方法获取虚拟节点
    }
    
    /**
     * 获取目标节点（创建虚拟节点代表敌人生成列）
     */
    getTargetNode(): Node | null {
        if (!this.spawnAreaNode) {
            this.createSpawnAreaNode();
        }
        return this.spawnAreaNode;
    }
    
    /**
     * 创建敌人生成区域的虚拟节点
     */
    private createSpawnAreaNode() {
        const scene = this.guideComponent.node.scene;
        if (!scene) return;
        
        // 查找 WarView 节点
        const warViewNode = this.findNodeByName(scene, 'WarView');
        if (!warViewNode) return;
        
        const warViewTransform = warViewNode.getComponent(UITransform);
        if (!warViewTransform) return;
        
        // 创建虚拟节点代表敌人生成列
        this.spawnAreaNode = new Node('EnemySpawnArea');
        this.spawnAreaNode.setParent(warViewNode);
        
        const cellSize = UiConfig.CELL_SIZE;
        const containerHeight = warViewTransform.height;
        
        // 敌人生成列：第一列（x = cellSize / 2），高度为整个容器高度
        const spawnAreaTransform = this.spawnAreaNode.addComponent(UITransform);
        spawnAreaTransform.setAnchorPoint(0, 0); // 左下角锚点
        spawnAreaTransform.setContentSize(cellSize, containerHeight);
        
        // 设置位置：第一列（x = 0，因为锚点在左下角）
        this.spawnAreaNode.setPosition(0, 0, 0);
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
        // 清理虚拟节点
        if (this.spawnAreaNode && this.spawnAreaNode.isValid) {
            this.spawnAreaNode.destroy();
            this.spawnAreaNode = null;
        }
        this.hideText();
    }
    
    isCompleted(): boolean {
        return this.completed;
    }
}

