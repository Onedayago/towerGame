import { Color } from 'cc';

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
    attackRange: number;     // 攻击范围（像素）
    attackDuration: number;  // 攻击持续时间（秒）
    spawnInterval?: number;  // 生成间隔（秒）
    reward?: number;         // 击败后奖励的金币数量
}

/**
 * 敌人配置表
 */
export const ENEMY_CONFIGS: Record<EnemyType, EnemyConfig> = {
    [EnemyType.TANK]: {
        type: EnemyType.TANK,
        moveSpeed: 25,         // 25像素/秒（减小）
        attackSpeed: 1.0,     // 每秒攻击1次
        health: 500,           // 生命值：500（增加）
        damage: 10,
        attackRange: 300,      // 攻击范围：300像素
        attackDuration: 0.3,  // 攻击持续时间：0.3秒
        spawnInterval: 2.0,   // 每2秒生成一个
        reward: 10            // 击败后奖励10金币
    },
    [EnemyType.FAST_TANK]: {
        type: EnemyType.FAST_TANK,
        moveSpeed: 40,         // 40像素/秒（减小）
        attackSpeed: 0.8,      // 每秒攻击1.25次
        health: 300,           // 生命值：300（增加）
        damage: 8,
        attackRange: 250,      // 攻击范围：250像素
        attackDuration: 0.25,  // 攻击持续时间：0.25秒
        spawnInterval: 1.5,    // 每1.5秒生成一个
        reward: 8              // 击败后奖励8金币
    },
    [EnemyType.HEAVY_TANK]: {
        type: EnemyType.HEAVY_TANK,
        moveSpeed: 15,         // 15像素/秒（减小）
        attackSpeed: 1.5,      // 每1.5秒攻击1次
        health: 1000,          // 生命值：1000（增加）
        damage: 20,
        attackRange: 350,      // 攻击范围：350像素
        attackDuration: 0.4,  // 攻击持续时间：0.4秒
        spawnInterval: 3.0,    // 每3秒生成一个
        reward: 20             // 击败后奖励20金币
    },
    [EnemyType.BOSS]: {
        type: EnemyType.BOSS,
        moveSpeed: 20,         // 20像素/秒（减小）
        attackSpeed: 0.5,      // 每秒攻击2次
        health: 2000,          // 生命值：2000（增加）
        damage: 30,
        attackRange: 400,      // 攻击范围：400像素
        attackDuration: 0.35, // 攻击持续时间：0.35秒
        spawnInterval: 10.0,      // 每10秒生成一个
        reward: 50             // 击败后奖励50金币
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

/**
 * 敌人通用配置常量
 */
export const ENEMY_COMMON_CONFIG = {
    /** 子弹最大飞行距离倍数（相对于攻击范围） */
    BULLET_MAX_DISTANCE_MULTIPLIER: 2.0
} as const;

/**
 * 敌人颜色配置
 * 定义各种敌人的显示颜色
 */
export const ENEMY_COLORS: Record<EnemyType, Color> = {
    [EnemyType.TANK]: Color.YELLOW,
    [EnemyType.FAST_TANK]: Color.GREEN,
    [EnemyType.HEAVY_TANK]: Color.BLUE,
    [EnemyType.BOSS]: Color.RED
};

/**
 * 获取敌人颜色
 * @param type 敌人类型
 * @returns 敌人颜色
 */
export function getEnemyColor(type: EnemyType): Color {
    return ENEMY_COLORS[type] || Color.YELLOW;
}

