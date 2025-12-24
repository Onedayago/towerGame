import { Component, Label, Node, UITransform, Graphics, Color, Vec3 } from 'cc';
import { UiConfig, UiMarginConfig, UiBorderConfig } from '../../../config/Index';
import { CyberpunkColors } from '../../../constants/Index';
import { WeaponManager, GameManager } from '../../../managers/Index';
import { GuideStepBase } from './GuideStepBase';
import { GuideStepMiniMap } from './GuideStepMiniMap';
import { GuideStepGold } from './GuideStepGold';
import { GuideStepWave } from './GuideStepWave';
import { GuideStepPause } from './GuideStepPause';
import { GuideStepWeaponDrag } from './GuideStepWeaponDrag';

/**
 * 引导步骤管理器
 * 管理所有引导步骤的执行
 */
export class GuideStepManager {
    private guideComponent: Component;
    private guideLabel: Label | null = null;
    private weaponManager: WeaponManager | null = null;
    private steps: GuideStepBase[] = [];
    private currentStepIndex: number = 0;
    private highlightNode: Node | null = null;
    private highlightGraphics: Graphics | null = null;
    private blinkTimer: number = 0;
    private blinkInterval: number = 0.6;
    private targetNode: Node | null = null;
    private isHighlighting: boolean = false;
    
