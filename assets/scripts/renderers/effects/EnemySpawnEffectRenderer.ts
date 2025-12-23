import { Graphics, Color } from 'cc';
import { EnemyType, CyberpunkColors } from '../../constants/Index';
import { UiConfig } from '../../config/Index';

/**
 * 敌人生成特效渲染器
 * 赛博朋克风格：霓虹光晕、动态粒子环、中心闪光
 */
export class EnemySpawnEffectRenderer {
    // 赛博朋克风格敌人颜色配置
    private static readonly ENEMY_COLOR = CyberpunkColors.ENEMY_PRIMARY; // 霓虹红色
    private static readonly ENEMY_DETAIL_COLOR = CyberpunkColors.ENEMY_DETAIL; // 霓虹橙色
    
    /**
     * 渲染敌人生成特效
     * @param graphics Graphics 组件
     * @param size 特效尺寸
     * @param progress 进度（0-1）
     * @param enemyType 敌人类型
     */
    static render(graphics: Graphics, size: number, progress: number, enemyType: EnemyType): void {
        if (!graphics) return;
        
        graphics.clear();
        
        // 计算缩放和透明度
        const { scale, alpha } = this.calculateAnimation(progress);
        
        // 应用缩放变换（通过调整绘制尺寸实现）
        const scaledSize = size * scale;
        
        // 绘制多层光晕（静态部分，使用缩放后的尺寸）
        this.renderHalo(graphics, scaledSize, alpha);
        
        // 绘制动态粒子环（使用缩放后的尺寸）
        this.renderParticleRing(graphics, scaledSize, progress, alpha);
        
        // 绘制中心闪光（使用缩放后的尺寸）
        this.renderFlash(graphics, scaledSize, progress, alpha);
    }
    
    /**
     * 计算动画参数（缩放和透明度）
     */
    private static calculateAnimation(progress: number): { scale: number; alpha: number } {
        // 缩放动画（从0到1.2，然后回弹到1.0，最后淡出）
        let scale = 0;
        if (progress < 0.3) {
            // 出现阶段：快速放大
            scale = (progress / 0.3) * 1.2;
        } else if (progress < 0.7) {
            // 稳定阶段：稍微回弹
            scale = 1.2 - ((progress - 0.3) / 0.4) * 0.2;
        } else {
            // 消失阶段：淡出
            scale = 1.0 - ((progress - 0.7) / 0.3) * 0.3;
        }
        
        // 透明度动画
        let alpha = 1;
        if (progress < 0.2) {
            alpha = progress / 0.2; // 淡入
        } else if (progress > 0.8) {
            alpha = 1 - (progress - 0.8) / 0.2; // 淡出
        }
        
        return { scale, alpha };
    }
    
    /**
     * 绘制多层光晕（静态部分）
     * 使用多层绘制模拟径向渐变效果
     */
    private static renderHalo(graphics: Graphics, size: number, alpha: number): void {
        const maxRadius = size / 2;
        
        // 绘制多层圆形光晕，模拟径向渐变
        for (let i = 0; i < 5; i++) {
            const radius = maxRadius * (0.3 + i * 0.15);
            const layerAlpha = (alpha * (0.2 - i * 0.03));
            
            // 使用多层同心圆模拟渐变效果
            // 从内到外绘制多个圆，逐渐变透明
            const gradientSteps = 8; // 渐变层数
            for (let j = 0; j < gradientSteps; j++) {
                const stepRadius = radius * (j / gradientSteps);
                const stepAlpha = layerAlpha * (1 - j / gradientSteps);
                
                // 中心部分使用细节色，边缘使用主色
                const colorRatio = j / gradientSteps;
                const r = Math.floor(this.ENEMY_DETAIL_COLOR.r * (1 - colorRatio) + this.ENEMY_COLOR.r * colorRatio);
                const g = Math.floor(this.ENEMY_DETAIL_COLOR.g * (1 - colorRatio) + this.ENEMY_COLOR.g * colorRatio);
                const b = Math.floor(this.ENEMY_DETAIL_COLOR.b * (1 - colorRatio) + this.ENEMY_COLOR.b * colorRatio);
                
                graphics.fillColor = new Color(r, g, b, Math.floor(stepAlpha * 255));
                graphics.circle(0, 0, stepRadius);
                graphics.fill();
            }
        }
    }
    
