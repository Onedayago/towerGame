import { Component, Node, UITransform, Graphics, Color, Vec3 } from 'cc';
import { UiConfig, UiMarginConfig, UiBorderConfig } from '../../../config/Index';
import { CyberpunkColors } from '../../../constants/Index';
import { GuideStepBase } from './GuideStepBase';

/**
 * 引导高亮管理器
 * 负责管理引导步骤中的高亮效果
 */
export class GuideHighlightManager {
    private guideComponent: Component;
    private highlightNode: Node | null = null;
    private highlightGraphics: Graphics | null = null;
    private blinkTimer: number = 0;
    private blinkInterval: number = 0.6;
    private targetNode: Node | null = null;
    private targetNodes: Node[] | null = null;
    private isHighlighting: boolean = false;
    private targetNodeMap: Map<string, Node | null>;
    private currentStepIndex: number = 0;
    private steps: GuideStepBase[] = [];
    private getCurrentStepIndex: () => number;
    
    constructor(
        guideComponent: Component,
        targetNodeMap: Map<string, Node | null>,
        steps: GuideStepBase[],
        getCurrentStepIndex: () => number
    ) {
        this.guideComponent = guideComponent;
        this.targetNodeMap = targetNodeMap;
        this.steps = steps;
        // 使用函数来获取当前步骤索引，避免循环依赖
        this.getCurrentStepIndex = getCurrentStepIndex;
        this.initHighlight();
    }
    
    /**
     * 初始化高亮效果
     */
    private initHighlight() {
        const guideNode = this.guideComponent.node;
        this.highlightNode = new Node('GuideHighlight');
        this.highlightNode.setParent(guideNode);
        
        const transform = this.highlightNode.addComponent(UITransform);
        transform.setAnchorPoint(0.5, 0.5);
        transform.setContentSize(UiConfig.GAME_WIDTH, UiConfig.GAME_HEIGHT);
        
        this.highlightGraphics = this.highlightNode.addComponent(Graphics);
        this.highlightNode.active = false;
    }
    
    /**
     * 高亮目标节点
     */
    highlightTarget(targetNodeName: string | null) {
        if (!this.highlightGraphics || !this.highlightNode) return;
        
        const scene = this.guideComponent.node.scene;
        if (!scene) return;
        
        let targetNode: Node | null = null;
        const currentStepIndex = this.getCurrentStepIndex();
        
        // 如果当前步骤有 getTargetNode 方法，优先使用
        if (currentStepIndex < this.steps.length) {
            const currentStep = this.steps[currentStepIndex];
            const stepTargetNode = currentStep.getTargetNode();
            if (stepTargetNode) {
                targetNode = stepTargetNode;
            }
        }
        
        // 检查是否有多个目标节点
        if (currentStepIndex < this.steps.length) {
            const currentStep = this.steps[currentStepIndex];
            const multipleTargetNodes = currentStep.getTargetNodes();
            if (multipleTargetNodes && multipleTargetNodes.length > 0) {
                // 高亮多个节点
                this.targetNodes = multipleTargetNodes;
                this.targetNode = null;
                this.isHighlighting = true;
                this.highlightNode.active = true;
                this.blinkTimer = 0;
                this.redrawHighlight();
                return;
            }
        }
        
        // 如果通过步骤获取不到，且提供了节点名称，则先尝试从映射中获取
        if (!targetNode && targetNodeName) {
            targetNode = this.targetNodeMap.get(targetNodeName) || null;
            
            // 如果映射中没有，则通过名称查找
            if (!targetNode) {
                targetNode = this.findNodeByName(scene, targetNodeName);
            }
        }
        
        // 如果还是找不到，且节点名称为 null，尝试通过组件查找
        if (!targetNode && targetNodeName === null) {
            const weaponContainer = this.findNodeByName(scene, 'WeaponContainer');
            if (weaponContainer) {
                for (let child of weaponContainer.children) {
                    if (child.getComponent('WeaponCard')) {
                        targetNode = child;
                        break;
                    }
                }
            }
        }
        
        if (!targetNode) return;
        
        this.targetNode = targetNode;
        this.targetNodes = null;
        this.isHighlighting = true;
        this.highlightNode.active = true;
        this.blinkTimer = 0;
        
        this.redrawHighlight();
    }
    
    /**
     * 隐藏高亮
     */
    hideHighlight() {
        this.isHighlighting = false;
        this.targetNode = null;
        this.targetNodes = null;
        if (this.highlightNode) {
            this.highlightNode.active = false;
        }
        if (this.highlightGraphics) {
            this.highlightGraphics.clear();
        }
        this.blinkTimer = 0;
    }
    
    /**
     * 更新高亮闪烁
     */
    update(deltaTime: number) {
        if (this.isHighlighting && this.highlightNode && this.highlightNode.active && this.highlightGraphics) {
            this.blinkTimer += deltaTime;
            this.redrawHighlight();
        }
    }
    
    /**
     * 重新绘制高亮框
     */
    private redrawHighlight() {
        if (!this.highlightGraphics || !this.highlightNode || !this.highlightNode.active) {
            return;
        }
        
        if (!this.targetNode || !this.targetNode.isValid) return;
        
        this.highlightGraphics.clear();
        
        const worldPos = this.targetNode.worldPosition;
        const targetTransform = this.targetNode.getComponent(UITransform);
        if (!targetTransform) return;
        
        const width = targetTransform.width;
        const height = targetTransform.height;
        const anchorPoint = targetTransform.anchorPoint;
        
        const localPos = new Vec3();
        this.guideComponent.node.inverseTransformPoint(localPos, worldPos);
        
        const rectX = localPos.x - anchorPoint.x * width;
        const rectY = localPos.y - anchorPoint.y * height;
        
        const padding = UiMarginConfig.GUIDE_HIGHLIGHT_PADDING;
        const glowPadding = UiMarginConfig.GUIDE_HIGHLIGHT_GLOW_PADDING;
        const alpha = Math.floor(150 + 105 * Math.sin((this.blinkTimer / this.blinkInterval) * Math.PI * 2));
        
        // 绘制高亮框
        this.highlightGraphics.strokeColor = new Color(
            CyberpunkColors.NEON_CYAN.r,
            CyberpunkColors.NEON_CYAN.g,
            CyberpunkColors.NEON_CYAN.b,
            alpha
        );
        this.highlightGraphics.lineWidth = UiBorderConfig.THICK_BORDER_WIDTH;
        this.highlightGraphics.rect(
            rectX - padding,
            rectY - padding,
            width + padding * 2,
            height + padding * 2
        );
        this.highlightGraphics.stroke();
        
        // 绘制外发光效果
        this.highlightGraphics.strokeColor = new Color(
            CyberpunkColors.NEON_CYAN.r,
            CyberpunkColors.NEON_CYAN.g,
            CyberpunkColors.NEON_CYAN.b,
            Math.floor(alpha * 0.5)
        );
        this.highlightGraphics.lineWidth = UiBorderConfig.DEFAULT_BORDER_WIDTH;
        this.highlightGraphics.rect(
            rectX - padding - glowPadding,
            rectY - padding - glowPadding,
            width + (padding + glowPadding) * 2,
            height + (padding + glowPadding) * 2
        );
        this.highlightGraphics.stroke();
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
    
    /**
     * 清理资源
     */
    cleanup() {
        this.hideHighlight();
    }
}

