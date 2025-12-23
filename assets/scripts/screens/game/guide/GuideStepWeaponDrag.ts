import { Component, Label, Node, EventTouch } from 'cc';
import { GuideStepBase } from './GuideStepBase';
import { WeaponManager } from '../../../managers/Index';

/**
 * 武器拖拽引导步骤
 * 需要检测用户操作
 */
export class GuideStepWeaponDrag extends GuideStepBase {
    private weaponManager: WeaponManager | null = null;
    private weaponCountBefore: number = 0;
    private targetNode: Node | null = null;
    private hasPlacedWeapon: boolean = false;
    private completed: boolean = false;
    
    constructor(
        guideComponent: Component, 
        guideLabel: Label | null,
        weaponManager: WeaponManager | null
    ) {
        super(guideComponent, guideLabel);
        this.weaponManager = weaponManager;
        if (this.weaponManager) {
            this.weaponCountBefore = this.weaponManager.getWeaponCount();
        }
    }
    
    getStepId(): string {
        return 'weapon_drag';
    }
    
    getStepText(): string {
        return '拖拽武器卡片到战场放置防御塔';
    }
    
    shouldHighlightTarget(): boolean {
        return true;
    }
    
    getTargetNodeName(): string | null {
        // WeaponCard 节点名称是动态的（WeaponCard_${weaponType}），所以返回 null
        // 高亮逻辑会通过组件查找或 getTargetNode() 方法获取
        return null;
    }
    
    start(): void {
        this.completed = false;
        this.hasPlacedWeapon = false;
        this.showText(this.getStepText());
        
        // 查找目标节点并监听触摸事件
        this.findAndListenTargetNode();
    }
    
    /**
     * 获取目标节点（通过组件查找）
     */
    getTargetNode(): Node | null {
        return this.targetNode;
    }
    
    /**
     * 查找目标节点并监听触摸事件
     */
    private findAndListenTargetNode() {
        const scene = this.guideComponent.node.scene;
        if (!scene) return;
        
        // 查找 WeaponContainer
        const weaponContainer = this.findNodeByName(scene, 'WeaponContainer');
        if (!weaponContainer) return;
        
        // 查找第一个 WeaponCard
        for (let child of weaponContainer.children) {
            if (child.getComponent('WeaponCard')) {
                this.targetNode = child;
                // 监听触摸开始事件
                this.targetNode.on(Node.EventType.TOUCH_START, this.onWeaponCardTouchStart, this);
                break;
            }
        }
    }
    
    /**
     * WeaponCard 触摸开始事件处理
     */
    private onWeaponCardTouchStart = () => {
        // 检测到拖拽开始，可以进入下一步（但需要等待武器放置完成）
        // 这里不直接完成，而是等待武器放置
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
    
    update(deltaTime: number): void {
        if (this.completed || this.hasPlacedWeapon) return;
        
        // 检测武器是否被放置
        if (this.weaponManager) {
            const currentCount = this.weaponManager.getWeaponCount();
            if (currentCount > this.weaponCountBefore) {
                this.hasPlacedWeapon = true;
                this.completed = true;
            }
        }
    }
    
    complete(): void {
        this.completed = true;
        this.hideText();
    }
    
    cleanup(): void {
        // 移除触摸监听
        if (this.targetNode) {
            this.targetNode.off(Node.EventType.TOUCH_START, this.onWeaponCardTouchStart, this);
        }
        this.hideText();
    }
    
    isCompleted(): boolean {
        return this.completed;
    }
}

