import { Node, UITransform, Vec3, tween } from 'cc';
import { UiConfig } from '../../../config/Index';
import { GuideStepBase } from './GuideStepBase';

/**
 * 引导 WarView 控制器
 * 负责管理 WarView 的移动和位置恢复
 */
export class GuideWarViewController {
    private warViewNode: Node | null = null;
    private dragHandler: any = null; // MapDragHandler
    private initialWarViewPosition: Vec3 | null = null;
    private currentTween: any = null;
    
    constructor(warViewNode: Node | null, dragHandler: any) {
        this.warViewNode = warViewNode;
        this.dragHandler = dragHandler;
        
        // 保存 WarView 的初始位置
        if (this.warViewNode) {
            this.initialWarViewPosition = this.warViewNode.position.clone();
        }
    }
    
    /**
     * 保存初始位置（如果还没有保存）
     */
    saveInitialPosition() {
        if (this.warViewNode && !this.initialWarViewPosition) {
            this.initialWarViewPosition = this.warViewNode.position.clone();
        }
    }
    
    /**
     * 启用拖拽
     */
    enableDrag() {
        if (this.dragHandler && typeof this.dragHandler.setEnabled === 'function') {
            this.dragHandler.setEnabled(true);
        }
    }
    
    /**
     * 禁用拖拽
     */
    disableDrag() {
        if (this.dragHandler && typeof this.dragHandler.setEnabled === 'function') {
            this.dragHandler.setEnabled(false);
        }
    }
    
    /**
     * 移动 WarView 使基地在视图中可见（仅用于基地引导）
     */
    moveToTarget() {
        
            // 停止当前的 tween
        if (this.currentTween) {
            this.currentTween.stop();
        }
        
        // 获取 WarView 的尺寸
        const warViewTransform = this.warViewNode.getComponent(UITransform);
        if (!warViewTransform) return;
        
        const viewWidth = warViewTransform.width;
        const viewHeight = warViewTransform.height;
        const viewCenterX = viewWidth / 2;
        const viewCenterY = viewHeight / 2;

        // 使用 tween 平滑移动 WarView
        const targetPos = new Vec3(-viewCenterX, -UiConfig.CELL_SIZE*3, 0);
        this.currentTween = tween(this.warViewNode)
            .to(0.6, { position: targetPos }, { easing: 'sineOut' })
            .call(() => {
                this.currentTween = null;
            })
            .start();
    }
    
    /**
     * 恢复 WarView 到初始位置
     */
    restorePosition() {
        // 停止当前的 tween
        if (this.currentTween) {
            this.currentTween.stop();
            this.currentTween = null;
        }
        
        if (this.warViewNode && this.initialWarViewPosition) {
            // 使用 tween 平滑移动回初始位置
            tween(this.warViewNode)
                .to(0.5, { position: this.initialWarViewPosition }, { easing: 'sineOut' })
                .start();
        }
    }
    
    /**
     * 清理资源
     */
    cleanup() {
        // 停止当前的 tween
        if (this.currentTween) {
            this.currentTween.stop();
            this.currentTween = null;
        }
    }
}

