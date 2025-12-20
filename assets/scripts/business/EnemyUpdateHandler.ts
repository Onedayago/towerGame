import { Node } from 'cc';

/**
 * 敌人更新处理器
 * 负责处理所有敌人的更新逻辑（移动、攻击、边界检查等）
 */
export class EnemyUpdateHandler {
    private enemies: Node[] = [];
    private containerWidth: number = 0;

    constructor(containerWidth: number) {
        this.containerWidth = containerWidth;
    }

    /**
     * 添加敌人到更新列表
     */
    addEnemy(enemy: Node) {
        this.enemies.push(enemy);
    }

    /**
     * 更新所有敌人
     * @param deltaTime 帧时间
     */
    update(deltaTime: number) {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            if (!enemy || !enemy.isValid) {
                this.enemies.splice(i, 1);
                continue;
            }

            // 更新敌人位置和攻击
            this.updateEnemy(enemy, deltaTime);

            // 检查是否超出边界
            if (this.isOutOfBounds(enemy)) {
                enemy.destroy();
                this.enemies.splice(i, 1);
            }
        }
    }

    /**
     * 更新单个敌人
     */
    private updateEnemy(enemy: Node, deltaTime: number) {
        // 尝试查找 EnemyBase 或其子类组件
        const enemyComponent = enemy.getComponent('EnemyBase') || 
                               enemy.getComponent('EnemyTank') ||
                               enemy.getComponent('EnemyFastTank') ||
                               enemy.getComponent('EnemyHeavyTank') ||
                               enemy.getComponent('EnemyBoss');
        
        if (enemyComponent) {
            if (typeof (enemyComponent as any).updatePosition === 'function') {
                (enemyComponent as any).updatePosition(deltaTime, this.containerWidth);
            }
            if (typeof (enemyComponent as any).updateAttack === 'function') {
                (enemyComponent as any).updateAttack(deltaTime);
            }
        }
    }

    /**
     * 检查敌人是否超出边界
     */
    private isOutOfBounds(enemy: Node): boolean {
        const currentPos = enemy.position;
        return currentPos.x > this.containerWidth;
    }

    /**
     * 移除敌人
     */
    removeEnemy(enemy: Node) {
        const index = this.enemies.indexOf(enemy);
        if (index !== -1) {
            this.enemies.splice(index, 1);
        }
    }

    /**
     * 清理所有敌人
     */
    clearAll() {
        this.enemies.forEach(enemy => {
            if (enemy && enemy.isValid) {
                enemy.destroy();
            }
        });
        this.enemies = [];
    }

    /**
     * 设置容器宽度
     */
    setContainerWidth(width: number) {
        this.containerWidth = width;
    }

    /**
     * 获取当前敌人数量
     */
    getEnemyCount(): number {
        return this.enemies.length;
    }
}

