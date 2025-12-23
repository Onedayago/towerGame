import { _decorator, Component, Graphics, UITransform, Color, Vec3 } from 'cc';
import { UiConfig } from '../config/Index';
import { CyberpunkColors } from '../constants/Index';
const { ccclass, property } = _decorator;

/**
 * 粒子数据结构
 */
interface Particle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    lifetime: number;
    maxLifetime: number;
    size: number;
    type: 'spark' | 'trail';
}

/**
 * 被攻击时的粒子特效组件
 * 参考原游戏：螺旋扩散的粒子效果
 * 通过预制体创建，自动播放动画后销毁
 */
@ccclass('HitParticleEffect')
export class HitParticleEffect extends Component {
    
    @property({ type: Color, displayName: '粒子颜色', tooltip: '粒子的颜色' })
    public particleColor: Color = CyberpunkColors.EFFECT_HIT; // 赛博朋克风格：霓虹黄色
    
    @property({ displayName: '粒子数量', tooltip: '主粒子的数量' })
    public particleCount: number = 6;
    
    @property({ displayName: '拖尾粒子数量', tooltip: '拖尾粒子的数量' })
    public trailCount: number = 4;
    
    @property({ displayName: '持续时间（秒）', tooltip: '特效持续时间' })
    public duration: number = 0.4; // 400ms，参考原游戏
    
    private graphics: Graphics | null = null;
    private elapsed: number = 0;
    private particles: Particle[] = [];
    
    /**
     * 初始化特效
     * @param position 特效位置
     * @param color 粒子颜色（可选，使用默认或属性值）
     */
    init(position: Vec3, color?: Color) {
        // 设置节点位置
        this.node.setPosition(position);
        
        // 如果提供了颜色，使用提供的颜色
        if (color) {
            this.particleColor = color;
        }
        
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
            finalTransform.setContentSize(300, 300); // 足够大的区域容纳粒子
        }
        
        // 初始化粒子
        this.initParticles();
    }
    
    /**
     * 初始化粒子
     */
    private initParticles() {
        this.particles = [];
        
        // 主火花（螺旋扩散）
        for (let i = 0; i < this.particleCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const spiralOffset = (i / this.particleCount) * Math.PI * 0.5;
            const speed = 30 + Math.random() * 40;
            const vx = Math.cos(angle + spiralOffset) * speed;
            const vy = Math.sin(angle + spiralOffset) * speed;
            
            const particle: Particle = {
                x: 0,
                y: 0,
                vx: vx,
                vy: vy,
                lifetime: 250, // 毫秒
                maxLifetime: 250,
                size: 4 + Math.random() * 4, // 增大粒子尺寸：从 2-4.5 增加到 4-8
                type: 'spark'
            };
            
            this.particles.push(particle);
        }
        
        // 拖尾粒子（慢速）
        for (let i = 0; i < this.trailCount; i++) {
            const angle = Math.random() * Math.PI * 2;
            const speed = 10 + Math.random() * 15;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            const particle: Particle = {
                x: 0,
                y: 0,
                vx: vx,
                vy: vy,
                lifetime: 400, // 毫秒
                maxLifetime: 400,
                size: 3 + Math.random() * 3, // 增大粒子尺寸：从 1.5-3 增加到 3-6
                type: 'trail'
            };
            
            this.particles.push(particle);
        }
    }
    
    update(deltaTime: number) {
        this.elapsed += deltaTime;
        
        // 如果特效结束，销毁节点
        if (this.elapsed >= this.duration) {
            this.node.destroy();
            return;
        }
        
        // 更新粒子
        this.updateParticles(deltaTime);
        
        // 绘制粒子
        this.drawParticles();
    }
    
    /**
     * 更新粒子
     */
    private updateParticles(deltaTime: number) {
        const deltaMS = deltaTime * 1000;
        
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            
            // 更新位置
            particle.x += particle.vx * deltaTime;
            particle.y += particle.vy * deltaTime;
            
            // 应用阻尼
            const damping = 0.98;
            particle.vx *= damping;
            particle.vy *= damping;
            
            // 更新生命周期
            particle.lifetime -= deltaMS;
            
            // 移除过期的粒子
            if (particle.lifetime <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }
    
    /**
     * 绘制粒子
     */
    private drawParticles() {
        if (!this.graphics) return;
        
        this.graphics.clear();
        
        for (const particle of this.particles) {
            const lifeRatio = particle.lifetime / particle.maxLifetime;
            const alpha = Math.floor(lifeRatio * 255);
            const size = particle.size * lifeRatio;
            
            // 设置颜色和透明度
            this.graphics.fillColor = new Color(
                this.particleColor.r,
                this.particleColor.g,
                this.particleColor.b,
                alpha
            );
            
            // 绘制粒子
            this.graphics.circle(particle.x, particle.y, size);
            this.graphics.fill();
        }
    }
}
