import { _decorator, Component, Graphics, UITransform, Vec3 } from 'cc';
import { UiConfig } from '../config/Index';
import { EnemyType } from '../constants/Index';
import { EnemySpawnEffectRenderer } from '../renderers/effects/EnemySpawnEffectRenderer';
const { ccclass } = _decorator;

/**
 * 敌人生成特效组件
 * 参考原游戏：显示敌人生成时的特效动画
 */
@ccclass('EnemySpawnEffect')
export class EnemySpawnEffect extends Component {
    
    // 特效持续时间（秒）
    private static readonly DURATION = 0.6; // 600ms，参考原游戏
    
    // 特效尺寸倍数（相对于格子大小）
    private static readonly SIZE_SCALE = 1.5; // 参考原游戏
    
    private enemyType: EnemyType;
    private elapsed: number = 0;
    private graphics: Graphics | null = null;
    private size: number = 0;
    
    /**
     * 初始化特效
     * @param position 特效位置
     * @param enemyType 敌人类型
     */
    init(position: Vec3, enemyType: EnemyType) {
        this.enemyType = enemyType;
        this.elapsed = 0;
        this.size = UiConfig.CELL_SIZE * EnemySpawnEffect.SIZE_SCALE;
        
        // 设置节点位置
        this.node.setPosition(position);
        
        // 初始化 Graphics 组件
        this.graphics = this.node.getComponent(Graphics);
        if (!this.graphics) {
            this.graphics = this.node.addComponent(Graphics);
        }
        
        // 设置节点大小
        const transform = this.node.getComponent(UITransform);
        if (!transform) {
            this.node.addComponent(UITransform);
        }
        const finalTransform = this.node.getComponent(UITransform);
        if (finalTransform) {
            finalTransform.setAnchorPoint(0.5, 0.5);
            finalTransform.setContentSize(this.size * 2, this.size * 2);
        }
    }
    
    update(deltaTime: number) {
        this.elapsed += deltaTime;
        
        // 如果特效结束，销毁节点
        if (this.elapsed >= EnemySpawnEffect.DURATION) {
            this.node.destroy();
            return;
        }
        
        // 重新绘制特效
        this.drawEffect();
    }
    
    /**
     * 绘制特效
     */
    private drawEffect() {
        if (!this.graphics) return;
        
        const progress = this.elapsed / EnemySpawnEffect.DURATION;
        
        // 使用渲染器绘制特效
        EnemySpawnEffectRenderer.render(
            this.graphics,
            this.size,
            progress,
            this.enemyType
        );
    }
    
    /**
     * 检查特效是否结束
     */
    isFinished(): boolean {
        return this.elapsed >= EnemySpawnEffect.DURATION;
    }
}