    constructor(
        guideComponent: Component,
        guideLabel: Label | null,
        weaponManager: WeaponManager | null,
        stepDuration: number = 2.0
    ) {
        this.guideComponent = guideComponent;
        this.guideLabel = guideLabel;
        this.weaponManager = weaponManager;
        
        // 初始化步骤列表
        this.steps = [
            new GuideStepMiniMap(guideComponent, guideLabel, stepDuration),
            new GuideStepGold(guideComponent, guideLabel, stepDuration),
            new GuideStepWave(guideComponent, guideLabel, stepDuration),
            new GuideStepPause(guideComponent, guideLabel, stepDuration),
            new GuideStepWeaponDrag(guideComponent, guideLabel, weaponManager)
        ];
        
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
     * 开始引导
     */
    start() {
        this.currentStepIndex = 0;
        if (this.steps.length > 0) {
            this.startStep(0);
        }
    }
    
    /**
     * 开始指定步骤
     */
    private startStep(stepIndex: number) {
        if (stepIndex >= this.steps.length) {
            this.complete();
            return;
        }
        
        // 清理上一个步骤
        if (stepIndex > 0) {
            this.steps[stepIndex - 1].cleanup();
        }
        
        const step = this.steps[stepIndex];
        this.currentStepIndex = stepIndex;
        
        // 开始步骤
        step.start();
        
        // 处理高亮
        if (step.shouldHighlightTarget()) {
            const targetNodeName = step.getTargetNodeName();
            // 传递节点名称（可能为 null，用于 WeaponCard 的动态查找）
            this.highlightTarget(targetNodeName);
        } else {
            this.hideHighlight();
        }
    }
    
    /**
     * 更新引导
     */
    update(deltaTime: number) {
        if (this.currentStepIndex >= this.steps.length) return;
        
        const currentStep = this.steps[this.currentStepIndex];
        currentStep.update(deltaTime);
        
        // 只有武器拖拽步骤需要自动检测完成（其他步骤需要用户点击下一步按钮）
        if (currentStep.getStepId() === 'weapon_drag' && currentStep.isCompleted()) {
            this.nextStep();
        }
        
        // 更新高亮闪烁
        if (this.isHighlighting && this.highlightNode && this.highlightNode.active && this.highlightGraphics) {
            this.blinkTimer += deltaTime;
            this.redrawHighlight();
        }
        
        // 更新引导文字闪烁
        this.updateLabelBlink(deltaTime);
    }
    
    /**
     * 更新引导文字闪烁效果
     */
    private updateLabelBlink(deltaTime: number) {
        if (!this.guideLabel || !this.guideLabel.node.active) return;
        
        // 使用与高亮框相同的闪烁逻辑
        const alpha = Math.floor(150 + 105 * Math.sin((this.blinkTimer / this.blinkInterval) * Math.PI * 2));
        const color = this.guideLabel.color.clone();
        color.a = alpha;
        this.guideLabel.color = color;
    }
    
    /**
     * 下一步（公共方法，供外部调用）
     */
    nextStep() {
        if (this.currentStepIndex < this.steps.length) {
            // 强制完成当前步骤
            const currentStep = this.steps[this.currentStepIndex];
            currentStep.complete();
        }
        this.hideHighlight();
        this.startStep(this.currentStepIndex + 1);
    }
    
    /**
     * 完成引导
     */
    private complete() {
        this.hideHighlight();
        if (this.guideLabel) {
            this.guideLabel.node.active = false;
        }
        // 清理所有步骤
        this.steps.forEach(step => step.cleanup());
        // 隐藏引导组件（包括背景）
        if (this.guideComponent && this.guideComponent.node) {
            this.guideComponent.node.active = false;
        }
        // 引导完成后，开始游戏
        const gameManager = GameManager.getInstance();
        gameManager.startGame();
        // 通知引导组件启用交互
        if (this.guideComponent && typeof (this.guideComponent as any).enableInteractions === 'function') {
            (this.guideComponent as any).enableInteractions();
        }
    }
    
    /**
     * 跳过引导
     */
    skip() {
        // 通知引导组件启用交互
        if (this.guideComponent && typeof (this.guideComponent as any).enableInteractions === 'function') {
            (this.guideComponent as any).enableInteractions();
        }
        this.complete();
    }
    
    /**
     * 高亮目标节点
     */
    private highlightTarget(targetNodeName: string | null) {
        if (!this.highlightGraphics || !this.highlightNode) return;
        
        const scene = this.guideComponent.node.scene;
        if (!scene) return;
        
        let targetNode: Node | null = null;
        
        // 如果当前步骤有 getTargetNode 方法，优先使用（用于动态查找，如 WeaponCard）
        if (this.currentStepIndex < this.steps.length) {
            const currentStep = this.steps[this.currentStepIndex];
            const stepTargetNode = currentStep.getTargetNode();
            if (stepTargetNode) {
                targetNode = stepTargetNode;
            }
        }
        
        // 如果通过步骤获取不到，且提供了节点名称，则通过名称查找
        if (!targetNode && targetNodeName) {
            targetNode = this.findNodeByName(scene, targetNodeName);
        }
        
        // 如果还是找不到，且节点名称为 null（表示需要通过组件查找），尝试通过组件查找
        if (!targetNode && targetNodeName === null) {
            // 查找 WeaponContainer
            const weaponContainer = this.findNodeByName(scene, 'WeaponContainer');
            if (weaponContainer) {
                // 查找第一个 WeaponCard 组件（节点名称是 WeaponCard_${weaponType}）
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
        this.isHighlighting = true;
        this.highlightNode.active = true;
        this.blinkTimer = 0;
        
        this.redrawHighlight();
    }
    
    /**
     * 隐藏高亮
     */
    private hideHighlight() {
        this.isHighlighting = false;
        this.targetNode = null;
        if (this.highlightNode) {
            this.highlightNode.active = false;
        }
        if (this.highlightGraphics) {
            this.highlightGraphics.clear();
        }
        this.blinkTimer = 0;
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
     * 获取当前步骤索引
     */
    getCurrentStepIndex(): number {
        return this.currentStepIndex;
    }
    
    /**
     * 获取总步骤数
     */
    getTotalSteps(): number {
        return this.steps.length;
    }
    
    /**
     * 是否还有下一步
     */
    hasNextStep(): boolean {
        return this.currentStepIndex < this.steps.length - 1;
    }
    
    /**
     * 清理资源
     */
    cleanup() {
        this.hideHighlight();
        this.steps.forEach(step => step.cleanup());
    }
}

