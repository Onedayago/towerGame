import { Node, UIOpacity } from 'cc';

/**
 * 敌人出现动画管理器
 * 负责处理敌人的出现动画
 */
export class EnemySpawnAnimation {
    private enemyNode: Node;
    private healthBarNode: Node | null = null;
    private uiOpacity: UIOpacity | null = null;
    private isSpawning: boolean = true;
    private spawnAnimationDuration: number = 0.6;
    private spawnAnimationElapsed: number = 0;

    constructor(enemyNode: Node, healthBarNode: Node | null = null) {
        this.enemyNode = enemyNode;
        this.healthBarNode = healthBarNode;
        this.init();
    }

    /**
     * 初始化动画
     */
    private init() {
        this.enemyNode.setScale(0, 0, 1);

        this.uiOpacity = this.enemyNode.getComponent(UIOpacity);
        if (!this.uiOpacity) {
            this.uiOpacity = this.enemyNode.addComponent(UIOpacity);
        }
        this.uiOpacity.opacity = 0;

        this.isSpawning = true;
        this.spawnAnimationElapsed = 0;
    }

    /**
     * 更新动画
     * @param deltaTime 帧时间
     * @returns 动画是否完成
     */
    update(deltaTime: number): boolean {
        if (!this.isSpawning) return true;

        this.spawnAnimationElapsed += deltaTime;
        const progress = Math.min(this.spawnAnimationElapsed / this.spawnAnimationDuration, 1);

        // 缩放动画
        const scale = progress;
        this.enemyNode.setScale(scale, scale, 1);

        // 透明度动画
        const opacity = Math.floor(progress * 255);
        if (this.uiOpacity) {
            this.uiOpacity.opacity = opacity;
        }

        // 血条也跟随透明度变化
        if (this.healthBarNode) {
            let healthBarOpacity = this.healthBarNode.getComponent(UIOpacity);
            if (!healthBarOpacity) {
                healthBarOpacity = this.healthBarNode.addComponent(UIOpacity);
            }
            healthBarOpacity.opacity = opacity;
        }

        // 动画完成
        if (progress >= 1) {
            this.isSpawning = false;
            this.enemyNode.setScale(1, 1, 1);
            if (this.uiOpacity) {
                this.uiOpacity.opacity = 255;
            }
            if (this.healthBarNode) {
                const healthBarOpacity = this.healthBarNode.getComponent(UIOpacity);
                if (healthBarOpacity) {
                    healthBarOpacity.opacity = 255;
                }
            }
            return true;
        }

        return false;
    }

    /**
     * 是否正在出现动画中
     */
    isSpawningNow(): boolean {
        return this.isSpawning;
    }
}

