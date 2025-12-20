/**
 * 敌人常量配置
 * 定义各种敌人的属性配置
 */

/**
 * 敌人类型枚举
 */
export enum EnemyType {
    TANK = 'tank',           // 坦克
    FAST_TANK = 'fast_tank', // 快速坦克
    HEAVY_TANK = 'heavy_tank', // 重型坦克
    BOSS = 'boss'            // Boss
}

/**
 * 敌人配置接口
 */
export interface EnemyConfig {
    type: EnemyType;
    moveSpeed: number;      // 移动速度（像素/秒）
    attackSpeed: number;     // 攻击速度（攻击间隔，秒）
    health: number;          // 生命值
    damage: number;          // 攻击力
    spawnInterval?: number;  // 生成间隔（秒）
}

/**
 * 敌人配置表
 */
export const ENEMY_CONFIGS: Record<EnemyType, EnemyConfig> = {
    [EnemyType.TANK]: {
        type: EnemyType.TANK,
        moveSpeed: 50,      // 100像素/秒
        attackSpeed: 1.0,    // 每秒攻击1次
        health: 100,
        damage: 10,
        spawnInterval: 2.0   // 每2秒生成一个
    },
    [EnemyType.FAST_TANK]: {
        type: EnemyType.FAST_TANK,
        moveSpeed: 75,      // 150像素/秒
        attackSpeed: 0.8,    // 每秒攻击1.25次
        health: 50,
        damage: 8,
        spawnInterval: 1.5   // 每1.5秒生成一个
    },
    [EnemyType.HEAVY_TANK]: {
        type: EnemyType.HEAVY_TANK,
        moveSpeed: 30,       // 60像素/秒
        attackSpeed: 1.5,    // 每1.5秒攻击1次
        health: 200,
        damage: 20,
        spawnInterval: 3.0   // 每3秒生成一个
    },
    [EnemyType.BOSS]: {
        type: EnemyType.BOSS,
        moveSpeed: 40,       // 80像素/秒
        attackSpeed: 0.5,    // 每秒攻击2次
        health: 500,
        damage: 30,
        spawnInterval: 10.0  // 每10秒生成一个
    }
};

/**
 * 获取敌人配置
 * @param type 敌人类型
 * @returns 敌人配置
 */
export function getEnemyConfig(type: EnemyType): EnemyConfig {
    return ENEMY_CONFIGS[type] || ENEMY_CONFIGS[EnemyType.TANK];
}

/**
 * 默认敌人类型
 */
export const DEFAULT_ENEMY_TYPE = EnemyType.TANK;

