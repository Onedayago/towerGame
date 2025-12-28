import { Color } from 'cc';
import { CyberpunkColors } from './CyberpunkColors';

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
        moveSpeed: 30,         // 30像素/秒（平衡调整）
        attackSpeed: 1.5,      // 每1.5秒攻击1次
        health: 400,           // 生命值：400（降低，更容易击杀）
        damage: 12,            // 伤害：12（略微提高威胁）
        attackRange: 200,      // 攻击范围：200像素
        attackDuration: 0.3,   // 攻击持续时间：0.3秒
        spawnInterval: 2.0,    // 每2秒生成一个
        reward: 15             // 击败后奖励15金币（提高奖励，增加可玩性）
    },
    [EnemyType.FAST_TANK]: {
        type: EnemyType.FAST_TANK,
        moveSpeed: 50,         // 50像素/秒（提高速度威胁）
        attackSpeed: 1.0,      // 每1秒攻击1次（更快攻击）
        health: 250,           // 生命值：250（脆皮高速）
        damage: 10,            // 伤害：10（略微提高）
        attackRange: 180,      // 攻击范围：180像素
        attackDuration: 0.25,  // 攻击持续时间：0.25秒
        spawnInterval: 1.5,    // 每1.5秒生成一个
        reward: 12             // 击败后奖励12金币（性价比更高）
    },
    [EnemyType.HEAVY_TANK]: {
        type: EnemyType.HEAVY_TANK,
        moveSpeed: 18,         // 18像素/秒（缓慢但坚韧）
        attackSpeed: 2.0,      // 每2秒攻击1次（慢速攻击）
        health: 800,           // 生命值：800（降低但仍是坦克）
        damage: 25,            // 伤害：25（高伤害威胁）
        attackRange: 250,      // 攻击范围：250像素
        attackDuration: 0.4,   // 攻击持续时间：0.4秒
        spawnInterval: 3.0,    // 每3秒生成一个
        reward: 35             // 击败后奖励35金币（高价值目标）
    },
    [EnemyType.BOSS]: {
        type: EnemyType.BOSS,
        moveSpeed: 22,         // 22像素/秒（中等速度）
        attackSpeed: 1.0,      // 每1秒攻击1次（快速攻击）
        health: 1500,          // 生命值：1500（降低但仍然强大）
        damage: 35,            // 伤害：35（高威胁）
        attackRange: 300,      // 攻击范围：300像素
        attackDuration: 0.35,  // 攻击持续时间：0.35秒
        spawnInterval: 10.0,   // 每10秒生成一个
        reward: 100            // 击败后奖励100金币（高额奖励）
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
 * 定义各种敌人的显示颜色（赛博朋克风格）
 */
export const ENEMY_COLORS: Record<EnemyType, Color> = {
    [EnemyType.TANK]: new Color(255, 100, 50, 255),           // 霓虹橙红色 - 坦克
    [EnemyType.FAST_TANK]: CyberpunkColors.NEON_GREEN,        // 霓虹绿色 - 快速坦克
    [EnemyType.HEAVY_TANK]: CyberpunkColors.NEON_BLUE,        // 霓虹蓝色 - 重型坦克
    [EnemyType.BOSS]: CyberpunkColors.ENEMY_PRIMARY           // 霓虹红色 - Boss（危险感）
};

/**
 * 获取敌人颜色
 * @param type 敌人类型
 * @returns 敌人颜色
 */
export function getEnemyColor(type: EnemyType): Color {
    return ENEMY_COLORS[type] || Color.YELLOW;
}