    /**
     * 绘制动态粒子环
     * 使用多层绘制模拟径向渐变效果
     */
    private static renderParticleRing(graphics: Graphics, size: number, progress: number, alpha: number): void {
        const particleCount = 12;
        const particleRadius = 3;
        const ringRadius = size * 0.4 * (1 + progress * 0.5);
        
        for (let i = 0; i < particleCount; i++) {
            const angle = (i / particleCount) * Math.PI * 2 + progress * Math.PI * 2;
            const px = Math.cos(angle) * ringRadius;
            const py = Math.sin(angle) * ringRadius;
            
            const particleAlpha = alpha * (1 - progress * 0.5);
            
            // 使用多层同心圆模拟径向渐变效果
            // 从中心到边缘：细节色 -> 主色 -> 透明
            const gradientSteps = 5;
            for (let j = 0; j < gradientSteps; j++) {
                const stepRadius = particleRadius * (1 - j / gradientSteps);
                const stepAlpha = particleAlpha * (1 - j / gradientSteps);
                
                // 中心使用细节色，边缘使用主色并逐渐透明
                const colorRatio = j / gradientSteps;
                const r = Math.floor(this.ENEMY_DETAIL_COLOR.r * (1 - colorRatio * 0.5) + this.ENEMY_COLOR.r * colorRatio * 0.5);
                const g = Math.floor(this.ENEMY_DETAIL_COLOR.g * (1 - colorRatio * 0.5) + this.ENEMY_COLOR.g * colorRatio * 0.5);
                const b = Math.floor(this.ENEMY_DETAIL_COLOR.b * (1 - colorRatio * 0.5) + this.ENEMY_COLOR.b * colorRatio * 0.5);
                
                graphics.fillColor = new Color(r, g, b, Math.floor(stepAlpha * 255));
                graphics.circle(px, py, stepRadius);
                graphics.fill();
            }
        }
    }
    
    /**
     * 绘制中心闪光
     * 使用多层绘制模拟径向渐变效果
     */
    private static renderFlash(graphics: Graphics, size: number, progress: number, alpha: number): void {
        const flashSize = size * 0.3 * (1 - progress * 0.7);
        
        // 使用多层同心圆模拟径向渐变
        // 从内到外：白色 -> 细节色 -> 主色 -> 透明
        const gradientSteps = 10;
        for (let i = 0; i < gradientSteps; i++) {
            const stepRadius = flashSize * (1 - i / gradientSteps);
            const stepProgress = i / gradientSteps;
            
            // 颜色渐变：白色(0) -> 细节色(0.5) -> 主色(1)
            let r, g, b, stepAlpha;
            if (stepProgress < 0.5) {
                // 白色到细节色
                const ratio = stepProgress * 2;
                r = Math.floor(255 * (1 - ratio) + this.ENEMY_DETAIL_COLOR.r * ratio);
                g = Math.floor(255 * (1 - ratio) + this.ENEMY_DETAIL_COLOR.g * ratio);
                b = Math.floor(255 * (1 - ratio) + this.ENEMY_DETAIL_COLOR.b * ratio);
                stepAlpha = alpha * (0.8 - ratio * 0.4);
            } else {
                // 细节色到主色
                const ratio = (stepProgress - 0.5) * 2;
                r = Math.floor(this.ENEMY_DETAIL_COLOR.r * (1 - ratio) + this.ENEMY_COLOR.r * ratio);
                g = Math.floor(this.ENEMY_DETAIL_COLOR.g * (1 - ratio) + this.ENEMY_COLOR.g * ratio);
                b = Math.floor(this.ENEMY_DETAIL_COLOR.b * (1 - ratio) + this.ENEMY_COLOR.b * ratio);
                stepAlpha = alpha * (0.4 - ratio * 0.4);
            }
            
            graphics.fillColor = new Color(r, g, b, Math.floor(stepAlpha * 255));
            graphics.circle(0, 0, stepRadius);
            graphics.fill();
        }
    }
}

