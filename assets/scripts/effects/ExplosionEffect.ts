import { _decorator, Component, Graphics, UITransform, Color, Vec3 } from 'cc';
import { UiConfig } from '../config/Index';
import { CyberpunkColors } from '../constants/Index';
const { ccclass, property } = _decorator;

/**
 * 爆炸粒子数据结构
 */
interface ExplosionParticle {
    x: number;
    y: number;
    vx: number;
    vy: number;
    lifetime: number;
    maxLifetime: number;
    size: number;
    currentSize: number;
    type: 'explosion' | 'shockwave' | 'spark';
    gravity: number;
}

/**
 * 爆炸特效组件
 * 参考原游戏：快速外扩的粒子、冲击波、向上飞溅的火花
 * 通过预制体创建，自动播放动画后销毁
 */
@ccclass('ExplosionEffect')
export class ExplosionEffect extends Component {
    
    @property({ type: Color, displayName: '爆炸颜色', tooltip: '爆炸粒子的颜色' })
    public explosionColor: Color = CyberpunkColors.EFFECT_EXPLOSION; // 赛博朋克风格：霓虹橙色
    
    @property({ displayName: '主粒子数量', tooltip: '主爆炸粒子的数量' })
    public mainParticleCount: number = 8;
    
    @property({ displayName: '冲击波粒子数量', tooltip: '冲击波粒子的数量' })
    public shockwaveCount: number = 8;
    
    @property({ displayName: '火花粒子数量', tooltip: '向上飞溅的火花粒子数量' })
    public sparkCount: number = 6;
    
    @property({ displayName: '持续时间（秒）', tooltip: '特效持续时间' })
    public duration: number = 0.8; // 800ms，参考原游戏
    
    private graphics: Graphics | null = null;
    private elapsed: number = 0;
    private particles: ExplosionParticle[] = [];
    
    /**
     * 初始化特效
     * @param position 特效位置
     * @param color 爆炸颜色（可选，使用默认或属性值）
     */
    init(position: Vec3, color?: Color) {
        // 设置节点位置
        this.node.setPosition(position);
        
        // 如果提供了颜色，使用提供的颜色
        if (color) {
            this.explosionColor = color;
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
            finalTransform.setContentSize(400, 400); // 足够大的区域容纳爆炸粒子
        }
        
        // 初始化粒子
        this.initParticles();
    }
    
    /**
     * 初始化粒子
     */
    private initParticles() {
        this.particles = [];
        
        // 主爆炸粒子（快速外扩）
        for (let i = 0; i < this.mainParticleCount; i++) {
            const angle = (Math.PI * 2 * i) / this.mainParticleCount + (Math.random() - 0.5) * 0.3;
            const speed = 80 + Math.random() * 60;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            const particle: ExplosionParticle = {
                x: 0,
                y: 0,
                vx: vx,
                vy: vy,
                lifetime: 600, // 毫秒
                maxLifetime: 600,
                size: 4 + Math.random() * 4,
                currentSize: 0,
                type: 'explosion',
                gravity: 0
            };
            particle.currentSize = particle.size;
            
            this.particles.push(particle);
        }
        
        // 冲击波粒子（慢速扩散）
        for (let i = 0; i < this.shockwaveCount; i++) {
            const angle = (Math.PI * 2 * i) / this.shockwaveCount;
            const speed = 40 + Math.random() * 20;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            const particle: ExplosionParticle = {
                x: 0,
                y: 0,
                vx: vx,
                vy: vy,
                lifetime: 800, // 毫秒
                maxLifetime: 800,
                size: 6 + Math.random() * 3,
                currentSize: 0,
                type: 'shockwave',
                gravity: 0
            };
            particle.currentSize = particle.size;
            
            this.particles.push(particle);
        }
        
        // 核心火花（向上飞溅）
        for (let i = 0; i < this.sparkCount; i++) {
            const angle = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI / 3;
            const speed = 100 + Math.random() * 50;
            const vx = Math.cos(angle) * speed;
            const vy = Math.sin(angle) * speed;
            
            const particle: ExplosionParticle = {
                x: 0,
                y: 0,
                vx: vx,
                vy: vy - 20, // 添加初始向上速度
                lifetime: 400, // 毫秒
                maxLifetime: 400,
                size: 3 + Math.random() * 2,
                currentSize: 0,
                type: 'spark',
                gravity: 150 // 重力加速度
            };
            particle.currentSize = particle.size;
            
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
            
            // 应用重力（仅对火花粒子）
            if (particle.type === 'spark' && particle.gravity) {
                particle.vy += particle.gravity * deltaTime;
            }
            
            // 应用阻尼
            const damping = particle.type === 'shockwave' ? 0.95 : 0.98;
            particle.vx *= damping;
            particle.vy *= damping;
            
            // 更新生命周期
            particle.lifetime -= deltaMS;
            
            // 更新粒子尺寸
            const lifeRatio = particle.lifetime / particle.maxLifetime;
            if (particle.type === 'explosion' || particle.type === 'shockwave') {
                // 爆炸粒子先变大再缩小
                particle.currentSize = particle.size * (1 + (1 - lifeRatio) * 0.5) * lifeRatio;
            } else {
                // 其他粒子线性缩小
                particle.currentSize = particle.size * lifeRatio;
            }
            
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
            
            // 设置颜色和透明度
            this.graphics.fillColor = new Color(
                this.explosionColor.r,
                this.explosionColor.g,
                this.explosionColor.b,
                alpha
            );
            
            // 绘制粒子
            this.graphics.circle(particle.x, particle.y, particle.currentSize);
            this.graphics.fill();
        }
    }
}
